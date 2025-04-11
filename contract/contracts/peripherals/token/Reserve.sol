// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { TokenInteractor, IRoleBase} from "./TokenInteractor.sol";

/**
 * @title Reserve
 * @dev Total supply is minted to this contract and is controlled by an owner address
 * that should be a multisig account.
 */

contract Reserve is TokenInteractor {
    constructor(IRoleBase _roleManager) TokenInteractor(_roleManager) { }

    function name() public pure returns(string memory) {
        return "RESERVE";
    }

}
