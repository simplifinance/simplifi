// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestAsset is ERC20 {

  constructor() ERC20("Simple Test USD", "SUSD") {
    _mint(msg.sender, 1000000 * (10**18));
  }

  function mint(address to) public {
    uint amount = 1000000 * (10**18);
    _mint(to, amount);
  }

  function mintBatch(address[] memory tos, uint amount) public {
    for(uint i = 0; i < tos.length; i++) {
      _mint(tos[i], amount);
    }
  }
}