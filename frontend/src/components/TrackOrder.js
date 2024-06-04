import React, { useState } from 'react';
import axios from '../axios';

const TrackOrder = () => {
    const [orderID, setOrderID] = useState('');
    const [history, setHistory] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:8000/trackOrder/${orderID}`);
            console.log(response);
            // Assuming response.data is an array of timestamps like [ { hex: "0x665c7108", type: "BigNumber" } ]
            const timestamps = response.data.map(item => parseInt(item.hex, 16) * 1000);
            setHistory(timestamps);
        } catch (error) {
            alert(`Error tracking order: ${error.response.data.error}`);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Track Order</h2>
                <div>
                    <label>Order ID:</label>
                    <input 
                        type="number" 
                        value={orderID} 
                        onChange={(e) => setOrderID(e.target.value)} 
                    />
                </div>
                <button type="submit">Track Order</button>
            </form>
            <h3>Order History:</h3>
            <ul>
                {history.map((timestamp, index) => (
                    <li key={index}>{new Date(timestamp).toLocaleString()}</li>
                ))}
            </ul>
        </div>
    );
};

export default TrackOrder;
