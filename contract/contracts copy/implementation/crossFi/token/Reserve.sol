// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { TokenInteractor, IOwnerShip} from "./TokenInteractor.sol";

/**
 * @title Reserve
 * @dev Total supply is minted to this contract and is controlled by an owner address
 * that should be a multisig account.
 */

contract Reserve is TokenInteractor {
    constructor(IOwnerShip _ownershipManager) TokenInteractor(_ownershipManager) { }

    function name() public pure returns(string memory) {
        return "RESERVE";
    }

}
