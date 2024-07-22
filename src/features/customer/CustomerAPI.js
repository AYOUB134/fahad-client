const API_URL = 'https://fahad-server-production.up.railway.app/api/customers/';

// Add a new customer
export const addCustomer = async (customerData) => {
    const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
    });

    if (!response.ok) {
        throw new Error('Failed to add customer');
    }
    return response.json();
};

// Get customer by ID
export const getCustomerById = async (customerId) => {
    const response = await fetch(`${API_URL}/${customerId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch customer');
    }
    return response.json();
};

// Update installments for a customer
export const updateInstallments = async (customerId, updateData) => {
    const response = await fetch(`${API_URL}/update/installments/${customerId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
    });

    if (!response.ok) {
        throw new Error('Failed to update installments');
    }
    return response.json();
};

// Update special dues for a customer
export const updateSpecialDues = async (customerId, updateData) => {
    const response = await fetch(`${API_URL}/update/specialdues/${customerId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
    });

    if (!response.ok) {
        throw new Error('Failed to update special dues');
    }
    return response.json();
};
// Get all customers
export const getAllCustomers = async () => {
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch customers');
    }
    return response.json();
};
