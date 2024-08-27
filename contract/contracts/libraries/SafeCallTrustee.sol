  // SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { ITrustee } from "../api/ITrustee.sol";
import { Address } from "@openzeppelin/contracts/utils/Address.sol";

library SafeCallTrustee {
  using Address for address;

  function safeRegisterBeneficiaries(
    ITrustee trustee,
    address[] memory strategies,
    uint256 amount, 
    uint poolId,
    address asset
  ) internal {
    _callOptionalReturn(trustee, abi.encodeWithSelector(trustee.registerBeneficiaries.selector, strategies, amount, poolId, asset));
  }

  function safeTransferOut(
    ITrustee trustee,
    address asset, 
    address strategy, 
    uint256 amount,
    uint256 fee
  ) internal {
    _callOptionalReturn(trustee, abi.encodeWithSelector(trustee.transferOut.selector, asset, strategy, amount, fee));
  }

  /** Imported from Openzeppelin
   * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
   * on the return value: the return value is optional (but if data is returned, it must not be false).
   * @param trustee: Trustee contract.
   * @param data The call data (encoded using abi.encode or one of its variants).
   */
  function _callOptionalReturn(ITrustee trustee, bytes memory data) private {
    // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
    // we're implementing it ourselves. We use {Address.functionCall} to perform this call, which verifies that
    // the target address contains contract code and also asserts for success in the low-level call.

    bytes memory returndata = address(trustee).functionCall(data, "SafeCallTrustee: low-level call failed");
    if (returndata.length > 0) {
      // Return data is optional
      require(abi.decode(returndata, (bool)), "SafeCallTrustee: operation failed");
    }
  }

}
