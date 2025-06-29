const { ethers } = require("hardhat");

async function main() {
  const PriceAlert = await ethers.getContractFactory("PriceAlert");
  const priceAlert = await PriceAlert.deploy();
  await priceAlert.waitForDeployment();
  console.log("Deployed to: ", priceAlert.target);
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
