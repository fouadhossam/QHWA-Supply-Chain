import React, { useState } from 'react';

import axios from '../axios';


const PlaceOrder = () => {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/placeOrder', { productName, price });
            alert(`Order placed successfully! Order ID: ${response.data.orderID}`);
        } catch (error) {
            alert(`Error placing order: ${error.response.data.error}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Place Order</h2>
            <div>
                <label>Product Name:</label>
                <input 
                    type="text" 
                    value={productName} 
                    onChange={(e) => setProductName(e.target.value)} 
                />
            </div>
            <div>
                <label>Price:</label>
                <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                />
            </div>
            <button type="submit">Place Order</button>
        </form>
    );
};

export default PlaceOrder;
