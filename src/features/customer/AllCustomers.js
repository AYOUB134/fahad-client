import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AddInstallment from './AddInstallment';

// Utility function to format date as DD/MM/YYYY
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB'); // 'en-GB' for DD/MM/YYYY format
};

// Function to calculate amounts
const calculateAmounts = (customer) => {
    const totalAmount = customer.totalPayment || 0;
    const advancePayment = customer.advancePayment || 0;

    // Total Paid Amount calculation
    const totalPaidSpecialDue = customer.specialDue?.reduce((total, entry) => entry.status ? total + entry.amount : total, 0) || 0;
    const totalPaidInstallments = customer.installments?.reduce((total, installment) => installment.status ? total + installment.amount : total, 0) || 0;
    const totalPaidAmount = totalPaidSpecialDue + totalPaidInstallments + advancePayment;

    // Total Dues Amount calculation
    const totalDuesSpecialDue = customer.specialDue?.reduce((total, entry) => !entry.status ? total + entry.amount : total, 0) || 0;
    const totalDuesInstallments = customer.installments?.reduce((total, installment) => !installment.status ? total + installment.amount : total, 0) || 0;
    const totalDuesAmount = totalDuesSpecialDue + totalDuesInstallments;

    // Total Payable Amount calculation (only past and current)
    const today = new Date();
    const totalPayableSpecialDue = customer.specialDue?.reduce((total, entry) => {
        const dueDate = new Date(entry.dueDate.split('/').reverse().join('-')); // Convert DD/MM/YYYY to YYYY-MM-DD
        if (!entry.status && dueDate <= today) {
            return total + entry.amount;
        }
        return total;
    }, 0) || 0;
    
    const totalPayableInstallments = customer.installments?.reduce((total, installment) => {
        const installmentDate = new Date(installment.date.split('/').reverse().join('-')); // Convert DD/MM/YYYY to YYYY-MM-DD
        if (!installment.status && installmentDate <= today) {
            return total + installment.amount;
        }
        return total;
    }, 0) || 0;
    
    const totalPayableAmount = totalPayableSpecialDue + totalPayableInstallments;

    return { totalAmount, totalPaidAmount, totalDuesAmount, totalPayableAmount };
};

// Check if a customer has any due installments based on the date and status
const hasDueInstallments = (installments, start, end) => {
    return installments?.some(installment => {
        const installmentDate = new Date(installment.date);
        return !installment.status && installmentDate >= start && installmentDate <= end;
    });
};

// Get the start and end of the day and filter customers based on due date and status
const getDateRange = (range) => {
    const now = new Date();
    const start = new Date();
    const end = new Date();
    
    switch (range) {
        case 'current-day':
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'all-dues':
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        default:
            return [null, null];
    }
    return [start, end];
};

// Filter customers based on due date and status
const filterCustomers = (customers, filter, search) => {
    const now = new Date();
    let filtered = customers;

    if (search) {
        filtered = filtered.filter(customer =>
            customer.name.toLowerCase().includes(search.toLowerCase()) ||
            customer.contactNumber.includes(search)
        );
    }

    if (filter === 'all') {
        return filtered;
    }

    if (filter === 'all-dues') {
        filtered = filtered.filter(customer => 
            hasDueInstallments(customer.installments, new Date(0), now) ||
            hasDueInstallments(customer.specialDue, new Date(0), now)
        );
        return filtered;
    }

    const [start, end] = getDateRange(filter);
    if (start && end) {
        filtered = filtered.filter(customer => 
            hasDueInstallments(customer.installments, start, end) ||
            hasDueInstallments(customer.specialDue, start, end)
        );
    }

    return filtered;
};

// Filter for clear customers
const filterClearCustomers = (customers) => {
    return customers.filter(customer => {
        const allInstallmentsPaid = customer.installments?.every(installment => installment.status === true);
        const allSpecialDuesPaid = customer.specialDue?.every(due => due.status === true);
        return allInstallmentsPaid && allSpecialDuesPaid;
    });
};

// Check if a customer is clear based on their installments and special dues
const clearStatus = (customer) => {
    const allInstallmentsPaid = customer.installments?.every(installment => installment.status === true);
    const allSpecialDuesPaid = customer.specialDue?.every(due => due.status === true);
    return allInstallmentsPaid && allSpecialDuesPaid ? 'Yes' : 'No';
};

