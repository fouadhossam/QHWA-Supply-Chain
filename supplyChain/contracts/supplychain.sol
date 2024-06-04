// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    address public owner;

    enum SupplyChainState {
        Created,
        Paid,
        Delivered,
        Returned
    }

    struct Order {
        string productName;
        uint256 price;
        address buyer;
        address seller;
        SupplyChainState state;
        uint256 timestamp;
    }

    mapping(uint256 => Order) public orders;
    mapping(uint256 => uint256[]) public orderHistory;
    uint256 public orderCounter;

    event OrderCreated(uint256 orderID, uint256 timestamp);
    event OrderPaid(uint256 orderID, uint256 timestamp);
    event OrderDelivered(uint256 orderID, uint256 timestamp);
    event OrderReturned(uint256 orderID, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    function placeOrder(string memory _productName, uint256 _price) public {
        require(bytes(_productName).length > 0, "Product name cannot be empty");
        require(_price > 0, "Price must be greater than zero");
        require(msg.sender != address(0), "Invalid address");

        orderCounter++;
        uint256 currentTimestamp = block.timestamp;
        orders[orderCounter] = Order(_productName, _price, msg.sender, address(0), SupplyChainState.Created, currentTimestamp);
        orderHistory[orderCounter].push(currentTimestamp);

        emit OrderCreated(orderCounter, currentTimestamp);
    }

    function makePayment(uint256 _orderID) public payable {
        require(msg.sender != address(0), "Invalid address");
        require(_orderID > 0 && _orderID <= orderCounter, "Invalid order ID");
        require(msg.value == orders[_orderID].price, "Invalid payment amount");
        require(orders[_orderID].state == SupplyChainState.Created, "Invalid order state");

        orders[_orderID].seller = msg.sender;
        orders[_orderID].state = SupplyChainState.Paid;
        uint256 currentTimestamp = block.timestamp;
        orders[_orderID].timestamp = currentTimestamp;
        orderHistory[_orderID].push(currentTimestamp);
        payable(orders[_orderID].buyer).transfer(msg.value);

        emit OrderPaid(_orderID, currentTimestamp);
    }

    function confirmDelivery(uint256 _orderID) public {
        require(msg.sender != address(0), "Invalid address");
        require(_orderID > 0 && _orderID <= orderCounter, "Invalid order ID");
        require(msg.sender == orders[_orderID].buyer, "Unauthorized user");
        require(orders[_orderID].state == SupplyChainState.Paid, "Invalid order state");

        orders[_orderID].state = SupplyChainState.Delivered;
        uint256 currentTimestamp = block.timestamp;
        orders[_orderID].timestamp = currentTimestamp;
        orderHistory[_orderID].push(currentTimestamp);

        emit OrderDelivered(_orderID, currentTimestamp);
    }

    function requestReturn(uint256 _orderID) public {
        require(msg.sender != address(0), "Invalid address");
        require(_orderID > 0 && _orderID <= orderCounter, "Invalid order ID");
        require(msg.sender == orders[_orderID].buyer, "Unauthorized user");
        require(orders[_orderID].state == SupplyChainState.Delivered, "Invalid order state");

        orders[_orderID].state = SupplyChainState.Returned;
        uint256 currentTimestamp = block.timestamp;
        orders[_orderID].timestamp = currentTimestamp;
        orderHistory[_orderID].push(currentTimestamp);

        emit OrderReturned(_orderID, currentTimestamp);
    }

    function processRefund(uint256 _orderID) public {
        require(msg.sender != address(0), "Invalid address");
        require(_orderID > 0 && _orderID <= orderCounter, "Invalid order ID");
        require(msg.sender == orders[_orderID].seller, "Unauthorized user");
        require(orders[_orderID].state == SupplyChainState.Returned, "Invalid order state");

        uint256 refundAmount = orders[_orderID].price;
        orders[_orderID].state = SupplyChainState.Created;
        uint256 currentTimestamp = block.timestamp;
        orders[_orderID].timestamp = currentTimestamp;
        orderHistory[_orderID].push(currentTimestamp);
        payable(orders[_orderID].buyer).transfer(refundAmount);

        emit OrderCreated(_orderID, currentTimestamp); 
    }

    function trackOrder(uint256 _orderID) public view returns (uint256[] memory) {
        require(_orderID > 0 && _orderID <= orderCounter, "Invalid order ID");
        return orderHistory[_orderID];
    }
}
