import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import SweetCard from '../components/SweetCard'
import AdminPanel from '../components/AdminPanel'
import SearchBar from '../components/SearchBar'

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth()
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [editingSweet, setEditingSweet] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

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

  const handlePurchase = async (sweetId) => {
    try {
      const response = await axios.post(`${API_URL}/sweets/${sweetId}/purchase`)
      setSweets(sweets.map(s => s._id === sweetId ? response.data : s))
    } catch (err) {
      alert(err.response?.data?.message || 'Purchase failed')
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-purple-600">
              🍬 Sweet Shop Management
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                Welcome, {user?.username} {isAdmin && '(Admin)'}
              </span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  )
}

export default Dashboard
