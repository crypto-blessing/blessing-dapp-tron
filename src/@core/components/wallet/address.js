

export const getProviderUrl = (chainId) => {
    switch (chainId) {
        case 56:
            return 'https://apis.ankr.com/e6fc9c6cc295486dab5eb00d387e968b/807cff1041c516e514318a326153c1f3/binance/full/main';
        case 97:
            return 'https://apis.ankr.com/4ba236862ab54a55b364dcd322cdb412/807cff1041c516e514318a326153c1f3/binance/full/test';
        case 1337:
            return 'http://localhost:8545';
    }
}

export const simpleShow = (address) => {
    if (address != undefined && address.length === 42) {
        return address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length);
    }
    
}

export const chainName = (chainId) => {
    switch (chainId) {
        case 56:
            return 'BSC-Mainnet';
        case 97:
            return 'BSC-Testnet';
        case 1337:
            return 'Localnet';
    }
}

export const cryptoBlessingAdreess = (chainId) => {
    switch (chainId) {
        case 56:
            return '0x8abAe8e76232765db7A08e6f296Cc6aa3605DE25';
        case 97:
            return '0x2729A50C4A92eD0CDC0B2feF155fd890b92D3bfE';
        case 1337:
            return '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0';
        default:
            return '0xc0CE659216A0EE7B0a9c309BdE2FB42376aD215a';
    }

}

export const BUSDContractAddress = (chainId) => {
    switch (chainId) {
        case 56:
            return '0xe9e7cea3dedca5984780bafc599bd69add087d56';
        case 97:
            return '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7';
        case 1337:
            return '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6';
        default:
            return '0xe9e7cea3dedca5984780bafc599bd69add087d56';
    }
}

export const CBTContractAddress = (chainId) => {
    switch (chainId) {
        case 56:
            return '0x8b645c57Bf173b37c223Fdc951CdaeB1DcC842D9';
        case 97:
            return '0xeEae5ce3E1EFa017Fd5ca751d267AA119D7a8fD3';
        case 1337:
            return '0x610178dA211FEF7D417bC0e6FeD39F05609AD788';
        default:
            return '0x218B53FBCc4b128e2FF289d78079174d7E35CF4C';
    }
}

export const CBNFTContractAddress = (chainId) => {
    switch (chainId) {
        case 56:
            return '0x8E5b170447280BfB7dcE7EB5fa3D48ddDF3aEFcE';
        case 97:
            return '0x58217f42d0Ca1F99Cf93cA0D3e177f47F5794695';
        case 1337:
            return '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e';
        default:
            return '0x01ee790155677AAAE3060a09e32491d4C716f908';
    }
}
