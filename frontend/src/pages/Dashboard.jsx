import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import SweetCard from '../components/SweetCard'
import AdminPanel from '../components/AdminPanel'
import SearchBar from '../components/SearchBar'

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [editingSweet, setEditingSweet] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  // Check for success message from payment page
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      // Clear message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('')
      }, 5000)
      // Clear location state
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  useEffect(() => {
    fetchSweets()
  }, [])

  const fetchSweets = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/sweets`)
      setSweets(response.data)
      setError('')
    } catch (err) {
      setError('Failed to fetch sweets')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('name', searchQuery)
      if (categoryFilter) params.append('category', categoryFilter)
      if (priceRange.min) params.append('minPrice', priceRange.min)
      if (priceRange.max) params.append('maxPrice', priceRange.max)

      const response = await axios.get(`${API_URL}/sweets/search?${params}`)
      setSweets(response.data)
      setError('')
    } catch (err) {
      setError('Search failed')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = (sweetId) => {
    const sweet = sweets.find(s => s._id === sweetId)
    if (sweet) {
      // Redirect to payment page with sweet details
      navigate('/payment', { state: { sweet } })
    }
  }

  const handleDelete = async (sweetId) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return
    try {
      await axios.delete(`${API_URL}/sweets/${sweetId}`)
      setSweets(sweets.filter(s => s._id !== sweetId))
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  const handleRestock = async (sweetId, quantity) => {
    try {
      const response = await axios.post(`${API_URL}/sweets/${sweetId}/restock`, {
        quantity: parseInt(quantity)
      })
      setSweets(sweets.map(s => s._id === sweetId ? response.data : s))
    } catch (err) {
      alert(err.response?.data?.message || 'Restock failed')
    }
  }

  const handleAddSweet = async (sweetData) => {
    try {
      const response = await axios.post(`${API_URL}/sweets`, sweetData)
      setSweets([...sweets, response.data])
      return { success: true }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to add sweet'
      }
    }
  }

  const handleUpdateSweet = async (sweetId, sweetData) => {
    try {
      const response = await axios.put(`${API_URL}/sweets/${sweetId}`, sweetData)
      setSweets(sweets.map(s => s._id === sweetId ? response.data : s))
      return { success: true }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update sweet'
      }
    }
  }

  const categories = [...new Set(sweets.map(s => s.category))]

  return (
    <div className="min-h-screen relative">
      {/* Background image with overlay */}
      <div 
        className="fixed inset-0 bg-cover sm:bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/bg-3.png')`,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/40 via-purple-50/40 to-indigo-50/40 backdrop-blur-[2px]"></div>
      </div>
      <div className="relative z-10">
      <nav className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-purple-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 sm:py-0 sm:h-20 gap-3 sm:gap-0">
            <div className="w-full sm:w-auto">
              <div className="flex items-center gap-2 sm:gap-3">
                <img src="/logo.png" alt="Sweet Shop Logo" className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain" />
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  The Sweet Shop
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 italic mt-1">Welcome to The Sweet Shop</p>
            </div>
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm md:text-base text-gray-700 font-semibold truncate">
                Welcome, <span className="text-purple-600">{user?.username}</span> {isAdmin && <span className="text-pink-600">(Admin)</span>}
              </span>
              <button
                onClick={logout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg sm:rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {isAdmin && (
          <AdminPanel
            onAdd={handleAddSweet}
            onUpdate={handleUpdateSweet}
            sweets={sweets}
            editingSweet={editingSweet}
            setEditingSweet={setEditingSweet}
          />
        )}

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          categories={categories}
          onSearch={handleSearch}
          onReset={() => {
            setSearchQuery('')
            setCategoryFilter('')
            setPriceRange({ min: '', max: '' })
            fetchSweets()
          }}
        />

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4 shadow-md">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-4 shadow-md">
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl">Loading sweets...</div>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">No sweets found</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                onPurchase={handlePurchase}
                onDelete={isAdmin ? handleDelete : null}
                onRestock={isAdmin ? handleRestock : null}
                onEdit={isAdmin ? setEditingSweet : null}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default Dashboard
