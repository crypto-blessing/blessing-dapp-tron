/* global BigInt */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

  const BUSD_ADDRESS = '0xe9e7cea3dedca5984780bafc599bd69add087d56';

  const CBT_ADDRESS = '0xAB0444680DC75fBcF90aF8CC74D712d2AF4b4a3c'

  const CBNFT_ADDRESS = '0xF32afD348cd33a0F51853febfbC7e82F3e2Faf9A'


  const CryptoBlessing = await hre.ethers.getContractFactory("CryptoBlessing");
  const preCryptoBlessing = await CryptoBlessing.attach("0x2B595C0F6350059988FdEF52f1995099F0382032");

  let newcryptoBlessing = await CryptoBlessing.deploy(BUSD_ADDRESS, CBT_ADDRESS, CBNFT_ADDRESS);
  await newcryptoBlessing.deployed();

  // pause old contract
  // const pauseTx = await preCryptoBlessing.pause();
  // await pauseTx.wait()

  // upgrade
  const upgradeTx = await preCryptoBlessing.upgradeToNextVersion(newcryptoBlessing.address);
  await upgradeTx.wait()
  console.log("CryptoBlessing core contract upgraded to:", newcryptoBlessing.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
