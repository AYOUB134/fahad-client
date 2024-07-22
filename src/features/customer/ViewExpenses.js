import React, { useState, useEffect } from 'react';

const ViewExpenses = ({ onClose }) => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filter, setFilter] = useState('today');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('https://fahad-server-production.up.railway.app/api/expenses');
        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }
        const data = await response.json();
        setExpenses(data);
        filterExpenses(data); // Filter initially
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const calculateTotalAmount = (expenses) => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalAmount(total);
  };

  const filterExpenses = (data) => {
    let filtered = [];

    switch (filter) {
      case 'today':
        const now = new Date();
        filtered = data.filter(expense => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getDate() === now.getDate() &&
            expenseDate.getMonth() === now.getMonth() &&
            expenseDate.getFullYear() === now.getFullYear()
          );
        });
        break;

      case 'custom':
        const start = new Date(startDate);
        const end = new Date(endDate);
        filtered = data.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= start && expenseDate <= end;
        });
        break;

      case 'all':
        filtered = data;
        break;

      default:
        filtered = data;
        break;
    }

    setFilteredExpenses(filtered);
    calculateTotalAmount(filtered);
  };

  useEffect(() => {
    filterExpenses(expenses); // Apply filter whenever expenses or filter changes
  }, [expenses, filter, startDate, endDate]);

  // Get the current items to display based on the current page and items per page
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto bg-gray-800 bg-opacity-75">
      <div className="relative bg-white rounded-lg p-8 w-full max-w-5xl mx-auto my-12 md:my-16 flex flex-col h-full max-h-screen">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
          onClick={onClose}
        >
          Close
        </button>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold mb-4 sm:mb-0">View Expenses</h2>
          </div>

          <div className="mb-6">
            <label htmlFor="filter" className="block text-gray-700 text-sm font-medium mb-2">
              Filter By:
            </label>
            <select
              id="filter"
              className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-300"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Expenses</option>
              <option value="today">Today</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {filter === 'custom' && (
            <div className="mb-6">
              <label htmlFor="startDate" className="block text-gray-700 text-sm font-medium mb-2">
                Start Date:
              </label>
              <input
                id="startDate"
                type="date"
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-300"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <label htmlFor="endDate" className="block text-gray-700 text-sm font-medium mb-2 mt-4">
                End Date:
              </label>
              <input
                id="endDate"
                type="date"
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-300"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}

          {loading ? (
            <div className="text-center text-lg">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center text-lg">Error: {error}</div>
          ) : (
            <>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full table-auto border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">Date</th>
                      <th className="border border-gray-300 px-4 py-2">Amount (Rs.)</th>
                      <th className="border border-gray-300 px-4 py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedExpenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-gray-200">
                        <td className="border px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                        <td className="border px-4 py-2">Rs.{expense.amount.toFixed(2)}</td>
                        <td className="border px-4 py-2">{expense.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mb-6">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}

          <div className="mt-6 text-right font-semibold text-lg">
            Total Amount: Rs.{totalAmount.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewExpenses;
