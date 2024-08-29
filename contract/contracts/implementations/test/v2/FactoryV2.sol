// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { AbstractFactory } from "../../../abstracts/AbstractFactory.sol";

/**@title Router Version 2 {For testing purpose}
*/

contract FactoryV2 is AbstractFactory {
  mapping(uint => Router) public routers;

  /** @dev Initializes state variables.
    * @param _makerRate : Platform fee in %
    * @param _token : Token contract
    * @param _minContribution : Minimum contribution amount.
    * @param _feeTo : Account to receive fees.
    * @param _assetAdmin : Asset admin contract.
    * @param _strategyAdmin : Strategy admin contract.
    * @param _trustee : Trustee contract.
    */
  constructor(
    uint16 _makerRate,
    uint _minContribution,
    address _token,
    address _feeTo,
    address _assetAdmin,
    address _strategyAdmin,
    address _trustee
  ) AbstractFactory(
    _makerRate,
    _minContribution,
    _token,
    _feeTo,
    _assetAdmin,
    _strategyAdmin,
    _trustee
  ) { }

  ///@dev Fallback
  receive() external payable {}

  /**@dev Create permissioned pool
    See AbstractFactory.sol for more details
  */
  function createPermissionedPool(
    uint8 durationInHours,
    uint16 colCoverageRatio,
    uint amount,
    address asset,
    address[] memory participants
  ) external payable returns(bool) {
    require(participants.length > 1, "Router: Invalid array");
    Router _router = Router.PERMISSIONED;
    routers[_createPool(0, durationInHours, colCoverageRatio, amount, asset, participants, _router)] = _router;
    return true;
  }

  /**@dev Create permissionless
      See AbstractFactory.sol for more details
  */
  function createPermissionlessPool(
    uint8 quorum,
    uint8 durationInHours,
    uint16 colCoverageRatio,
    uint amount,
    address asset
  ) external payable returns(bool) {
    address[] memory participants = new address[](1);
    participants[0] = _msgSender();
    Router _router = Router.PERMISSIONLESS;
    routers[_createPool(quorum, durationInHours, colCoverageRatio, amount, asset, participants, _router)] = _router;
    return true;
  }

  /**@dev Add msg.sender to a pool at poolId See AbstractFactory.sol */
  function joinBand(uint poolId) 
    external 
    payable
    checkFunctionPass(poolId, FuncTag.JOIN) 
    whenNotPaused
    returns(bool) 
  {
    return _joinBand(poolId, routers[poolId] == Router.PERMISSIONED);
  }

  function withdraw(address to, uint amount) public onlyOwner {
    uint256 balance = address(this).balance;
    require(balance >= amount, "RouterLib: InsufficientFund");
    (bool done, ) = to.call{value: amount}("");
    require(done);
  }

  /**@dev Return the router that a poolId belongs to. 
  */
  function getRouterWithPoolId(uint poolId) external view returns(string memory) {
    return routers[poolId] == Router.PERMISSIONLESS ? "PERMISSIONLESS" : "PERMISSIONED";
  }
}