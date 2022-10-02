/* global BigInt */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

    const BUSD_ADDRESS = '0xe9e7cea3dedca5984780bafc599bd69add087d56';

    const CBToken = await hre.ethers.getContractFactory("CryptoBlessingToken");
    let cbToken = await CBToken.deploy();
    await cbToken.deployed();
    console.log("CryptoBlessing token deployed to:", cbToken.address);

    const CryptoBlessingNFT = await hre.ethers.getContractFactory("CryptoBlessingNFT");
    let cbNFT = await CryptoBlessingNFT.deploy();
    await cbNFT.deployed();
    console.log("CryptoBlessing NFT deployed to:", cbNFT.address);

    const CryptoBlessing = await hre.ethers.getContractFactory("CryptoBlessing");
    let cryptoBlessing = await CryptoBlessing.deploy(BUSD_ADDRESS, cbToken.address, cbNFT.address);
    await cryptoBlessing.deployed();
    console.log("CryptoBlessing core contract deployed to:", cryptoBlessing.address);

    const transferCBTx = await cbToken.transfer(cryptoBlessing.address, ethers.utils.parseEther("100000"));
    await transferCBTx.wait();

    // transfer the owner of CBNFT to the owner of CryptoBlessing.
    await cbNFT.transferOwnership(cryptoBlessing.address);

    // let addBlessingTx = await cryptoBlessing.addBlessing("gongxifacai.gif", "0x8b2A30e4870B85c87B72a165910F932C87aEd856", "Lucky Tiger!#Hope everyone is lucky💰 lucky💰 lucky💰 in 2022!", BigInt(0.1 * 10 ** 18), 1, 10);
    // await addBlessingTx.wait();

    // let addBlessingTx2 = await cryptoBlessing.addBlessing("soul.gif", "0xaF894D18cc4652C90dc024235975a43e8f737087", "Soal for you!#Bless your soul, my friend.", BigInt(0.1 * 10 ** 18), 1, 10);
    // await addBlessingTx2.wait();

    // let addBlessingTx3 = await cryptoBlessing.addBlessing("fortune.gif", "0xC868FdF4113C4FD16F0A734ce40952942E808374", "Give you fortune!#Fortune is the goddess of luck.", BigInt(0.1 * 10 ** 18), 1, 10);
    // await addBlessingTx3.wait();

    // addBlessingTx = await cryptoBlessing.addBlessing("http://rdvru2kvi.hn-bkt.clouddn.com/tuo.png", "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "脱，脱，脱!#The ultimate home for engineers", BigInt(1 * 10 ** 18), 3);
    // await addBlessingTx.wait();

    // addBlessingTx = await cryptoBlessing.addBlessing("http://rdvru2kvi.hn-bkt.clouddn.com/notwar.png", "0x2546BcD3c84621e976D8185a91A922aE77ECEc30", "make love, not war!#We need to fill the world with love", BigInt(9.9 * 10 ** 18), 2);
    // await addBlessingTx.wait();

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
