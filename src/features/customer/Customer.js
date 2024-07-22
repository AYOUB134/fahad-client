import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomerAsync, getCustomerByIdAsync, getAllCustomersAsync } from './CustomerSlice';
import AllCustomers from './AllCustomers';
import AddCustomer from './AddCustomer';
import Expenses from './Expenses';
import ViewExpenses from './ViewExpenses';
import ViewTotalIncome from './ViewTotalIncome';
import ViewTotalProfit from './ViewTotalProfit';

const Customer = () => {
    const dispatch = useDispatch();
    const { customers, currentCustomer } = useSelector((state) => state.customers);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showView, setShowView] = useState(false);
    const [customerId, setCustomerId] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [showExpensesForm, setShowExpensesForm] = useState(false);
    const [showViewExpenses, setShowViewExpenses] = useState(false);
    const [showTotalIncome, setShowTotalIncome] = useState(false);
    const [showTotalProfit, setShowTotalProfit] = useState(false);

    useEffect(() => {
        dispatch(getAllCustomersAsync());
    }, [dispatch]);

    useEffect(() => {
        if (customerId) {
            dispatch(getCustomerByIdAsync(customerId));
        }
    }, [customerId, dispatch]);

    const handleAddCustomer = async (formattedData) => {
        try {
            await dispatch(addCustomerAsync(formattedData));
            setShowPopup(true);
            setShowAddForm(false);
        } catch (error) {
            console.error('Failed to add customer:', error.message);
        }
    };

    const handleViewCustomer = (id) => {
        setCustomerId(id);
    };

    const handleAddInstallment = () => {
        console.log('Add Installment button clicked');
    };

    const closeViewCustomer = () => {
        setCustomerId('');
    };

    return (
        <div className="container mx-auto p-6 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                    className="main-button bg-blue-500  hover:bg-blue-600 h-24 w-full transition transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 rounded-lg shadow-lg"
                    onClick={() => setShowAddForm(true)}
                >
                    Add Customer
                </button>
                <button
                    className="main-button bg-green-500 hover:bg-green-600  h-24 w-full transition transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 rounded-lg shadow-lg"
                    onClick={() => setShowView(true)}
                >
                    View All Customers
                </button>
                <button
                    className="main-button bg-purple-500 hover:bg-purple-600  h-24  w-full transition transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 rounded-lg shadow-lg"
                    onClick={() => setShowExpensesForm(true)}
                >
                    Add Expenses
                </button>
                <button
                    className="main-button bg-yellow-500 hover:bg-yellow-600  h-24 w-full transition transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 rounded-lg shadow-lg"
                    onClick={() => setShowViewExpenses(true)}
                >
                    View Expenses
                </button>
                <button
                    className="main-button bg-red-500 hover:bg-red-600  h-24 w-full transition transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 rounded-lg shadow-lg"
                    onClick={() => setShowTotalIncome(true)}
                >
                    View Total Income
                </button>
                <button
                    className="main-button bg-orange-500 hover:bg-orange-600  h-24 w-full transition transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 rounded-lg shadow-lg"
                    onClick={() => setShowTotalProfit(true)}
                >
                    View Total Profit
                </button>
            </div>

            {showPopup && (
                <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-3/4 bg-green-500 text-white p-4 rounded-b shadow-lg z-40">
                    <p className="text-center">New customer added successfully!</p>
                    <button onClick={() => setShowPopup(false)} className="absolute top-2 right-2 text-xl">×</button>
                </div>
            )}

            {showAddForm && (
                <AddCustomer
                    onClose={() => setShowAddForm(false)}
                    onAddCustomer={handleAddCustomer}
                />
            )}

            {showView && (
                <AllCustomers
                    onViewDetails={handleViewCustomer}
                    onAddInstallment={handleAddInstallment}
                />
            )}

            {showExpensesForm && (
                <Expenses onClose={() => setShowExpensesForm(false)} />
            )}

            {showViewExpenses && (
                <ViewExpenses onClose={() => setShowViewExpenses(false)} />
            )}

            {showTotalIncome && (
                <ViewTotalIncome onClose={() => setShowTotalIncome(false)} />
            )}

            {showTotalProfit && (
                <ViewTotalProfit onClose={() => setShowTotalProfit(false)} />
            )}
        </div>
    );
};

export default Customer;
