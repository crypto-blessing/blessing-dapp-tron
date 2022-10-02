/* global BigInt */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

    const BUSD_ADDRESS = '0xe9e7cea3dedca5984780bafc599bd69add087d56';

    const CBToken_ADDRESS = '0x72a90beC83bD96E341E9f842C8290083cCAD9122';

    const CBNFT_ADDRESS = '0x4e3a8078555b71544482414a8aa93B3305b41F27';


    const CryptoBlessing = await hre.ethers.getContractFactory("CryptoBlessing");
    let cryptoBlessing = await CryptoBlessing.deploy(BUSD_ADDRESS, CBToken_ADDRESS, CBNFT_ADDRESS);
    await cryptoBlessing.deployed();
    console.log("CryptoBlessing core contract deployed to:", cryptoBlessing.address);

    const CryptoBlessingToken = await hre.ethers.getContractFactory("CryptoBlessingToken");
    const cbToken = await CryptoBlessingToken.attach(CBToken_ADDRESS);
    const transferCBTx = await cbToken.transfer(cryptoBlessing.address, ethers.utils.parseEther("100000"));
    await transferCBTx.wait();

    // transfer the owner of CBNFT to the owner of CryptoBlessing.
    const CryptoBlessingNFT = await hre.ethers.getContractFactory("CryptoBlessingNFT");
    const cbNFT = await CryptoBlessingNFT.attach(CBNFT_ADDRESS);
    await cbNFT.transferOwnership(cryptoBlessing.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
