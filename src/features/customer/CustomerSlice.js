import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    addCustomer, 
    getCustomerById, 
    updateInstallments, 
    updateSpecialDues, 
    getAllCustomers 
} from './CustomerAPI';

const initialState = {
    customers: [],
    currentCustomer: null,
    status: 'idle',
    error: null,
};

// Thunks
export const addCustomerAsync = createAsyncThunk(
    'customers/addCustomer',
    async (customerData) => {
        const response = await addCustomer(customerData);
        return response;
    }
);

export const getCustomerByIdAsync = createAsyncThunk(
    'customers/getCustomerById',
    async (customerId) => {
        const response = await getCustomerById(customerId);
        return response;
    }
);

export const updateInstallmentsAsync = createAsyncThunk(
    'customers/updateInstallments',
    async ({ customerId, updateData }) => {
        const response = await updateInstallments(customerId, updateData);
        return response;
    }
);

export const updateSpecialDuesAsync = createAsyncThunk(
    'customers/updateSpecialDues',
    async ({ customerId, updateData }) => {
        const response = await updateSpecialDues(customerId, updateData);
        return response;
    }
);

export const getAllCustomersAsync = createAsyncThunk(
    'customers/getAllCustomers',
    async () => {
        const response = await getAllCustomers();
        return response;
    }
);

const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addCustomerAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addCustomerAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.customers.push(action.payload);
            })
            .addCase(addCustomerAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getCustomerByIdAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getCustomerByIdAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentCustomer = action.payload;
            })
            .addCase(getCustomerByIdAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateInstallmentsAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateInstallmentsAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedCustomer = state.customers.find(customer => customer._id === action.payload._id);
                if (updatedCustomer) {
                    Object.assign(updatedCustomer, action.payload);
                }
                if (state.currentCustomer && state.currentCustomer._id === action.payload._id) {
                    state.currentCustomer = action.payload;
                }
            })
            .addCase(updateInstallmentsAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateSpecialDuesAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateSpecialDuesAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedCustomer = state.customers.find(customer => customer._id === action.payload._id);
                if (updatedCustomer) {
                    Object.assign(updatedCustomer, action.payload);
                }
                if (state.currentCustomer && state.currentCustomer._id === action.payload._id) {
                    state.currentCustomer = action.payload;
                }
            })
            .addCase(updateSpecialDuesAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getAllCustomersAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllCustomersAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.customers = action.payload;
            })
            .addCase(getAllCustomersAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default customerSlice.reducer;
