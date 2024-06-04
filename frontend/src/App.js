// App.js

import React from 'react';
import Navbar from './components/navbar'; // Import Navbar component
import PlaceOrder from './components/PlaceOrder';
import MakePayment from './components/MakePayment';
import ConfirmDelivery from './components/ConfirmDelivery';
import RequestReturn from './components/RequestReturn';
import ProcessRefund from './components/ProcessRefund';
import TrackOrder from './components/TrackOrder';
import './styles.css'; // Import CSS file

const App = () => {
    return (
        <div className="container">
            <Navbar /> {/* Add Navbar component */}
            <PlaceOrder />
            <MakePayment />
            <ConfirmDelivery />
            <RequestReturn />
            <ProcessRefund />
            <TrackOrder />
        </div>
    );
};

export default App;
