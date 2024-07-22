import React, { useState } from 'react';

const Expenses = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleAddExpense = async () => {
    const expenseData = { amount, description };

    try {
      const response = await fetch('https://fahad-server-production.up.railway.app/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          onClose();
        }, 2000);
      } else {
        console.error('Failed to add expense:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding expense:', error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-gray-800 bg-opacity-75 absolute inset-0" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 relative z-10 w-full max-w-md mx-auto transform transition-transform duration-300 ease-in-out scale-100">
        <h2 className="text-2xl mb-4">Add Expense</h2>
        <label className="block mb-2">
          Amount
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </label>
        <label className="block mb-4">
          Description
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </label>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={handleAddExpense}
          >
            Add Expense
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 bg-green-500 text-white p-2 rounded shadow-lg z-50">
          <p>Expense added successfully!</p>
        </div>
      )}
    </div>
  );
};

export default Expenses;
