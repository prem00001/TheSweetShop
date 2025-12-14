import { useState } from 'react'
import axios from 'axios'

const PaymentErrorPopup = ({ isOpen, onClose, sweet, quantity, onOrderConfirmed }) => {
  const [loading, setLoading] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  if (!isOpen) return null

  const handleUnderstood = async () => {
    if (!sweet) {
      onClose()
      return
    }

    setLoading(true)
    try {
      // Create manual order (order confirmed, payment pending)
      const qty = parseInt(quantity, 10) || 1
      const response = await axios.post(`${API_URL}/sweets/${sweet._id}/manual-order`, {
        quantity: qty
      })
      
      // Check if the response indicates success
      if (response.data && response.data.success) {
        // Call the callback to update UI
        if (onOrderConfirmed) {
          onOrderConfirmed()
        }
        onClose()
      } else {
        throw new Error(response.data?.message || 'Order confirmation failed')
      }
    } catch (err) {
      console.error('Failed to confirm order:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to confirm order. Please try again.'
      alert(errorMessage)
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Just close without creating order
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all relative">
        {/* Cancel button at top right */}
        <button
          onClick={handleCancel}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close"
        >
          <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="text-center mb-4 sm:mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-yellow-100 mb-3 sm:mb-4">
              <svg className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Payment Service Temporarily Unavailable
            </h2>
          </div>

          <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
            <p>
              Dear Sir/Madam,
            </p>
            <p>
              Currently, We Are Facing An Issue With Our Online Payment Method. Kindly Transfer The Total Amount To <span className="font-semibold text-purple-600 break-all">prem@okichdfc.in</span> And Share The Transaction Proof With Your Details On <span className="font-semibold text-purple-600">+91 65789 01246</span>.
            </p>
            <p className="font-semibold text-green-600">
              We Will Deliver Your Order Within 33 Hours.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-2 sm:p-3 rounded">
              <p className="text-xs sm:text-sm text-blue-800 font-semibold">
                ⚠️ Important: If You Click On "Understood", We Will Consider Your Order Confirmed And You Can Complete The Payment Within 12 Hours.
              </p>
            </div>
            <p>
              Thank You For Visiting, Have A Good One!
            </p>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleUnderstood}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Confirming...' : 'Understood'}
            </button>
            <button
              onClick={() => {
                window.open(`mailto:prem@okichdfc.in?subject=Payment Proof - Sweet Shop Order&body=Please find attached the payment proof for my order.`, '_blank')
              }}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Send Email
            </button>
          </div>

          <div className="mt-4 sm:mt-6 text-center flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0">
            <button
              onClick={() => {
                navigator.clipboard.writeText('prem@okichdfc.in')
                alert('Email copied to clipboard!')
              }}
              className="text-xs sm:text-sm text-purple-600 hover:text-purple-800 underline"
            >
              Copy Email Address
            </button>
            <span className="hidden sm:inline mx-2 text-gray-400">|</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText('+91 65789 01246')
                alert('Phone number copied to clipboard!')
              }}
              className="text-xs sm:text-sm text-purple-600 hover:text-purple-800 underline"
            >
              Copy Phone Number
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentErrorPopup

