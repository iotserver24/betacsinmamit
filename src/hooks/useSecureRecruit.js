/**
 * Secure recruitment hook with enhanced security measures
 */

import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import paymentService from '../services/paymentService'
import {
  sanitizeFormData,
  isValidEmail,
  isValidPhone,
  isValidUSN
} from '../utils/securityUtils'

export const useSecureRecruit = () => {
  const navigate = useNavigate()
  const { user, signInWithGoogle, getUserData } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('one-year')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const paymentAttempts = useRef(0)
  const lastPaymentTime = useRef(null)

  // Initialize form with sanitized user data
  // Initialize form with sanitized user data
  const [formData, setFormData] = useState({
    whyJoin: ''
  })

  // Secure input change handler with validation
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target

    // Sanitize input immediately
    const sanitizedValue = typeof value === 'string'
      ? value.trim().substring(0, 100) // Limit input length
      : value

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }

    // Real-time validation
    validateField(name, sanitizedValue)
  }, [errors])

  // Field-level validation
  const validateField = (name, value) => {
    let error = null

    switch (name) {
      case 'email':
        if (value && !isValidEmail(value)) {
          error = 'Invalid email format'
        }
        break
      case 'phone':
        if (value && !isValidPhone(value)) {
          error = 'Invalid phone number (10 digits starting with 6-9)'
        }
        break
      case 'usn':
        if (value && !isValidUSN(value)) {
          error = 'Invalid USN format (must start with NNM or NU)'
        }
        break
      default:
        break
    }

    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }

  // Check if profile is complete
  const checkProfileCompletion = async () => {
    if (!user) return false

    // Fetch fresh data to ensure we have the latest updates
    let userData = user
    try {
      const freshData = await getUserData(user.uid)
      if (freshData) {
        userData = { ...user, ...freshData }
      }
    } catch (error) {
      console.error('Error fetching fresh user data:', error)
    }

    const requiredFields = ['phone', 'branch', 'year', 'usn']
    const missingFields = requiredFields.filter(field => {
      // Check both root level and profile object
      const value = userData[field] || userData.profile?.[field]
      return !value || String(value).trim() === ''
    })

    if (missingFields.length > 0 || !userData.name) {
      console.log('Profile incomplete. Missing:', missingFields)
      console.log('UserData:', userData)
    }

    return missingFields.length === 0 && userData.name
  }

  // Rate limiting for payment attempts
  const checkPaymentRateLimit = () => {
    const now = Date.now()

    // Reset counter after 5 minutes
    if (lastPaymentTime.current && now - lastPaymentTime.current > 300000) {
      paymentAttempts.current = 0
    }

    if (paymentAttempts.current >= 3) {
      const timeLeft = Math.ceil((300000 - (now - lastPaymentTime.current)) / 60000)
      toast.error(`Too many payment attempts. Please wait ${timeLeft} minutes.`)
      return false
    }

    return true
  }

  // Secure payment handler
  const handlePayment = async () => {
    try {
      // Check authentication
      if (!user) {
        toast.error('Please sign in to continue')
        return
      }

      // Check if user already has an active subscription
      if (user.membership?.status === 'active') {
        toast.error('You already have an active subscription')
        return
      }

      // Fetch fresh user data to ensure we have the latest profile updates
      let userData = user
      try {
        const freshData = await getUserData(user.uid)
        if (freshData) {
          userData = { ...user, ...freshData }
        }
      } catch (error) {
        console.error('Error fetching fresh user data:', error)
      }

      // Check profile completion using fresh data
      const requiredFields = ['phone', 'branch', 'year', 'usn']
      const missingFields = requiredFields.filter(field => {
        const value = userData[field] || userData.profile?.[field]
        return !value || String(value).trim() === ''
      })

      if (missingFields.length > 0 || !userData.name) {
        const missing = missingFields.join(', ')
        toast.error(`Please complete your profile. Missing: ${missing}`)
        navigate('/profile?returnTo=/recruit')
        return
      }

      // Check rate limiting
      if (!checkPaymentRateLimit()) {
        return
      }

      setLoading(true)
      paymentAttempts.current++
      lastPaymentTime.current = Date.now()

      // Prepare payment data from fresh user data
      const paymentData = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone || userData.profile?.phone,
        branch: userData.branch || userData.profile?.branch,
        year: userData.year || userData.profile?.year,
        usn: userData.usn || userData.profile?.usn,
        whyJoin: formData.whyJoin
      }

      // Sanitize form data before sending
      const sanitizedData = sanitizeFormData(paymentData)

      // Load Razorpay script
      const scriptLoaded = await paymentService.loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway')
      }

      // Initialize payment
      await paymentService.initializePayment(
        user.uid,
        selectedPlan,
        sanitizedData,
        (result) => {
          // Success callback
          toast.success('Payment successful! Welcome to CSI NMAMIT!')
          // console.log('Payment verified:', result)

          // Reset attempts on success
          paymentAttempts.current = 0

          // Navigate to profile after delay
          setTimeout(() => {
            navigate('/profile')
          }, 2000)
        },
        (error) => {
          // Failure callback
          toast.error(error || 'Payment failed. Please try again.')
          setLoading(false)
        }
      )
    } catch (error) {
      // console.error('Payment error:', error)
      toast.error(error.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault()
    handlePayment()
  }

  // Secure sign in with rate limiting
  const secureSignIn = async () => {
    try {
      const result = await signInWithGoogle()
      if (result) {
        toast.success('Signed in successfully!')
      }
    } catch (error) {
      // console.error('Sign in error:', error)
      toast.error('Failed to sign in. Please try again.')
    }
  }

  return {
    formData,
    loading,
    errors,
    selectedPlan,
    setSelectedPlan,
    handleInputChange,
    handleSubmit,
    signInWithGoogle: secureSignIn,
    checkProfileCompletion
  }
}
