import React, { useState } from 'react';

const AddCustomer = ({ onClose, onAddCustomer }) => {
    const [formData, setFormData] = useState({
        saleDate: '',
        name: '',
        contactNumber: '',
        fatherName: '',
        nation: '',
        CNICNumber: '',
        permanentAddress: '',
        businessAddress: '',
        sellingItemName: '',
        model: '',
        horsePowers: '',
        color: '',
        engineNumber: '',
        chamberNumber: '',
        totalPayment: '',
        advancePayment: '',
        totalMonths: ''
    });

    const [specialDueEntries, setSpecialDueEntries] = useState([{}]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSpecialDueChange = (index, e) => {
        const { name, value } = e.target;
        const updatedEntries = [...specialDueEntries];
        updatedEntries[index] = { ...updatedEntries[index], [name]: value };
        setSpecialDueEntries(updatedEntries);
    };

    const addSpecialDueEntry = () => {
        setSpecialDueEntries([...specialDueEntries, {}]);
    };

    const removeSpecialDueEntry = (index) => {
        const updatedEntries = specialDueEntries.filter((_, i) => i !== index);
        setSpecialDueEntries(updatedEntries);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { saleDate, totalPayment, advancePayment, totalMonths } = formData;

        const formattedData = {
            ...formData,
            saleDate: saleDate ? new Date(saleDate.split('/').reverse().join('-')) : new Date(),
            specialDue: specialDueEntries.map(entry => ({
                amount: Number(entry.amount) || 0,
                dueDate: entry.dueDate ? new Date(entry.dueDate.split('/').reverse().join('-')) : new Date(),
                status: entry.status === 'true' ? true : false
            })),
            totalPayment: Number(totalPayment) || 0,
            advancePayment: Number(advancePayment) || 0,
            totalMonths: Number(totalMonths) || 0
        };

        onAddCustomer(formattedData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70">
            <div className="bg-white border p-6 rounded-lg shadow-lg w-full max-w-4xl mx-4 md:mx-8 lg:mx-auto max-h-[90vh] overflow-y-auto relative">
                <h2 className="text-2xl font-bold mb-4">Add Customer</h2>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 flex items-center justify-center bg-red-600 text-white w-8 h-8 rounded-full hover:bg-red-700 transition"
                    style={{ fontSize: '1.25rem' }} // Ensures the '×' fits well inside the circle
                >
                    ×
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {Object.keys(formData).map((key) => (
                            key !== 'specialDueEntries' && (
                                <div key={key} className="mb-2">
                                    <label className="block text-gray-700 mb-1 font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                                    <input
                                        type="text"
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1')}`}
                                        className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )
                        ))}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-medium">Special Due Entries</label>
                        {specialDueEntries.map((entry, index) => (
                            <div key={index} className="border border-gray-300 p-4 rounded-lg mb-4 bg-gray-50">
                                <div className="mb-3">
                                    <label className="block text-gray-700 font-medium">Amount</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={entry.amount || ''}
                                        onChange={(e) => handleSpecialDueChange(index, e)}
                                        placeholder="3000"
                                        className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="block text-gray-700 font-medium">Due Date (DD/MM/YYYY)</label>
                                    <input
                                        type="text"
                                        name="dueDate"
                                        value={entry.dueDate || ''}
                                        onChange={(e) => handleSpecialDueChange(index, e)}
                                        placeholder="20/08/2024"
                                        className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="block text-gray-700 font-medium">Status</label>
                                    <select
                                        name="status"
                                        value={entry.status || ''}
                                        onChange={(e) => handleSpecialDueChange(index, e)}
                                        className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select</option>
                                        <option value="true">Paid</option>
                                        <option value="false">Pending</option>
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeSpecialDueEntry(index)}
                                    className="bg-red-500 text-white py-1 px-3 rounded-lg text-sm hover:bg-red-600 transition"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addSpecialDueEntry}
                            className="bg-green-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-green-600 transition"
                        >
                            Add Special Due
                        </button>
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                        >
                            Add Customer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomer;
