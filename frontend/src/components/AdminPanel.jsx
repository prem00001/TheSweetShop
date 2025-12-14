import { useState, useEffect } from 'react'

const AdminPanel = ({ onAdd, onUpdate, sweets, editingSweet, setEditingSweet }) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (editingSweet) {
      const result = await onUpdate(editingSweet._id, formData)
      if (result.success) {
        if (setEditingSweet) setEditingSweet(null)
        setFormData({ name: '', category: '', price: '', quantity: '' })
        setShowAddForm(false)
      } else {
        setError(result.message)
      }
    } else {
      const result = await onAdd(formData)
      if (result.success) {
        setFormData({ name: '', category: '', price: '', quantity: '' })
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
        quantity: editingSweet.quantity.toString()
      })
      setShowAddForm(true)
      setError('')
    }
  }, [editingSweet])

  const handleCancel = () => {
    setShowAddForm(false)
    if (setEditingSweet) setEditingSweet(null)
    setFormData({ name: '', category: '', price: '', quantity: '' })
    setError('')
  }

  const categories = [...new Set(sweets.map(s => s.category))]

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-purple-600">Admin Panel</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
          >
            + Add New Sweet
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="border-t pt-4 mt-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <datalist id="categories">
                  {categories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price * ($)
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
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-semibold"
            >
              {editingSweet ? 'Update Sweet' : 'Add Sweet'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded font-semibold"
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
