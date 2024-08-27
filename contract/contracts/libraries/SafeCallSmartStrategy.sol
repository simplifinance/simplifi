  // SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "@openzeppelin/contracts/utils/Address.sol";
import "../apis/ISmartStrategy.sol";

library SafeCallSmartStrategy {
  using Address for address;

  /**
   * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
   * on the return value: the return value is optional (but if data is returned, it must not be false).
   */
  function _callOptionalReturnAccount(ISmartWallet strategy, bytes memory data) private {
    bytes memory returndata = address(strategy).functionCall(data, "SafeCall: low-level call failed");
    if (returndata.length > 0) {
      // Return data is optional
      require(abi.decode(returndata, (bool)), "SafeCall: Account operation failed");
    }
  }

  function safeActivateStrategy(ISmartWallet strategy, address router) internal {
    _callOptionalReturnAccount(
      strategy, 
      abi.encodeWithSelector(
        strategy.activateStrategy.selector,
        router
      )
    );
  }

  function safeUpgrade(
    ISmartWallet strategy,
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
    ISmartWallet strategy,
    address account
  ) internal {
      _callOptionalReturnAccount(strategy, abi.encodeWithSelector(
        strategy.closeTo.selector,
        account
      )
    );
  }

  function safeWithdrawAsset(
    ISmartWallet strategy,
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

