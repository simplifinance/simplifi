// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { ERC20, Context } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IERC20 } from "../../../apis/IERC20.sol";

contract BaseAsset is ERC20 {
  constructor() ERC20("Base Asset", "BSD") {
    _mint(msg.sender, 100000 * (10**18));
  }

  function mint(address[] memory tos, uint amount) public returns(bool) {
    for(uint i = 0; i < tos.length; i++) {
      _mint(tos[i], amount);
    }
    return true;
  }
  
}