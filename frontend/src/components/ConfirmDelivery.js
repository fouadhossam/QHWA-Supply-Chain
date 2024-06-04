import React, { useState } from 'react';
import axios from '../axios';

const ConfirmDelivery = () => {
    const [orderID, setOrderID] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/confirmDelivery', { orderID });
            alert(`Delivery confirmed successfully! Transaction Hash: ${response.data.txHash}`);
        } catch (error) {
            alert(`Error confirming delivery: ${error.response.data.error}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Confirm Delivery</h2>
            <div>
                <label>Order ID:</label>
                <input 
                    type="number" 
                    value={orderID} 
                    onChange={(e) => setOrderID(e.target.value)} 
                />
            </div>
            <button type="submit">Confirm Delivery</button>
        </form>
    );
};

export default ConfirmDelivery;
