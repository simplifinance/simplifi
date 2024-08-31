// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { AbstractFactory } from "../abstracts/AbstractFactory.sol";

/**@title Factory : Main contract
 * A multi peer-to-peer lending and borrowing structure where two or more people form a synergy to provide financial support
  to one another. In Simplifi protocol, we redefined this pattern of lending and borrowing to remove inherent constraints
  and barriers to financial inclusion. Our permissionless model allows anyone to create a community of fundraisers for the 
  purpose of supporting one another. 
  
  Two options are available to users of Simplifi:
    1). Permissionless community/band: 
        When an user create a band to fund-raise, anyone anywhere around the globe is free to join the clan. This is otherwise 
        known as public band. No restriction to whoever can join but the maximum number of any band (whether permissioned or otherwise) 
        cannot exceed 255.

    2). Permissioned community:
        Creator of this type of band are required to mention their clan whilst setting up. Their members are known to thenm 
        even before the band is created. The predefined members can later confirm their participation by deposit an amount 
        specified by the creator.
     
    For both types, the pooled funds moves from one participant to another in a rotational order until the last participants is
    fulfilled. It is worth to note that this type of loan do not attract interest since the participants act as both lender and borrower.
    However, maker fee is charged on the total borrowed fund.
    Participants can borrow against:
        - platform currency
        - Native chain currency e.g XFI
        - ERC20 tokens.
*/

contract Factory is AbstractFactory {
    mapping(uint => Router)public routers;

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
        See RouterUpgradeable.sol for more details
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
        See RouterUpgradeable.sol for more details
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
    
    /**@dev See RouterUpgradeable.sol */
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