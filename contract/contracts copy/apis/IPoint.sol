// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";
/**
 * @title Simplifi
 * @author : Bobeu - https://github.com/bobeu
 * @notice : Interface of the Point contract for managing user's rewards and points.
 */
interface IPoint {
  struct Initializer {
    bool isRegistered;
    uint location;
  }

  function getPoint(address user) external view returns(Common.Point memory);
  function setPoint(address user, Common.Point memory) external view returns(bool);
  function deductPoint(address user, Common.Point memory) external view returns(bool);
}