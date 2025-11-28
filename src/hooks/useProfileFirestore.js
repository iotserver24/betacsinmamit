import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

/**
 * Custom hook for managing profile data with Firestore
 */
export const useProfileFirestore = () => {
  const { user, updateUserProfile } = useAuth()
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    college: 'NMAMIT',
    branch: '',
    year: '',
    bio: '',
    usn: '',
    github: '',
    linkedin: ''
  })
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [originalData, setOriginalData] = useState(null)

  // Fetch profile data from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          const data = userSnap.data()
          const profile = {
            name: data.name || user.name || '',
            email: data.email || user.email || '',
            phone: data.phone || data.profile?.phone || '',
            college: data.profile?.college || 'NMAMIT',
            branch: data.branch || data.profile?.branch || '',
            year: data.profile?.year || '',
            bio: data.bio || data.profile?.bio || '',
            usn: data.usn || '',
            github: data.github || '',
            linkedin: data.linkedin || ''
          }
          setProfileData(profile)
          setOriginalData(profile)
        } else {
          // New user: preload with auth info
          const profile = {
            name: user.name || user.displayName || '',
            email: user.email || '',
            phone: '',
            college: 'NMAMIT',
            branch: '',
            year: '',
            bio: '',
            usn: '',
            github: '',
            linkedin: ''
          }
          setProfileData(profile)
          setOriginalData(profile)
        }
      } catch (error) {
        // console.error('Error fetching profile:', error)
        toast.error('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateProfileData = (data) => {
    // Check USN: if it's not empty, it must be at least 3 chars
    if (data.usn && data.usn.length < 3) {
      toast.error('USN must be at least 3 characters long.');
      return false;
    }
    // Check Phone: if it's not empty, it must be at least 8 chars
    if (data.phone && data.phone.length < 8) {
      toast.error('Phone number must be at least 8 characters long.');
      return false;
    }
    // Add other checks here (e.g., for name)

    return true; // All checks passed
  };

  const getYearAsNumber = (yearString) => {
    if (!yearString) return 0; // Or null, depending on your preference
    const lowerYear = yearString.toLowerCase();
    if (lowerYear.includes('first')) return 1;
    if (lowerYear.includes('second')) return 2;
    if (lowerYear.includes('third')) return 3;
    if (lowerYear.includes('fourth')) return 4;
    if (lowerYear.includes('fifth')) return 5;
    return 0; // Default case
  };

  // Save profile to Firestore
  const handleSave = async () => {
    if (!user?.uid) {
      toast.error('User not authenticated')
      return false
    }

    // Debug: Log authentication state
    console.log('User authentication state:', {
      uid: user.uid,
      email: user.email,
      name: user.name,
      isAuthenticated: !!user.uid
    })

    const isValid = validateProfileData(profileData);
    if (!isValid) {
      return false; // Stop execution if validation fails
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);

      const existingDoc = await getDoc(userRef);
      const existingData = existingDoc.exists() ? existingDoc.data() : {};

      const validRoles = ['member', 'coreMember', 'admin', 'User', 'EXECUTIVE MEMBER', 'core'];

      // Prepare the update data according to Firestore rules
      // Prepare the update data according to Firestore rules
      const updateData = {
        // Core fields that match Firestore rules
        name: profileData.name || '',
        bio: profileData.bio || '',
        branch: profileData.branch || '',
        usn: profileData.usn || '',
        github: profileData.github || '',
        linkedin: profileData.linkedin || '',
        phone: profileData.phone || '',

        // --- ADD THIS LINE ---
        year: getYearAsNumber(profileData.year), // This satisfies the 'number' rule

        // Preserve existing fields
        email: existingData.email || user.email || profileData.email,

        // --- THIS IS THE CORRECTED LINE ---
        role: validRoles.includes(existingData.role) ? existingData.role : 'member',

        certificates: existingData.certificates || [],

        // Also update the nested profile object for backward compatibility
        profile: {
          phone: profileData.phone || '',
          college: profileData.college || 'NMAMIT',
          branch: profileData.branch || '',
          year: profileData.year || '', // This satisfies the 'string' rule
          bio: profileData.bio || ''
        },

        // Timestamps
        updatedAt: serverTimestamp()
      };

      // Add createdAt only if it's a new document
      if (!existingDoc.exists()) {
        updateData.createdAt = serverTimestamp()
      }

      // Debug: Log the data being sent
      console.log('Sending data to Firestore:', updateData)

      // Update Firestore document and local state via AuthContext
      const success = await updateUserProfile(updateData)

      if (success) {
        setOriginalData(profileData)
        setIsEditing(false)
        return true
      }
      return false
    } catch (error) {
      console.error('Error saving profile:', error)

      // Provide more specific error messages
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please make sure you are logged in.')
      } else if (error.code === 'unavailable') {
        toast.error('Service temporarily unavailable. Please try again later.')
      } else if (error.code === 'invalid-argument') {
        toast.error('Invalid data format. Please check your input and try again.')
      } else if (error.code === 'failed-precondition') {
        toast.error('Data validation failed. Please check your input.')
      } else {
        toast.error(`Failed to save profile: ${error.message || 'Unknown error'}`)
      }
      return false
    } finally {
      setLoading(false)
    }
  }

  // Enable edit mode
  const handleEdit = () => {
    setIsEditing(true)
  }

  // Cancel editing and restore original data
  const handleCancel = () => {
    setIsEditing(false)
    if (originalData) {
      setProfileData(originalData)
    }
  }

  return {
    profileData,
    isEditing,
    loading,
    handleEdit,
    handleCancel,
    handleSave,
    handleInputChange
  }
}
