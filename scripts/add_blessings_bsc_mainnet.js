/* global BigInt */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

    const CryptoBlessing = await hre.ethers.getContractFactory("CryptoBlessing");
    const cryptoBlessing = await CryptoBlessing.attach("0x8abAe8e76232765db7A08e6f296Cc6aa3605DE25");

    // let addBlessingTx = await cryptoBlessing.batchUpdateBlessing(
    //   ["no1.gif","crystalball0001.gif","road_to_vic0001.gif","dazhaofengshou0001.gif","fly_to_win0001.gif","fruitfulness0001.gif","steek0001.gif","son_of_truth0001.gif","more_red_packet0002.gif","wedding_on_mars0001.gif","fire0001.gif","rent_free0001.gif","beautiful_life0001.gif","death_need_to_wait0001.gif","strong0001.gif","health0001.gif","seasonofvictory0001.gif","eth0001.gif","zhaocaijinbao0001.gif","prosperity0001.gif","god_of_wealth0001.gif","fu0001.gif","paradise0001.gif","freedom0001.gif","immortal0001.gif","crosses_0001.gif","asgard001.gif","fortune.gif","soul.gif","gongxifacai.gif"],
    //   [{"price":BigInt(100000000000000000),"owner":"0xE766D167b1332E6E2f0C0615FAC852A82eC2E351","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x73c452f178338aa4e34E77C130F9CA0F33C01504","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x73c452f178338aa4e34E77C130F9CA0F33C01504","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x84C69A7bfDB140fb6adCe357b9449B1De8CcF907","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x73c452f178338aa4e34E77C130F9CA0F33C01504","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0xE766D167b1332E6E2f0C0615FAC852A82eC2E351","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x84C69A7bfDB140fb6adCe357b9449B1De8CcF907","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x73c452f178338aa4e34E77C130F9CA0F33C01504","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x84C69A7bfDB140fb6adCe357b9449B1De8CcF907","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x73c452f178338aa4e34E77C130F9CA0F33C01504","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x84C69A7bfDB140fb6adCe357b9449B1De8CcF907","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0xE766D167b1332E6E2f0C0615FAC852A82eC2E351","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x73c452f178338aa4e34E77C130F9CA0F33C01504","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x84C69A7bfDB140fb6adCe357b9449B1De8CcF907","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0xE766D167b1332E6E2f0C0615FAC852A82eC2E351","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x73c452f178338aa4e34E77C130F9CA0F33C01504","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x84C69A7bfDB140fb6adCe357b9449B1De8CcF907","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0xE766D167b1332E6E2f0C0615FAC852A82eC2E351","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x84C69A7bfDB140fb6adCe357b9449B1De8CcF907","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x84C69A7bfDB140fb6adCe357b9449B1De8CcF907","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x73c452f178338aa4e34E77C130F9CA0F33C01504","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0xE766D167b1332E6E2f0C0615FAC852A82eC2E351","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x84C69A7bfDB140fb6adCe357b9449B1De8CcF907","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0xE766D167b1332E6E2f0C0615FAC852A82eC2E351","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x73c452f178338aa4e34E77C130F9CA0F33C01504","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x84C69A7bfDB140fb6adCe357b9449B1De8CcF907","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0xE766D167b1332E6E2f0C0615FAC852A82eC2E351","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0xE766D167b1332E6E2f0C0615FAC852A82eC2E351","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x84C69A7bfDB140fb6adCe357b9449B1De8CcF907","deleted":0,"taxRate":10},{"price":BigInt(100000000000000000),"owner":"0x73c452f178338aa4e34E77C130F9CA0F33C01504","deleted":0,"taxRate":10}]
    // );

    let addBlessingTx = await cryptoBlessing.batchUpdateBlessing(
      ["shinning_moon.gif","mooncake.gif","jingyunzhongqiu.gif","happy-mid-autumn.gif","bitcoin.gif","huahaoyueyuan.gif"],
      [{"price":BigInt(200000000000000000),"owner":"0x84C69A7bfDB140fb6adCe357b9449B1De8CcF907","deleted":0,"taxRate":10,"ipfs":"https://bafybeifn7slfc2y7k3wdb3s76cepwq4u3u5fpgoyzjnw3silequyupryw4.ipfs.nftstorage.link/"},{"price":BigInt(200000000000000000),"owner":"0x73c452f178338aa4e34E77C130F9CA0F33C01504","deleted":0,"taxRate":10,"ipfs":"https://bafkreidaakojnr7yjvtids2o4iltts2uyrglav5opyp7laopfy6ue2ae4e.ipfs.nftstorage.link/"},{"price":BigInt(200000000000000000),"owner":"0x84C69A7bfDB140fb6adCe357b9449B1De8CcF907","deleted":0,"taxRate":10,"ipfs":"https://bafybeibhn5lopycw4dkvny5chzjdbflhwb6bz3gnnbfetptxospz6mb5aa.ipfs.nftstorage.link/"},{"price":BigInt(200000000000000000),"owner":"0x73c452f178338aa4e34E77C130F9CA0F33C01504","deleted":0,"taxRate":10,"ipfs":"https://bafybeicf4exepnrtitnniddygshhg67rbytsbwus77oi7wsoe5bk3s6atm.ipfs.nftstorage.link/"},{"price":BigInt(200000000000000000),"owner":"0x73c452f178338aa4e34E77C130F9CA0F33C01504","deleted":0,"taxRate":10,"ipfs":"https://bafybeidqodosk6glnvqjm7z7z3euxddzesmqwqvmjkezs7g7q55fedsp6m.ipfs.nftstorage.link/"},{"price":BigInt(200000000000000000),"owner":"0x84C69A7bfDB140fb6adCe357b9449B1De8CcF907","deleted":0,"taxRate":10,"ipfs":"https://bafybeiaaiagdjs5el3nbhlvt2o7iahz4b5jmoeitbpbzwjq4uuiiay3qam.ipfs.nftstorage.link/"}]
    )
    
    await addBlessingTx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
