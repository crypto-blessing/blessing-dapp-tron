/* global BigInt */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

  const CryptoBlessing = await hre.ethers.getContractFactory("CryptoBlessing");
  const cryptoBlessing = await CryptoBlessing.attach("0x2B595C0F6350059988FdEF52f1995099F0382032");

  const pauseTx = await cryptoBlessing.pause();
  await pauseTx.wait()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
