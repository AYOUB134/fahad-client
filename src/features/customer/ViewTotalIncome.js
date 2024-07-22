import React, { useState, useEffect } from 'react';

const ViewTotalIncome = ({ onClose }) => {
  const [customers, setCustomers] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordEntered, setPasswordEntered] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const correctPassword = 'fahadmotors@123';

  useEffect(() => {
    if (passwordEntered) {
      const fetchCustomers = async () => {
        try {
          const response = await fetch('https://fahad-server-production.up.railway.app/api/customers/');
          if (!response.ok) {
            throw new Error('Failed to fetch customer data');
          }
          const data = await response.json();
          setCustomers(data);
          calculateTotalIncome(data); // Calculate total income after fetching data
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchCustomers();
    }
  }, [passwordEntered]);

  const calculateTotalIncome = (data) => {
    let total = 0;

    const filteredData = data.filter(customer => {
      return customer.installments.some(installment => {
        const date = new Date(installment.date);
        return (
          installment.status &&
          (!startDate || date >= new Date(startDate)) &&
          (!endDate || date <= new Date(endDate))
        );
      });
    });

    filteredData.forEach(customer => {
      // Sum installments where status is true
      customer.installments.forEach(installment => {
        if (installment.status) {
          const date = new Date(installment.date);
          if ((!startDate || date >= new Date(startDate)) &&
              (!endDate || date <= new Date(endDate))) {
            total += installment.amount;
          }
        }
      });

      // Sum special dues where status is true (if it existed in the data structure)
      customer.specialDue.forEach(due => {
        if (due.status) {
          const date = new Date(due.date);
          if ((!startDate || date >= new Date(startDate)) &&
              (!endDate || date <= new Date(endDate))) {
            total += due.amount;
          }
        }
      });
    });

    setTotalIncome(total);
  };

  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      setPasswordEntered(true);
      setPasswordError('');
    } else {
      setPasswordError('Password is incorrect');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="bg-gray-800 bg-opacity-75 absolute inset-0"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg p-8 relative z-10 w-full max-w-lg mx-auto transform transition-transform duration-300 ease-in-out scale-100 shadow-xl">
        {!passwordEntered ? (
          <div>
            <h2 className="text-3xl font-semibold mb-6">Enter Password</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full mb-4 text-lg"
              placeholder="Password"
            />
            {passwordError && (
              <div className="text-red-500 mb-4">{passwordError}</div>
            )}
            <button
              onClick={handlePasswordSubmit}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-semibold mb-4">Filter by Date Range</h2>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 p-3 rounded-lg text-lg"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 p-3 rounded-lg text-lg"
                />
              </div>
              <button
                onClick={() => calculateTotalIncome(customers)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Apply Filter
              </button>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold">Total Income</h2>
              <button
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
                onClick={onClose}
              >
                Close
              </button>
            </div>

            {loading ? (
              <div className="text-center text-lg">Loading...</div>
            ) : error ? (
              <div className="text-red-500 text-center text-lg">Error: {error}</div>
            ) : (
              <div className="text-center text-lg">
                <div className="font-semibold">
                  Total Income: Rs.{totalIncome.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTotalIncome;
