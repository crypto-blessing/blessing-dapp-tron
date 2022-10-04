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

export const cryptoBlessingAdreess = () => {
    return "TEk35DMfL1SaQh8TFAhN4jPoMJw6JUet1Z"
}

export const CBTContractAddress = () => {
    return "TCAe2rdd1PBNfiFL5qJcSKk9GSYYfSmeoh"
}

export const CBNFTContractAddress = () => {
    return "TG2p7hJdAjpxSMTnjVfiTH3yTdVTZQEVUP"
}
