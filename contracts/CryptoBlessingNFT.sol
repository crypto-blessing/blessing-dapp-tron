// contracts/CryptoBlessingNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoBlessingNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("CryptoBlessingNFT", "CBNFT") {}

    mapping(address => uint256[]) claimerTokens;

    function awardBlessingNFT(address claimer, string memory blessingURI)
        public onlyOwner
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        _mint(claimer, newItemId);
        _setTokenURI(newItemId, blessingURI);
        claimerTokens[claimer].push(newItemId);

        _tokenIds.increment();
        return newItemId;
    }

    function getMyBlessingsURI()
        public view
        returns (string[] memory)
    {
        uint256[] memory tokenIDs = claimerTokens[msg.sender];
        string[] memory uris = new string[](tokenIDs.length);
        for (uint256 i = 0; i < tokenIDs.length; i ++) {
            uris[i] = tokenURI(tokenIDs[i]);
        }
        return uris;
    }

}