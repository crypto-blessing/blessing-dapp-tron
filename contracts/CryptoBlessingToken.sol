// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoBlessingToken is ERC20,  Ownable {
    constructor() ERC20("CryptoBlessingToken", "CBT") {
        _mint(msg.sender, 1 * 100000000 * 10 ** decimals());
    }

    function mint(uint256 amount) public onlyOwner {
        _mint(msg.sender, amount);
    }

    function burn(uint256 amount) public onlyOwner {
        _burn(msg.sender, amount);
    }

}