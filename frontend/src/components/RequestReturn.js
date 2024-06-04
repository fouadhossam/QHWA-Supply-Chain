import React, { useState } from 'react';
import axios from '../axios';

const RequestReturn = () => {
    const [orderID, setOrderID] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/requestReturn', { orderID });
            alert(`Return requested successfully! Transaction Hash: ${response.data.txHash}`);
        } catch (error) {
            alert(`Error requesting return: ${error.response.data.error}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Request Return</h2>
            <div>
                <label>Order ID:</label>
                <input 
                    type="number" 
                    value={orderID} 
                    onChange={(e) => setOrderID(e.target.value)} 
                />
            </div>
            <button type="submit">Request Return</button>
        </form>
    );
};

export default RequestReturn;
