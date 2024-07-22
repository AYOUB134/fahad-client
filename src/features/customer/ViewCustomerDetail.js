import React from 'react';

const formatDate = (date) => new Date(date).toLocaleDateString(); // Simple date formatting
const calculateAmounts = (customer) => ({
    totalAmount: customer.totalPayment,
    totalPaidAmount: customer.advancePayment,
    totalDuesAmount: customer.totalPayment - customer.advancePayment,
    totalPayableAmount: customer.totalPayment - customer.advancePayment, // Assuming this is the same
});

const ViewCustomerDetail = ({ customer, onClose, printDetails }) => {
    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-800 bg-opacity-70">
            <div className="bg-white p-10 rounded-lg shadow-lg relative max-w-6xl w-11/12 h-5/6 overflow-auto">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center"
                    aria-label="Close details modal"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center">FAHAD MOTORS Sithari Town Jatoi</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p><strong>Sale Date:</strong> {formatDate(customer.saleDate)}</p>
                        <p><strong>Name:</strong> {customer.name}</p>
                        <p><strong>Contact Number:</strong> {customer.contactNumber}</p>
                        <p><strong>Father Name:</strong> {customer.fatherName}</p>
                        <p><strong>Nation:</strong> {customer.nation}</p>
                        <p><strong>CNIC Number:</strong> {customer.CNICNumber}</p>
                        <p><strong>Permanent Address:</strong> {customer.permanentAddress}</p>
                    </div>
                    <div>
                        <p><strong>Business Address:</strong> {customer.businessAddress}</p>
                        <p><strong>Selling Item Name:</strong> {customer.sellingItemName}</p>
                        <p><strong>Model:</strong> {customer.model}</p>
                        <p><strong>Horse Powers:</strong> {customer.horsePowers}</p>
                        <p><strong>Color:</strong> {customer.color}</p>
                        <p><strong>Engine Number:</strong> {customer.engineNumber}</p>
                        <p><strong>Chamber Number:</strong> {customer.chamberNumber}</p>
                        <p><strong>Total Payment:</strong> {customer.totalPayment}</p>
                        <p><strong>Advance Payment:</strong> {customer.advancePayment}</p>
                        <p><strong>Total Months:</strong> {customer.totalMonths}</p>
                        <p><strong>Per Month Installment:</strong> {customer.perMonthInstallment}</p>
                        <p><strong>Date:</strong> {formatDate(customer.date)}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Installments</h3>
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-300">
                                <th className="py-3 px-4 text-left border-r">Amount</th>
                                <th className="py-3 px-4 text-left border-r">Date</th>
                                <th className="py-3 px-4 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customer.installments.map((installment, index) => (
                                <tr key={index} className="border-b border-gray-300">
                                    <td className="py-3 px-4 border-r">{installment.amount}</td>
                                    <td className="py-3 px-4 border-r">{formatDate(installment.date)}</td>
                                    <td className="py-3 px-4">{installment.status ? 'Paid' : 'Pending'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {customer.specialDue.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Special Dues</h3>
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-300">
                                    <th className="py-3 px-4 text-left border-r">Amount</th>
                                    <th className="py-3 px-4 text-left border-r">Due Date</th>
                                    <th className="py-3 px-4 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customer.specialDue.map((due, index) => (
                                    <tr key={index} className="border-b border-gray-300">
                                        <td className="py-3 px-4 border-r">{due.amount}</td>
                                        <td className="py-3 px-4 border-r">{formatDate(due.dueDate)}</td>
                                        <td className="py-3 px-4">{due.status ? 'Paid' : 'Pending'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Amounts</h3>
                    <p><strong>Total Amount:</strong> {calculateAmounts(customer).totalAmount}</p>
                    <p><strong>Total Paid Amount:</strong> {calculateAmounts(customer).totalPaidAmount}</p>
                    <p><strong>Total Dues Amount:</strong> {calculateAmounts(customer).totalDuesAmount}</p>
                    <p><strong>Total Payable Amount:</strong> {calculateAmounts(customer).totalPayableAmount}</p>
                </div>
                <div className="flex justify-between mt-6">
                    <button
                        onClick={printDetails}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                        aria-label="Print details"
                    >
                        Print
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                        aria-label="Close details modal"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewCustomerDetail;
