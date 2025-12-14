import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import PaymentErrorPopup from '../components/PaymentErrorPopup'

const Payment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  
  const sweet = location.state?.sweet
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    if (!sweet) {
      navigate('/dashboard')
    }
  }, [sweet, navigate])

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    if (!sweet) return

    const qty = parseInt(quantity, 10)
    if (isNaN(qty) || qty < 1) {
      setError('Please enter a valid quantity (minimum 1)')
      return
    }

    if (sweet.quantity < qty) {
      setError('Not enough stock available. Please reduce the quantity.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const totalAmount = (sweet.price * qty) * 100 // Convert to paise
      
      // Create order on backend
      const orderResponse = await axios.post(
        `${API_URL}/payment/create-order`,
        {
          amount: totalAmount,
          currency: 'INR',
          sweetId: sweet._id,
          sweetName: sweet.name,
          quantity: qty
        }
      )

      const { orderId, amount, currency } = orderResponse.data

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag', // Replace with your key
          amount: amount,
          currency: currency,
          name: 'The Sweet Shop',
          description: `Payment for ${sweet.name} (Qty: ${qty})`,
          order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post(
              `${API_URL}/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                sweetId: sweet._id
              }
            )

            if (verifyResponse.data.success) {
              // Payment successful - complete purchase
              await axios.post(`${API_URL}/sweets/${sweet._id}/purchase`, {
                quantity: qty
              })
              navigate('/dashboard', { 
                state: { 
                  message: 'Payment successful! Your order has been placed.',
                  success: true 
                } 
              })
            } else {
              setError('Payment verification failed')
              setLoading(false)
            }
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed')
            setLoading(false)
          }
        },
        prefill: {
          name: user?.username || '',
          email: user?.email || '',
        },
        theme: {
          color: '#9333ea', // Purple color matching the theme
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
          }
        }
      }

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options)
        razorpay.open()
        setLoading(false)
      } else {
        throw new Error('Razorpay script not loaded')
      }
    } catch (err) {
      console.error('Payment error:', err)
      setLoading(false)
      // Show polite error popup
      setShowErrorPopup(true)
    }
  }

  if (!sweet) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover sm:bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/bg-2.png')`,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/30 via-purple-400/30 to-indigo-500/30 backdrop-blur-[2px]"></div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-80 sm:h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 bg-white/95 backdrop-blur-sm p-4 sm:p-6 md:p-10 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md mx-4 sm:mx-auto border border-white/20">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            💳 Payment
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">Complete your purchase</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4 shadow-md">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 border border-purple-200">
          {sweet.image && (
            <img 
              src={sweet.image} 
              alt={sweet.name}
              className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg mb-3 sm:mb-4"
            />
          )}
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">{sweet.name}</h3>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
            <div className="flex justify-between">
              <span className="font-semibold">Category:</span>
              <span>{sweet.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Price per {sweet.quantityUnit || 'piece'}:</span>
              <span>₹{sweet.price.toFixed(2)}</span>
            </div>
            <div className="border-t border-purple-200 pt-2 sm:pt-3 mt-2 sm:mt-3">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Quantity ({sweet.quantityUnit || 'piece'}):
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => {
                  const inputValue = e.target.value
                  // Allow empty input while typing
                  if (inputValue === '') {
                    setQuantity('')
                    return
                  }
                  // Only accept positive whole integers
                  const val = parseInt(inputValue, 10)
                  if (!isNaN(val) && val >= 1) {
                    setQuantity(val)
                  }
                }}
                onBlur={(e) => {
                  // Ensure minimum value of 1 when input loses focus
                  const val = parseInt(e.target.value, 10)
                  if (isNaN(val) || val < 1) {
                    setQuantity(1)
                  }
                }}
                className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border-2 transition-all duration-200 outline-none ${
                  (parseInt(quantity, 10) || 0) > sweet.quantity
                    ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200 bg-red-50'
                    : 'border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                }`}
                placeholder="Enter quantity"
              />
              {(parseInt(quantity, 10) || 0) > sweet.quantity && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 font-medium">
                  Not enough stock available. Please reduce the quantity.
                </p>
              )}
            </div>
            <div className="border-t border-purple-200 pt-2 sm:pt-3 mt-2 sm:mt-3">
              <div className="flex justify-between text-base sm:text-lg">
                <span className="font-bold">Total Amount:</span>
                <span className={`font-bold ${quantity > sweet.quantity ? 'text-red-600' : 'text-purple-600'}`}>
                  ₹{((sweet.price * (parseInt(quantity, 10) || 0))).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handlePayment}
            disabled={loading || sweet.quantity === 0 || !quantity || (parseInt(quantity, 10) || 0) < 1 || (parseInt(quantity, 10) || 0) > sweet.quantity}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : sweet.quantity === 0 ? (
              'Out of Stock'
            ) : (
              'Proceed to Payment'
            )}
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          >
            Cancel
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Secure payment powered by Razorpay</p>
        </div>
      </div>

      <PaymentErrorPopup 
        isOpen={showErrorPopup} 
        onClose={() => setShowErrorPopup(false)}
        sweet={sweet}
        quantity={quantity}
        onOrderConfirmed={async () => {
          // Refresh sweets list and show success message
          navigate('/dashboard', { 
            state: { 
              message: 'Order confirmed! Please complete payment within 12 hours. We will deliver within 33 hours after payment confirmation.',
              success: true 
            } 
          })
        }}
      />
    </div>
  )
}

export default Payment

