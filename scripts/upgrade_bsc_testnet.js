/* global BigInt */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

  const BUSD_ADDRESS = '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7';

  const CBT_ADDRESS = '0xa9b9Ff898964d37a5298ed951a65E81187c8b1fB'

  const CBNFT_ADDRESS = '0xE811A6702EbAe54D67E47C996D186dBe8eAf477c'


  const CryptoBlessing = await hre.ethers.getContractFactory("CryptoBlessing");
  const preCryptoBlessing = await CryptoBlessing.attach("0x680F8833208B931aB5a71317EFB3eFCF83db9589");

  let newcryptoBlessing = await CryptoBlessing.deploy(BUSD_ADDRESS, CBT_ADDRESS, CBNFT_ADDRESS);
  await newcryptoBlessing.deployed();

  console.log("CryptoBlessing core contract upgraded to:", newcryptoBlessing.address);

  // pause old contract
  const pauseTx = await preCryptoBlessing.pause();
  await pauseTx.wait()

  // upgrade
  const upgradeTx = await preCryptoBlessing.upgradeToNextVersion(newcryptoBlessing.address);
  await upgradeTx.wait()
  console.log("CryptoBlessing core contract deployed successfully");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
