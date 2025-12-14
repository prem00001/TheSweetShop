import { useState } from 'react'

const SweetCard = ({ sweet, onPurchase, onDelete, onRestock, onEdit, isAdmin }) => {
  const [restockQuantity, setRestockQuantity] = useState('')
  const [showRestock, setShowRestock] = useState(false)

  const handleRestockSubmit = (e) => {
    e.preventDefault()
    if (restockQuantity && parseInt(restockQuantity) > 0) {
      onRestock(sweet._id, restockQuantity)
      setRestockQuantity('')
      setShowRestock(false)
    }
  }

  const isOutOfStock = sweet.quantity === 0
  const isLowStock = sweet.quantity > 0 && sweet.quantity <= 10

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{sweet.name}</h3>
        {isLowStock && (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
            Low Stock
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
            Out of Stock
          </span>
        )}
      </div>

      <div className="mb-4">
        <p className="text-gray-600">
          <span className="font-semibold">Category:</span> {sweet.category}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Price:</span> ${sweet.price.toFixed(2)}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">In Stock:</span> {sweet.quantity}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onPurchase(sweet._id)}
          disabled={isOutOfStock}
          className={`flex-1 px-4 py-2 rounded font-semibold ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : 'Purchase'}
        </button>

        {isAdmin && (
          <>
            <button
              onClick={() => onEdit(sweet)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(sweet._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold"
            >
              Delete
            </button>
            <button
              onClick={() => setShowRestock(!showRestock)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold"
            >
              Restock
            </button>
          </>
        )}
      </div>

      {isAdmin && showRestock && (
        <form onSubmit={handleRestockSubmit} className="mt-4 pt-4 border-t">
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(e.target.value)}
              placeholder="Quantity"
              className="flex-1 px-3 py-2 border rounded"
              required
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowRestock(false)
                setRestockQuantity('')
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default SweetCard
