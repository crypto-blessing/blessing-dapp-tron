

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
    if (address != undefined && address.length === 34) {
        return address.substring(0, 10) + '...' + address.substring(address.length - 10, address.length);
    }
    
}

export const chainName = (networkHost) => {
    switch (networkHost) {
        case 'https://api.nileex.io':
            return 'TRON Nile Testnet';
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

export const CBTContractAddress = () => {
    return "TCAe2rdd1PBNfiFL5qJcSKk9GSYYfSmeoh"
}

export const CBNFTContractAddress = () => {
    return "TG2p7hJdAjpxSMTnjVfiTH3yTdVTZQEVUP"
}
