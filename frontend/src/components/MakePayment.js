import React, { useState } from 'react';
import axios from '../axios';

const MakePayment = () => {
    const [orderID, setOrderID] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/makePayment', { orderID });
            alert(`Payment made successfully! Transaction Hash: ${response.data.txHash}`);
        } catch (error) {
            alert(`Error making payment: ${error.response.data.error}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Make Payment</h2>
            <div>
                <label>Order ID:</label>
                <input 
                    type="number" 
                    value={orderID} 
                    onChange={(e) => setOrderID(e.target.value)} 
                />
            </div>
            <button type="submit">Make Payment</button>
        </form>
    );
};

export default MakePayment;
