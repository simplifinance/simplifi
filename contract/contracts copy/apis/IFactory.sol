// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";
import { IAssetClass } from "./IAssetClass.sol";
import { IERC20 } from "./IERC20.sol";

interface IFactory is Common {
  function contributeThroughProvider(Common.Provider[] memory provider, address borrower, uint unit) external returns(bool);
  
  /**
   * @notice sendFee: will be used as flag to auto-withdraw fee from each strategy. If sendFee is true, 
   * when a round is completed, the fee balances in a strategy will be forwarded to 'feeReceiver'.
   */
  struct ContractData {
    address feeTo;
    IAssetClass assetAdmin;
    uint16 makerRate;
    address safeFactory;
    IERC20 collateralToken;
  }

  struct Analytics {
    uint256 tvlCollateral;
    uint256 tvlBase;
    uint totalPermissioned;
    uint totalPermissionless;
  }

  struct ViewFactoryData {
    Analytics analytics;
    ContractData contractData;
    uint currentEpoches;
    uint recordEpoches;
  }
}