const AllCustomers = () => {
    const { customers } = useSelector((state) => state.customers);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showAddInstallment, setShowAddInstallment] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [installmentAdded, setInstallmentAdded] = useState(false);

    const handleViewDetails = (customer) => {
        setSelectedCustomer(customer);
        setShowAddInstallment(false); // Ensure Add Installment modal is closed
    };

    const handleCloseModal = () => {
        setSelectedCustomer(null);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleAddInstallment = (customer) => {
        setSelectedCustomer(customer);
        setShowAddInstallment(true);
    };

    const handleCloseAddInstallment = () => {
        setShowAddInstallment(false);
        setInstallmentAdded(true); // Mark that installment was added
    };

    const handleAddInstallmentSuccess = () => {
        setInstallmentAdded(true);
    };

    const filteredCustomers = filter === 'clear'
        ? filterClearCustomers(customers)
        : filterCustomers(customers, filter, search);

    const totalCustomers = customers.length;

    const printDetails = () => {
        window.print();
    };

    return (
        <div className="mx-auto p-6 relative">
            <h2 className="text-2xl font-bold mb-4">All Customers</h2>
            <p className="mb-4 text-lg">Total Customers: {totalCustomers}</p>

            {/* Search and Filter Section */}
            <div className="mb-4 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search by name or contact number"
                    value={search}
                    onChange={handleSearchChange}
                    className="p-2 border border-gray-300 rounded-lg"
                    aria-label="Search by name or contact number"
                />
                <select
                    value={filter}
                    onChange={handleFilterChange}
                    className="p-2 border border-gray-300 rounded-lg"
                    aria-label="Filter customers"
                >
                    <option value="all">All Customers</option>
                    <option value="current-day">Current Day</option>
                    <option value="clear">Clear Customers</option>
                    <option value="all-dues">View All Dues</option>
                </select>
            </div>

            {/* Customer Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md table-fixed">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                            <th className="py-3 px-4 text-left border-r text-sm">Name</th>
                            <th className="py-3 px-4 text-left border-r text-sm">Contact</th>
                            <th className="py-3 px-4 text-left border-r text-sm">Nation</th>
                            <th className="py-3 px-4 text-left border-r text-sm">Installment</th>
                            <th className="py-3 px-4 text-left border-r text-sm">Total Payable</th>
                            <th className="py-3 px-4 text-left border-r text-sm">Clear</th>
                            <th className="py-3 px-4 text-left text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="border-b border-gray-300">
                                <td className="py-3 px-4 border-r text-sm">{customer.name}</td>
                                <td className="py-3 px-4 border-r text-sm">{customer.contactNumber}</td>
                                <td className="py-3 px-4 border-r text-sm">{customer.nation}</td>
                                <td className="py-3 px-4 border-r text-sm">{customer.perMonthInstallment}</td>
                                <td className="py-3 px-4 border-r text-sm">{calculateAmounts(customer).totalPayableAmount}</td>
                                <td className="py-3 px-4 border-r text-sm">{clearStatus(customer)}</td>
                                <td className="py-3 px-4 text-sm">
                                <div className="flex space-x-2 justify-center">
    <button
        onClick={() => handleViewDetails(customer)}
        className="bg-blue-500 text-white text-xs p-1 rounded-lg hover:bg-blue-600"
        aria-label={`View details of ${customer.name}`}
    >
        View Details
    </button>
    <button
        onClick={() => handleAddInstallment(customer)}
        className="bg-green-500 text-white text-xs p-1 rounded-lg hover:bg-green-600"
        aria-label={`Add installment for ${customer.name}`}
    >
        Add Installment
    </button>
</div>


                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Customer Details Modal */}
      {/* Customer Details Modal */}
{!showAddInstallment && selectedCustomer && (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-800 bg-opacity-70">
        <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-4xl w-11/12 h-5/6 overflow-auto modal-print">
            <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center print-hide"
                aria-label="Close details modal"
            >
                &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">FAHAD MOTORS (SITHARI  TOWN JATOI)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="text-sm">
                    <p><strong>Sale Date:</strong> {formatDate(selectedCustomer.saleDate)}</p>
                    <p><strong>Name:</strong> {selectedCustomer.name}</p>
                    <p><strong>Contact Number:</strong> {selectedCustomer.contactNumber}</p>
                    <p><strong>Father Name:</strong> {selectedCustomer.fatherName}</p>
                    <p><strong>Nation:</strong> {selectedCustomer.nation}</p>
                    <p><strong>CNIC Number:</strong> {selectedCustomer.CNICNumber}</p>
                    <p><strong>Permanent Address:</strong> {selectedCustomer.permanentAddress}</p>
                </div>
                <div className="text-sm">
                    <p><strong>Business Address:</strong> {selectedCustomer.businessAddress}</p>
                    <p><strong>Selling Item Name:</strong> {selectedCustomer.sellingItemName}</p>
                    <p><strong>Model:</strong> {selectedCustomer.model}</p>
                    <p><strong>Horse Powers:</strong> {selectedCustomer.horsePowers}</p>
                    <p><strong>Color:</strong> {selectedCustomer.color}</p>
                    <p><strong>Engine Number:</strong> {selectedCustomer.engineNumber}</p>
                    <p><strong>Chamber Number:</strong> {selectedCustomer.chamberNumber}</p>
                    <p><strong>Total Payment:</strong> {selectedCustomer.totalPayment}</p>
                    <p><strong>Advance Payment:</strong> {selectedCustomer.advancePayment}</p>
                    <p><strong>Total Months:</strong> {selectedCustomer.totalMonths}</p>
                    <p><strong>Per Month Installment:</strong> {selectedCustomer.perMonthInstallment}</p>
                    <p><strong>Date:</strong> {formatDate(selectedCustomer.date)}</p>
                </div>
            </div>
            <div className="mt-4 text-sm">
                <h3 className="text-lg font-semibold mb-2">Installments</h3>
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md text-sm">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                            <th className="py-2 px-3 text-left border-r">Amount</th>
                            <th className="py-2 px-3 text-left border-r">Date</th>
                            <th className="py-2 px-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedCustomer.installments.map((installment, index) => (
                            <tr key={index} className="border-b border-gray-300">
                                <td className="py-2 px-3 border-r">{installment.amount}</td>
                                <td className="py-2 px-3 border-r">{formatDate(installment.date)}</td>
                                <td className="py-2 px-3">{installment.status ? 'Paid' : 'Pending'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedCustomer.specialDue.length > 0 && (
                <div className="mt-4 text-sm">
                    <h3 className="text-lg font-semibold mb-2">Special Dues</h3>
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md text-sm">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-300">
                                <th className="py-2 px-3 text-left border-r">Amount</th>
                                <th className="py-2 px-3 text-left border-r">Due Date</th>
                                <th className="py-2 px-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedCustomer.specialDue.map((due, index) => (
                                <tr key={index} className="border-b border-gray-300">
                                    <td className="py-2 px-3 border-r">{due.amount}</td>
                                    <td className="py-2 px-3 border-r">{formatDate(due.dueDate)}</td>
                                    <td className="py-2 px-3">{due.status ? 'Paid' : 'Pending'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="mt-4 text-sm">
                <h3 className="text-lg font-semibold mb-2">Amounts</h3>
                <p><strong>Total Amount:</strong> {calculateAmounts(selectedCustomer).totalAmount}</p>
                <p><strong>Total Paid Amount:</strong> {calculateAmounts(selectedCustomer).totalPaidAmount}</p>
                <p><strong>Total Dues Amount:</strong> {calculateAmounts(selectedCustomer).totalDuesAmount}</p>
                <p><strong>Total Payable Amount:</strong> {calculateAmounts(selectedCustomer).totalPayableAmount}</p>
            </div>
            <div className="flex justify-between mt-4">
                <button
                    onClick={printDetails}
                    className="bg-blue-500 text-white p-2 rounded-lg text-sm hover:bg-blue-600"
                    aria-label="Print details"
                >
                    Print
                </button>
                <button
                    onClick={handleCloseModal}
                    className="bg-red-500 text-white p-2 rounded-lg text-sm hover:bg-red-600"
                    aria-label="Close details modal"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)}



            {/* Add Installment Modal */}
            {showAddInstallment && selectedCustomer && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-800 bg-opacity-70">
                    <div className="bg-white border p-6 rounded-lg shadow-lg relative max-w-3xl w-full">
                        <button
                            onClick={handleCloseAddInstallment}
                            className="absolute top-2 right-2 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center"
                            aria-label="Close add installment modal"
                        >
                            &times;
                        </button>
                        <AddInstallment
                            customer={selectedCustomer}
                            onClose={handleCloseAddInstallment}
                            onSuccess={handleAddInstallmentSuccess}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllCustomers;
