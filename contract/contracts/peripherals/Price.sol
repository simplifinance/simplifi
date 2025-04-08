// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IDIAOracleV2 } from "../apis/IDIAOracleV2.sol";
import { IERC20 } from "../apis/IERC20.sol";
import { OnlyRoleBase, IRoleBase } from "./OnlyRoleBase.sol";
import { ErrorLib } from "../libraries/ErrorLib.sol";
import { ERC20Manager, IERC20, ISupportedAsset } from "./ERC20Manager.sol";

abstract contract Price is OnlyRoleBase, ERC20Manager {
    using ErrorLib for *;

    // DIA oracle address
    address public immutable diaOracleAddress;

    // Mapping of supported collateral asset to price pair
    mapping (IERC20 tokenAddress => string) private pairs;

    // ============= constructor ============
    constructor(
        address _diaOracleAddress, 
        ISupportedAsset _assetManager, 
        IRoleBase _roleManager,
        IERC20 _baseAsset
    ) 
        OnlyRoleBase(_roleManager)
        ERC20Manager(_assetManager, _baseAsset)
    {
        diaOracleAddress = _diaOracleAddress;
    }

    /**
     * @dev Map collateral asset to their corresponding pair for price retrieval
     * @param collateralAsset : ERC20 compatible asset
     * @param pair : Price pair e.g cUSD/USDT
     * @notice Collateral asset must be supported
    */
    function setPair(
        IERC20 collateralAsset, 
        string memory pair
    ) 
        public 
        onlyRoleBearer
        onlySupportedAsset(collateralAsset)
        returns(bool) 
    {
        if(bytes(pair).length == 0) 'Invalid pair'._throw();
        if(address(collateralAsset) == address(0)) 'Asset is zero'._throw();
        pairs[collateralAsset] = pair;
        return true;
    }

    /**
     * @dev Get price of collateral token.
     * @notice For now, if DIAOracle address is empty, its on Celo network otherwise we use a 
     * dummy price pending when Price Oracle is full implemented on the Celo network
     */
    function _getCollateralTokenPrice(IERC20 colAsset) internal view returns (uint128 _price) {
        string memory pair = pairs[colAsset];
        if(diaOracleAddress != address(0)) {
            (uint128 price,) = IDIAOracleV2(diaOracleAddress).getValue(pair); 
            _price = price;
        } else {
            _price = 10000000000000000000;
        }
    }
}