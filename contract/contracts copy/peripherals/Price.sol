// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IDIAOracleV2 } from "../apis/IDIAOracleV2.sol";

abstract contract Price {
    address public immutable diaOracleAddress;

    // ============= constructor ============
    constructor(address _diaOracleAddress) {
        diaOracleAddress = _diaOracleAddress;
    }

    /**
     * @dev Get price of collateral token.
     * @notice For now, if DIAOracle address is empty, its on Celo network otherwise we use a 
     * dummy price pending when Price Oracle is full implemented on the Celo network
     */
    function _getCollateralTokenPrice() internal view returns (uint128 _price) {
        if(diaOracleAddress != address(0)) {
            (uint128 price,) = IDIAOracleV2(diaOracleAddress).getValue('XFI/USD');
            _price = price;
        } else {
            _price = 10000000000000000000;
        }
    }
}