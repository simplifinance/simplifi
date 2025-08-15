// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

import { ISupportedAsset } from "./ISupportedAsset.sol";
import { IERC20 } from "./IERC20.sol";
import { IPoint } from "./IPoint.sol";
import { IVerifier } from "./IVerifier.sol";

interface IStateManager {
    struct StateVariables {
        address feeTo;
        uint16 makerRate;
        ISupportedAsset assetManager; 
        IERC20 baseAsset;
        IPoint pointFactory;
        IVerifier verifier;
    }
    function getStateVariables() external view returns(StateVariables memory);
}
