import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateInstallmentsAsync, updateSpecialDuesAsync } from './CustomerSlice'; // Adjust the import path as needed

const AddInstallment = ({ customer, onClose }) => {
    const dispatch = useDispatch();
    const [amount, setAmount] = useState(customer.perMonthInstallment); // Default amount is perMonthInstallment
    const [selectedDate, setSelectedDate] = useState('');
    const [dateType, setDateType] = useState('');

    // Extract dates from installments and specialDue
    const installmentDates = customer.installments
        .filter(installment => !installment.status) // Show only pending dates
        .map(installment => ({
            date: installment.date,
            type: 'Installment Date'
        }));
    
    const specialDueDates = customer.specialDue
        .filter(due => !due.status) // Show only pending dates
        .map(due => ({
            date: due.dueDate,
            type: 'Special Due Date'
        }));
    
    const allDates = [...installmentDates, ...specialDueDates];

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert selectedDate to Date object and then to ISO string for comparison
        const selectedDateISO = new Date(selectedDate).toISOString();

        console.log('Selected Date ISO:', selectedDateISO);

        // Prepare the update data
        let updateData;

        if (dateType === 'Installment Date') {
            updateData = {
                installments: customer.installments.map(inst => {
                    const instDateISO = new Date(inst.date).toISOString();
                    return instDateISO === selectedDateISO
                        ? { ...inst, amount, status: true }
                        : inst;
                })
            };

            // Dispatch the update action for installments
            try {
                await dispatch(updateInstallmentsAsync({ customerId: customer._id, updateData }));
                console.log('Installments update successful');
                alert('Installment added successfully');
            } catch (error) {
                console.error('Error adding installment:', error);
                alert('Failed to add installment');
            }
        } else if (dateType === 'Special Due Date') {
            updateData = {
                specialDue: customer.specialDue.map(due => {
                    const dueDateISO = new Date(due.dueDate).toISOString();
                    return dueDateISO === selectedDateISO
                        ? { ...due, status: true }
                        : due;
                }),
            };

            // Dispatch the update action for special dues
            try {
                await dispatch(updateSpecialDuesAsync({ customerId: customer._id, updateData }));
                console.log('Special Due update successful');
                alert('Special due status updated successfully');
            } catch (error) {
                console.error('Error updating special due:', error);
                alert('Failed to update special due');
            }
        }

        onClose(); // Close the modal after submitting the form
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Add Installment for {customer.name}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="amount">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="date">Date</label>
                    <select
                        id="date"
                        value={selectedDate}
                        onChange={(e) => {
                            const selectedOption = allDates.find(dateObj => dateObj.date === e.target.value);
                            setSelectedDate(e.target.value);
                            setDateType(selectedOption?.type || '');
                        }}
                        className="p-2 border border-gray-300 rounded-lg w-full"
                        required
                    >
                        <option value="" disabled>Select a date</option>
                        {allDates.map((dateObj, index) => (
                            <option key={index} value={dateObj.date}>
                                {new Date(dateObj.date).toLocaleDateString('en-GB')} - {dateObj.type}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                >
                    Add Installment
                </button>
            </form>
        </div>
    );
};

export default AddInstallment;
