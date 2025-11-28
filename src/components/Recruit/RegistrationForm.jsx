import { motion } from 'framer-motion'
import { Info, CreditCard, Shield, Loader, Lock } from 'lucide-react'
import { membershipPlans } from '../../data/membershipData'

const RegistrationForm = ({
  user,
  formData,
  loading,
  selectedPlan,
  onInputChange,
  onSubmit,
  onSignIn
}) => {
  const selectedPlanData = membershipPlans.find(p => p.id === selectedPlan)

  return (
    <section className="container-custom py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-3">
            Complete Your <span className="gradient-text">Registration</span>
          </h2>
          <p className="text-gray-400">Fill in your details to join CSI NMAMIT</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl">

          {!user ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500/20 to-cyber-blue/20 flex items-center justify-center border border-primary-500/30">
                <Info className="w-10 h-10 text-primary-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Sign In Required</h3>
              <p className="text-gray-400 mb-8">Please sign in to continue with registration</p>
              <button
                onClick={onSignIn}
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-cyber-blue rounded-xl font-semibold text-white hover:from-primary-600 hover:to-cyber-blue-600 transition-all transform hover:scale-105 shadow-lg shadow-primary-500/25"
              >
                Sign In with Google
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <div className="grid md:grid-cols-1 gap-6">
                {/* Personal Details are now handled in Profile */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
                  <p className="text-gray-300 text-sm">
                    <span className="font-semibold text-primary-400">Note:</span> Your personal details (Name, USN, Branch, etc.) will be taken from your profile.
                  </p>
                </div>

                {/* Why Join */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-300">
                    Why do you want to join CSI? <span className="text-gray-500">(Optional)</span>
                  </label>
                  <textarea
                    name="whyJoin"
                    value={formData.whyJoin}
                    onChange={onInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                    placeholder="Tell us about your interests and what you hope to gain..."
                  />
                </div>
              </div>

              {/* Membership Summary */}
              {selectedPlanData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-gradient-to-br from-primary-500/10 to-cyber-blue/10 rounded-2xl border border-primary-500/30"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-300 font-medium">Membership Duration:</span>
                    <span className="text-primary-400 font-bold text-lg">{selectedPlanData.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">Total Amount:</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyber-blue">
                      ₹{selectedPlanData.basePrice + selectedPlanData.platformFee}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Payment Section */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-gradient-to-r from-primary-500 to-cyber-blue rounded-xl font-bold text-white hover:from-primary-600 hover:to-cyber-blue-600 transition-all transform hover:scale-[1.02] shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-6 h-6" />
                      Complete Payment - ₹{selectedPlanData ? (selectedPlanData.basePrice + selectedPlanData.platformFee) : 0}
                    </>
                  )}
                </button>

                <div className="mt-6 flex items-center justify-center gap-3 text-sm text-gray-400">
                  <Shield className="w-5 h-5" />
                  <span>Secure payment via Razorpay</span>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span>💡</span>
                  <span>A welcome email will be sent after successful payment</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  )
}

export default RegistrationForm
