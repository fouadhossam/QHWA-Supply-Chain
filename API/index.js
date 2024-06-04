require("dotenv").config();
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");

const app = express();
const port = process.env.PORT || 3000;

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const NETWORK_URL = process.env.NETWORK_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// ABI of the SupplyChain contract
const abiJson = fs.readFileSync("../supplyChain/artifacts/contracts/supplychain.sol/SupplyChain.json", "utf8"); 
const abi = JSON.parse(abiJson).abi;

// Initialize provider and wallet
const provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

app.use(express.json());
app.use(cors());

// API endpoint to place an order
app.post("/placeOrder", async (req, res) => {
    try {
        const { productName, price } = req.body;
        const tx = await contract.placeOrder(productName, ethers.utils.parseEther(price.toString()));
        await tx.wait();

        const orderID = (await contract.orderCounter()).toString();
        res.status(200).send({ success: true, txHash: tx.hash, orderID: orderID });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

// API endpoint to make a payment
app.post("/makePayment", async (req, res) => {
    try {
        const { orderID, paymentAmount } = req.body;
        const tx = await contract.makePayment(orderID, { value: ethers.utils.parseEther(paymentAmount.toString()) });
        await tx.wait();
        res.status(200).send({ success: true, txHash: tx.hash });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

// API endpoint to confirm delivery
app.post("/confirmDelivery", async (req, res) => {
    try {
        const { orderID } = req.body;
        const tx = await contract.confirmDelivery(orderID);
        await tx.wait();
        res.status(200).send({ success: true, txHash: tx.hash });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

// API endpoint to request return
app.post("/requestReturn", async (req, res) => {
    try {
        const { orderID } = req.body;
        const tx = await contract.requestReturn(orderID);
        await tx.wait();
        res.status(200).send({ success: true, txHash: tx.hash });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

// API endpoint to process refund
app.post("/processRefund", async (req, res) => {
    try {
        const { orderID } = req.body;
        const tx = await contract.processRefund(orderID);
        await tx.wait();
        res.status(200).send({ success: true, txHash: tx.hash });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

// API endpoint to track order
app.get("/trackOrder/:orderID", async (req, res) => {
    try {
        const orderID = req.params.orderID;
        const history = await contract.trackOrder(orderID);
        res.status(200).send(history);
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
