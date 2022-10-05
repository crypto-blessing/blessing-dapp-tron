import { ethers } from 'ethers';
import {toLocaleDateFromBigInt} from 'src/@core/utils/date'
import {miniShow, simpleShow, cryptoBlessingAdreess} from 'src/@core/components/wallet/address'
import {encode} from 'src/@core/utils/cypher'

export const getBlessingTitle = (description) => {
    if (description != undefined && description.length > 0) {
        return description.split('#')[0]
    }
}

export const getBlessingDesc = (description, omit = false) => {
    if (description != undefined && description.length > 0) {
        const apadteLength = 40
        let desc = description.split('#')[1]
        if (omit && desc.length > apadteLength) {
            return desc.substring(0, apadteLength) + '...'
        }
        
        return desc
    }
}

export const transBlesingsFromWalletBlessings = (sender, blessings) => {
    let newBlessings = []
    let blessingIndex = 0
    blessings.forEach(blessing => {
        newBlessings.push({
            code: blessing.blessingID,
            blessing: blessing.blessingImage,
            time: toLocaleDateFromBigInt(blessing.sendTimestamp.toString()),
            amount: window.tronWeb.fromSun(blessing.tokenAmount),
            quantity: blessing.claimQuantity.toString(),
            type: blessing.claimType === 0 ? 'AVERAGE' : 'RANDOM',
            progress: '/claim?sender=' + encode(sender) + '&blessing=' + encode(blessing.blessingID) + '&blessing_index=' + (blessingIndex++),
            revoked: blessing.revoked
        })
    })

    return newBlessings.reverse()
}

export const transClaimBlesingsFromWalletBlessings = (blessings) => {
    let newBlessings = []
    let blessingIndex = 0
    blessings.forEach(blessing => {
        newBlessings.push({
            code: blessing.blessingID,
            blessing: blessing.blessingImage,
            sender: simpleShow(blessing.sender),
            time: toLocaleDateFromBigInt(blessing.claimTimestamp.toString()),
            amount: parseFloat(window.tronWeb.fromSun(blessing.claimAmount)).toFixed(2),
            tax: parseFloat(window.tronWeb.fromSun(blessing.taxAmount)).toFixed(2),
            progress: '/claim?sender=' + encode(blessing.sender) + '&blessing=' + encode(blessing.blessingID) + '&blessing_index=' + (blessingIndex++)
        })
    })

    return newBlessings.reverse()
}

export const transClaimListFromWalletClaims = (claims) => {
    let newClaims = []
    let claimedAmount = 0
    let luckyClaimer = {}
    let maxClaimAmount = 0.0
    claims.forEach(claim => {
        claimedAmount += parseFloat(window.tronWeb.fromSun(claim.distributedAmount))
        if (parseFloat(window.tronWeb.fromSun(claim.distributedAmount)) > maxClaimAmount) {
            maxClaimAmount = parseFloat(window.tronWeb.fromSun(claim.distributedAmount))
            luckyClaimer = {
                claimer: miniShow(window.tronWeb.address.fromHex(claim.claimer)),
                amount: window.tronWeb.fromSun(claim.distributedAmount),
            }
        }
        newClaims.push({
            claimer: miniShow(window.tronWeb.address.fromHex(claim.claimer)),
            time: toLocaleDateFromBigInt(claim.claimTimestamp.toString()),
            amount: window.tronWeb.fromSun(claim.distributedAmount),
            CBTokenAwardToSenderAmount: window.tronWeb.fromSun(claim.CBTokenAwardToSenderAmount),
        })
    })

    return {
        "claims": newClaims.reverse(),
        "claimedAmount": claimedAmount.toFixed(2),
        "luckyClaimer": luckyClaimer
    }
}
