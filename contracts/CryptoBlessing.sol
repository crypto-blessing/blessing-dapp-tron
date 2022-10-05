// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

interface ICryptoBlessingNFT {
    function mintMyselfWithTokenURI(uint256 tokenId, string memory tokenURI) external returns (bool);
}

contract CryptoBlessing is Ownable, Pausable, ReentrancyGuard {

    using SafeMath for uint256;

    // 奖励的CB token地址
    address cryptoBlessingTokenAddress;
    // nft
    address cryptoBlessingNFTAddress;

    uint256 CBTOKENAWARDRATIO = 5;
    uint256 CBTOKENAWARDMAX = 100;

    uint256 CLAIM_TAX_RATE = 10; // 1000

    event senderSendCompleted(address sender, string blessingID);

    event claimerClaimComplete(address sender, string blessingID);

    event senderRevokeComplete(address sender, string blessingID);

    function setCBTOKENAWARDRATIO(uint256 _CBTOKENAWARDRATIO, uint256 _CBTOKENAWARDMAX) public onlyOwner {
        CBTOKENAWARDRATIO = _CBTOKENAWARDRATIO;
        CBTOKENAWARDMAX = _CBTOKENAWARDMAX;
    }


    function setCLAIM_TAX_RATE(uint256 _CLAIM_TAX_RATE) public onlyOwner {
        CLAIM_TAX_RATE = _CLAIM_TAX_RATE;
    }
    constructor(address _cryptoBlessingTokenAddress, address _cryptoBlessingNFTAddress) payable {
        cryptoBlessingTokenAddress = _cryptoBlessingTokenAddress;
        cryptoBlessingNFTAddress = _cryptoBlessingNFTAddress;
    }

    function setCryptoBlessingTokenAddress(address _cryptoBlessingTokenAddress, address _cryptoBlessingNFTAddress) public onlyOwner {
        cryptoBlessingTokenAddress = _cryptoBlessingTokenAddress;
        cryptoBlessingNFTAddress = _cryptoBlessingNFTAddress;
    }

    enum ClaimType {
        AVERAGE_CLAIM,
        RANDOM_CLAIM
    }

    struct Blessing {
        uint256 price;
        address owner;
        uint8 deleted;
        uint256 taxRate;
        string ipfs;
    }
    mapping (string => Blessing) public blessingMapping;

    function updateBlessing(
        string memory image,
        uint256 price,
        address blessing_owner,
        uint8 deleted,
        uint256 taxRate,
        string memory ipfs
    ) public onlyOwner {
        blessingMapping[image] = Blessing(price, blessing_owner, deleted, taxRate, ipfs);
    }

    struct SenderBlessing {
        string blessingID;
        string blessingImage;
        uint256 sendTimestamp;
        uint256 tokenAmount;
        uint256 claimQuantity;
        ClaimType claimType;
        bool revoked;
    }
    
    // 发送者的祝福列表
    mapping (address => SenderBlessing[]) public senderBlessingMapping;

    struct ClaimerBlessing {
        address sender;
        string blessingID;
        string blessingImage;
        uint256 claimTimestamp;
        uint256 claimAmount;
        uint256 taxAmount;
    }

    // 接收者的祝福列表
    mapping (address => ClaimerBlessing[]) public claimerBlessingMapping;

    struct BlessingClaimStatus {
        address claimer;
        uint256 claimTimestamp;
        uint256 distributedAmount;
        uint256 claimAmount;
        uint256 taxAmount;
        uint256 CBTokenAwardToSenderAmount;
    }

    // 祝福的状态列表 blessingID => BlessingClaimStatus[]
    mapping (string => BlessingClaimStatus[]) public blessingClaimStatusMapping;

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(bytes(a)) == keccak256(bytes(b)));
    }

    struct ClaimPubkeyStatus {
        bytes32 priKey;
        bool used;
    }

    mapping(string => ClaimPubkeyStatus[]) public blessingPubkeyStatusMapping;

    function sendBlessing(
        string memory image,
        string memory blessingID,
        uint256 tokenAmount,
        uint256 claimQuantity,
        ClaimType claimType,
        bytes32[] memory priKeys
    ) public whenNotPaused payable {
        require(0 < tokenAmount, "tokenAmount must be greater than 0");
        require(0 < claimQuantity && claimQuantity <= 13, "claimQuantity must be greater than 0 and less or equal than 13");
        require(claimQuantity == priKeys.length, "claimQuantity must be equal to pubkeys.length");
        Blessing memory choosedBlessing = blessingMapping[image];
        require(choosedBlessing.price > 0 && choosedBlessing.deleted == 0, "Invalid blessing status!");

        // ether amount must be greater than
        require(msg.value >= tokenAmount.add((claimQuantity.mul(choosedBlessing.price))), "Your TRX token amount must be greater than you are trying to send!");

        // require(payable(address(uint160(address(this)))).send(tokenAmount), "Failed to send TRX to contract!");

        require(payable(address(uint160(choosedBlessing.owner))).send(claimQuantity.mul(choosedBlessing.price)), "Failed to send TRX to blessing owner!");
        // payable(choosedBlessing.owner).transfer(claimQuantity.mul(choosedBlessing.price).mul(100 - choosedBlessing.taxRate).div(100));
        // payable(owner()).transfer(claimQuantity.mul(choosedBlessing.price).mul(choosedBlessing.taxRate).div(100));

        senderBlessingMapping[msg.sender].push(SenderBlessing(
            blessingID,
            image,
            block.timestamp,
            tokenAmount,
            claimQuantity,
            claimType,
            false
        ));

        // init the blessing claim pubkey status, claimer will use unique privatekey to sign the claim
        for(uint256 i = 0; i < priKeys.length; i ++) {
            blessingPubkeyStatusMapping[blessingID].push(ClaimPubkeyStatus(
                priKeys[i], false
            ));
        }

        emit senderSendCompleted(msg.sender, blessingID);
    }

    function revokeBlessing(string memory blessingID) public whenNotPaused {
        BlessingClaimStatus[] memory blessingClaimStatusList = blessingClaimStatusMapping[blessingID];
        require(blessingClaimStatusList.length == 0, "Your blessing is claiming by others. Can not revoke anymore!");

        SenderBlessing[] memory senderBlessings = senderBlessingMapping[msg.sender];
        require(senderBlessings.length > 0, "There is no blessing found on this sender!");
        SenderBlessing memory choosedSenderBlessing;
        uint256 choosedIndex;
        for (uint256 i = 0; i < senderBlessings.length; i ++) {
            if (compareStrings(senderBlessings[i].blessingID, blessingID)) {
                choosedSenderBlessing = senderBlessings[i];
                choosedIndex = i;
                break;
            }
        }
        require(choosedSenderBlessing.tokenAmount > 0, "There is no blessing found on this sender!");
        // transfer from contract to the address
        payable(address(uint160(msg.sender))).transfer(choosedSenderBlessing.tokenAmount);

        senderBlessingMapping[msg.sender][choosedIndex].revoked = true;

        emit senderRevokeComplete(msg.sender, blessingID);
    }

    function claimBlessing(
        address sender,
        string memory blessingID,
        string memory pubKey
    ) public whenNotPaused nonReentrant returns (ClaimerBlessing memory){
        require(_verify(pubKey, blessingID), "Invalid signiture!");
        require(!Address.isContract(msg.sender), "You can not claim blessing from contract!");
        SenderBlessing[] memory senderBlessings = senderBlessingMapping[sender];
        require(senderBlessings.length > 0, "There is no blessing found on this sender!");
        SenderBlessing memory choosedSenderBlessing;
        for (uint256 i = 0; i < senderBlessings.length; i ++) {
            if (compareStrings(senderBlessings[i].blessingID, blessingID)) {
                choosedSenderBlessing = senderBlessings[i];
                break;
            }
        }
        require(choosedSenderBlessing.revoked == false, "This blessing is revoked!");
        require(choosedSenderBlessing.tokenAmount > 0, "There is no blessing found on this sender!");
        BlessingClaimStatus[] memory blessingClaimStatusList = blessingClaimStatusMapping[blessingID];
        require(blessingClaimStatusList.length < choosedSenderBlessing.claimQuantity, "There is no more blessings!");


        uint256 distributedAmount = 0;
        for (uint256 i = 0; i < blessingClaimStatusList.length; i ++) {
            require(blessingClaimStatusList[i].claimer != msg.sender, "You have already claimed this blessing!");
            distributedAmount += blessingClaimStatusList[i].distributedAmount;
        }

        uint256 distributionAmount = 0;
        if (choosedSenderBlessing.claimType == ClaimType.AVERAGE_CLAIM) {
            distributionAmount = choosedSenderBlessing.tokenAmount.div(choosedSenderBlessing.claimQuantity);
        } else if (choosedSenderBlessing.claimType == ClaimType.RANDOM_CLAIM) {
            uint256 leftQuantity = choosedSenderBlessing.claimQuantity.sub(blessingClaimStatusList.length);
            uint randromNumber = _random(10);
            if (leftQuantity == 1) {
                distributionAmount = choosedSenderBlessing.tokenAmount.sub(distributedAmount);
            } else {
                distributionAmount = choosedSenderBlessing.tokenAmount.sub(distributedAmount).div(leftQuantity).mul(randromNumber).div(10).mul(2);
            }
        }

        ClaimerBlessing memory claimerBlessing = ClaimerBlessing(
            sender,
            blessingID,
            choosedSenderBlessing.blessingImage,
            block.timestamp,
            distributionAmount.div(1000).mul(1000 - CLAIM_TAX_RATE),
            distributionAmount.div(1000).mul(CLAIM_TAX_RATE)
        );

        claimerBlessingMapping[msg.sender].push(claimerBlessing);

        uint256 CBTokenAward = distributionAmount.mul(CBTOKENAWARDRATIO);
        if (CBTokenAward > CBTOKENAWARDMAX * 10 ** 18) {
            CBTokenAward = (CBTOKENAWARDMAX-1) * 10 ** 18;
        }
        blessingClaimStatusMapping[blessingID].push(BlessingClaimStatus(
            msg.sender,
            block.timestamp,
            distributionAmount,
            distributionAmount.div(1000).mul(1000 - CLAIM_TAX_RATE),
            distributionAmount.div(1000).mul(CLAIM_TAX_RATE),
            CBTokenAward
        ));

        // transer to claimer
        payable(address(uint160(msg.sender))).transfer(distributionAmount.div(1000).mul(1000 - CLAIM_TAX_RATE));
        payable(address(uint160(owner()))).transfer(distributionAmount.div(1000).mul(CLAIM_TAX_RATE));
        
        // award 10 CBT tokens to the sender
        if(IERC20(cryptoBlessingTokenAddress).balanceOf(address(this)) >= CBTokenAward) {
            require(IERC20(cryptoBlessingTokenAddress).transfer(sender, CBTokenAward), "award CBT tokens failed!");
        }

        Blessing memory choosedBlessing = blessingMapping[choosedSenderBlessing.blessingImage];

        // award blessing NFT.
        require(ICryptoBlessingNFT(cryptoBlessingNFTAddress).mintMyselfWithTokenURI(block.number, choosedBlessing.ipfs), "mint blessing NFT failed!");

        emit claimerClaimComplete(sender, blessingID);
        return claimerBlessing;
    }

    function _random(uint number) internal view returns(uint){
        uint rand = uint(blockhash(block.number-1)) % number;
        if (rand == 0 || rand == 10) {
            rand = 1;
        }
        return rand;
    }

    function _verify(string memory pubKey, string memory blessingID) internal returns (bool) {
        bytes32 hash = keccak256(abi.encodePacked(pubKey));
        for(uint256 i = 0; i < blessingPubkeyStatusMapping[blessingID].length; i ++) {
            if (blessingPubkeyStatusMapping[blessingID][i].priKey == hash && !blessingPubkeyStatusMapping[blessingID][i].used) {
                blessingPubkeyStatusMapping[blessingID][i].used = true;
                return true;
            }
        }
        return false;
    }

}
