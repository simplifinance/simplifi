  // SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Address } from "@openzeppelin/contracts/utils/Address.sol";
import { ISmartStrategy } from "../apis/ISmartStrategy.sol";

library SafeCallSmartStrategy {
  using Address for address;

  /**
   * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
   * on the return value: the return value is optional (but if data is returned, it must not be false).
   */
  function _callOptionalReturnAccount(ISmartStrategy strategy, bytes memory data) private {
    bytes memory returndata = address(strategy).functionCall(data);
    if (returndata.length > 0) {
      // Return data is optional
      require(abi.decode(returndata, (bool)), "SafeCall: Account operation failed");
    }
  }

  function safeActivateStrategy(ISmartStrategy strategy, address router) internal {
    _callOptionalReturnAccount(
      strategy, 
      abi.encodeWithSelector(
        strategy.activateStrategy.selector,
        router
      )
    );
  }

  function safeUpgrade(
    ISmartStrategy strategy,
    address newStrategy,
    address asset
  ) internal {
      _callOptionalReturnAccount(strategy, abi.encodeWithSelector(
        strategy.upgrade.selector,
        newStrategy,
        asset
      )
    );
  }

  function safeCloseTo(
    ISmartStrategy strategy,
    address account
  ) internal {
      _callOptionalReturnAccount(strategy, abi.encodeWithSelector(
        strategy.closeTo.selector,
        account
      )
    );
  }

  function safeWithdrawAsset(
    ISmartStrategy strategy,
    address asset_, 
    address to,
    uint amount
  ) internal {
    _callOptionalReturnAccount(
      strategy, 
      abi.encodeWithSelector(
        strategy.withdrawAsset.selector, 
        asset_,
        to,
        amount
      )
    );
  }
}

