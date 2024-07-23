import React, { useState, useEffect } from 'react';

const ViewTotalIncome = ({ onClose }) => {
  const [customers, setCustomers] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalBusinessIncome, setTotalBusinessIncome] = useState(0);
  const [totalBusinessPaidIncome, setTotalBusinessPaidIncome] = useState(0);
  const [totalBusinessUnpaidIncome, setTotalBusinessUnpaidIncome] = useState(0);
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
          calculateTotals(data); // Calculate totals after fetching data
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchCustomers();
    }
  }, [passwordEntered]);

  const calculateTotals = (data) => {
    let totalIncome = 0;
    let totalBusinessIncome = 0;
    let totalBusinessPaidIncome = 0;
    let totalBusinessUnpaidIncome = 0;
  
    data.forEach(customer => {
      // Add totalPayment for Total Business Income
      totalBusinessIncome += customer.totalPayment;
  
      // Calculate Total Business Paid Income
      // Add advancePayment
      totalBusinessPaidIncome += customer.advancePayment;

      // Add installments where status is true
      customer.installments.forEach(installment => {
        if (installment.status) {
          totalBusinessPaidIncome += installment.amount;
        }
      });

      // Add specialDue where status is true
      customer.specialDue.forEach(due => {
        if (due.status) {
          totalBusinessPaidIncome += due.amount;
        }
      });

      // Calculate Total Business Unpaid Income
      // Add installments where status is false
      customer.installments.forEach(installment => {
        if (!installment.status) {
          totalBusinessUnpaidIncome += installment.amount;
        }
      });

      // Add specialDue where status is false
      customer.specialDue.forEach(due => {
        if (!due.status) {
          totalBusinessUnpaidIncome += due.amount;
        }
      });
  
      // Calculate total income within the date range
      customer.installments.forEach(installment => {
        const date = new Date(installment.date);
        if (installment.status &&
            (!startDate || date >= new Date(startDate)) &&
            (!endDate || date <= new Date(endDate))) {
          totalIncome += installment.amount;
        }
      });
  
      customer.specialDue.forEach(due => {
        const date = new Date(due.dueDate);
        if (due.status &&
            (!startDate || date >= new Date(startDate)) &&
            (!endDate || date <= new Date(endDate))) {
          totalIncome += due.amount;
        }
      });
    });
  
    setTotalIncome(totalIncome);
    setTotalBusinessIncome(totalBusinessIncome);
    setTotalBusinessPaidIncome(totalBusinessPaidIncome);
    setTotalBusinessUnpaidIncome(totalBusinessUnpaidIncome);
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
              <div className="flex flex-col mb-6">
                <h2 className="text-3xl font-semibold mb-4">Income Summary</h2>
                <div className="text-lg mb-4">
                  <p><strong>Total Business Income:</strong> Rs.{totalBusinessIncome.toFixed(2)}</p>
                  <p><strong>Total Business Paid Income:</strong> Rs.{totalBusinessPaidIncome.toFixed(2)}</p>
                  <p><strong>Total Business Unpaid Income:</strong> Rs.{totalBusinessUnpaidIncome.toFixed(2)}</p>
                  <p><strong>Total Income (Filtered by Date):</strong> Rs.{totalIncome.toFixed(2)}</p>
                </div>
              </div>

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
                onClick={() => calculateTotals(customers)}
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
                  Total Income (Filtered by Date): Rs.{totalIncome.toFixed(2)}
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
