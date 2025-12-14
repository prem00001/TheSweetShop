import { useState, useEffect } from 'react'

const AdminPanel = ({ onAdd, onUpdate, sweets, editingSweet, setEditingSweet }) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    quantityUnit: 'piece',
    image: ''
  })
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState('')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        setFormData({ ...formData, image: base64String })
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Prepare form data - ensure quantity is whole number for piece units
    const submitData = { ...formData }
    if (submitData.quantityUnit === 'piece') {
      submitData.quantity = Math.round(parseFloat(submitData.quantity) || 0).toString()
    }

    if (editingSweet) {
      const result = await onUpdate(editingSweet._id, submitData)
      if (result.success) {
        if (setEditingSweet) setEditingSweet(null)
        setFormData({ name: '', category: '', price: '', quantity: '', quantityUnit: 'piece', image: '' })
        setImagePreview('')
        setShowAddForm(false)
      } else {
        setError(result.message)
      }
    } else {
      const result = await onAdd(submitData)
      if (result.success) {
        setFormData({ name: '', category: '', price: '', quantity: '', quantityUnit: 'piece', image: '' })
        setImagePreview('')
        setShowAddForm(false)
      } else {
        setError(result.message)
      }
    }
  }

  useEffect(() => {
    if (editingSweet) {
      setFormData({
        name: editingSweet.name,
        category: editingSweet.category,
        price: editingSweet.price.toString(),
        quantity: editingSweet.quantity.toString(),
        quantityUnit: editingSweet.quantityUnit || 'piece',
        image: editingSweet.image || ''
      })
      setImagePreview(editingSweet.image || '')
      setShowAddForm(true)
      setError('')
    }
  }, [editingSweet])

  const handleCancel = () => {
    setShowAddForm(false)
    if (setEditingSweet) setEditingSweet(null)
    setFormData({ name: '', category: '', price: '', quantity: '', quantityUnit: 'piece', image: '' })
    setImagePreview('')
    setError('')
  }

  const categories = [...new Set(sweets.map(s => s.category))]

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-purple-600">Admin Panel</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            + Add New Sweet
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded mb-3 sm:mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-3 py-2 text-sm sm:text-base border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  list="categories"
                  required
                  className="flex-1 px-3 py-2 text-sm sm:text-base border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <datalist id="categories">
                  {categories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Price * (₹)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                className="w-full px-3 py-2 text-sm sm:text-base border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                min="0"
                step={formData.quantityUnit === 'piece' ? '1' : '0.01'}
                value={formData.quantity}
                onChange={(e) => {
                  let value = e.target.value
                  // For piece units, only allow whole numbers
                  if (formData.quantityUnit === 'piece' && value !== '') {
                    const num = parseInt(value, 10)
                    if (!isNaN(num) && num >= 0) {
                      value = num.toString()
                    } else {
                      return // Don't update if invalid
                    }
                  }
                  setFormData({ ...formData, quantity: value })
                }}
                onBlur={(e) => {
                  // Ensure whole number for piece units on blur
                  if (formData.quantityUnit === 'piece' && e.target.value !== '') {
                    const num = Math.round(parseFloat(e.target.value) || 0)
                    setFormData({ ...formData, quantity: num.toString() })
                  }
                }}
                required
                className="w-full px-3 py-2 text-sm sm:text-base border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Quantity Unit *
              </label>
              <select
                value={formData.quantityUnit}
                onChange={(e) =>
                  setFormData({ ...formData, quantityUnit: e.target.value })
                }
                required
                className="w-full px-3 py-2 text-sm sm:text-base border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="piece">Piece</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="gm">Gram (gm)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 text-xs sm:text-sm border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {imagePreview && (
                <div className="mt-3">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 mt-4">
            <button
              type="submit"
              className="flex-1 sm:flex-none bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {editingSweet ? 'Update Sweet' : 'Add Sweet'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 sm:flex-none bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {editingSweet && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            Editing: <strong>{editingSweet.name}</strong>
          </p>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
