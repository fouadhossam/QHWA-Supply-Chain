async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const balance = await deployer.getBalance();
    console.log("Account balance:", balance.toString());
  
    const SupplyChain = await ethers.getContractFactory("SupplyChain");
  
    // Specify gas price and gas limit
    const gasPrice = ethers.utils.parseUnits('10.0', 'gwei'); // Example gas price
    const gasLimit = 5000000; // Example gas limit
  
    const supplyChain = await SupplyChain.deploy({
      gasPrice: gasPrice,
      gasLimit: gasLimit
    });
  
    await supplyChain.deployed();
  
    console.log("SupplyChain contract deployed to address:", supplyChain.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
  