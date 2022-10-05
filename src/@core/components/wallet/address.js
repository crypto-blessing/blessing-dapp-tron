export const simpleShow = (address) => {
    if (address != undefined && address.length === 34) {
        return address.substring(0, 10) + '...' + address.substring(address.length - 10, address.length);
    }
    
}

export const miniShow = (address) => {
    if (address != undefined && address.length === 34) {
        return address.substring(0, 3) + '...' + address.substring(address.length - 3, address.length);
    }
    
}

export const chainName = (networkHost) => {
    switch (networkHost) {
        case 'https://api.nileex.io':
            return 'TRON Nile Testnet';
    }
}

export const CBTContractAddress = () => {
    return "TCAe2rdd1PBNfiFL5qJcSKk9GSYYfSmeoh"
}

export const CBNFTContractAddress = () => {
    return "TYiesynAuJTrpTihHW7d1JUngFyAX7EE99"
}

export const cryptoBlessingAdreess = () => {
    return "TY8ynXxdc8Kzs862i83zPxTfFvUPWccoi2"
}