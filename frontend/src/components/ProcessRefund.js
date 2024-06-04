import React, { useState } from 'react';
import axios from '../axios';

const ProcessRefund = () => {
    const [orderID, setOrderID] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/processRefund', { orderID });
            alert(`Refund processed successfully! Transaction Hash: ${response.data.txHash}`);
        } catch (error) {
            alert(`Error processing refund: ${error.response.data.error}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Process Refund</h2>
            <div>
                <label>Order ID:</label>
                <input 
                    type="number" 
                    value={orderID} 
                    onChange={(e) => setOrderID(e.target.value)} 
                />
            </div>
            <button type="submit">Process Refund</button>
        </form>
    );
};

export default ProcessRefund;
