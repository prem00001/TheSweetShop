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
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 border border-purple-100 hover:border-purple-300 transform hover:-translate-y-1 overflow-hidden">
      {sweet.image && (
        <div className="mb-3 sm:mb-4 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6">
          <img 
            src={sweet.image} 
            alt={sweet.name}
            className="w-full h-32 sm:h-40 md:h-48 object-cover"
          />
        </div>
      )}
      <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex-1">{sweet.name}</h3>
        {isAdmin && isLowStock && (
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

      <div className="mb-3 sm:mb-4">
        <p className="text-sm sm:text-base text-gray-600">
          <span className="font-semibold">Category:</span> {sweet.category}
        </p>
        <p className="text-sm sm:text-base text-gray-600">
          <span className="font-semibold">Price per {sweet.quantityUnit || 'piece'}:</span> ₹{sweet.price.toFixed(2)}
        </p>
        {isAdmin && (
          <p className="text-sm sm:text-base text-gray-600">
            <span className="font-semibold">In Stock:</span> {sweet.quantity} {sweet.quantityUnit || 'piece'}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => onPurchase(sweet._id)}
          disabled={isOutOfStock}
          className={`w-full sm:flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : 'Buy'}
        </button>

        {isAdmin && (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onEdit(sweet)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(sweet._id)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Delete
            </button>
            <button
              onClick={() => setShowRestock(!showRestock)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Restock
            </button>
          </div>
        )}
      </div>

      {isAdmin && showRestock && (
        <form onSubmit={handleRestockSubmit} className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              min="1"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(e.target.value)}
              placeholder="Quantity"
              className="flex-1 px-3 py-2 text-sm sm:text-base border rounded"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowRestock(false)
                setRestockQuantity('')
              }}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
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
