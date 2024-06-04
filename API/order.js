import axios from '../axios';

export const placeOrder = async (productName, price) => {
    try {
        const response = await axios.post('/placeOrder', { productName, price });
        return response.data;
    } catch (error) {
        throw error.response.data.error;
    }
};