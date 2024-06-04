const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("SupplyChain", function () {
  let SupplyChain;
  let supplyChain;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    SupplyChain = await ethers.getContractFactory("SupplyChain");
    supplyChain = await SupplyChain.deploy();
    await supplyChain.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await supplyChain.owner()).to.equal(owner.address);
    });
  });

  describe("placeOrder", function () {
    it("Should create a new order", async function () {
      await supplyChain.placeOrder("Product A", ethers.utils.parseEther("1"));
      const order = await supplyChain.orders(1);
      expect(order.productName).to.equal("Product A");
      expect(order.price).to.equal(ethers.utils.parseEther("1"));
      expect(order.buyer).to.equal(owner.address);
      expect(order.seller).to.equal(ethers.constants.AddressZero);
      expect(order.state).to.equal(0);
    });
  });

  describe("makePayment", function () {
    it("Should allow buyer to make payment", async function () {
      await supplyChain.placeOrder("Product A", ethers.utils.parseEther("1"));
      await expect(supplyChain.connect(addr1).makePayment(1, { value: ethers.utils.parseEther("1") }))
        .to.emit(supplyChain, "OrderPaid")
        .withArgs(1);
    });
  });

  describe("confirmDelivery", function () {
    it("Should allow buyer to confirm delivery", async function () {
      await supplyChain.placeOrder("Product A", ethers.utils.parseEther("1"));
      await supplyChain.connect(addr1).makePayment(1, { value: ethers.utils.parseEther("1") });
      await expect(supplyChain.confirmDelivery(1))
        .to.emit(supplyChain, "OrderDelivered")
        .withArgs(1);
    });
  });

  describe("requestReturn", function () {
    it("Should allow buyer to request return", async function () {
      await supplyChain.placeOrder("Product A", ethers.utils.parseEther("1"));
      await supplyChain.connect(addr1).makePayment(1, { value: ethers.utils.parseEther("1") });
      await supplyChain.confirmDelivery(1);
      await expect(supplyChain.requestReturn(1))
        .to.emit(supplyChain, "OrderReturned")
        .withArgs(1);
    });
  });

  describe("processRefund", function () {
    it("Should allow seller to process refund", async function () {
      await supplyChain.placeOrder("Product A", ethers.utils.parseEther("1"));
      await supplyChain.connect(addr1).makePayment(1, { value: ethers.utils.parseEther("1") });
      await supplyChain.confirmDelivery(1);
      await supplyChain.requestReturn(1);
      await expect(supplyChain.connect(owner).processRefund(1))
        .to.emit(supplyChain, "OrderCreated")
        .withArgs(1);
    });
  });

  describe("trackOrder", function () {
    it("Should return order history", async function () {
      await supplyChain.placeOrder("Product A", ethers.utils.parseEther("1"));
      await supplyChain.connect(addr1).makePayment(1, { value: ethers.utils.parseEther("1") });
      await supplyChain.confirmDelivery(1);
      const history = await supplyChain.trackOrder(1);
      expect(history).to.have.lengthOf.at.least(2); 
    });
  });
});

