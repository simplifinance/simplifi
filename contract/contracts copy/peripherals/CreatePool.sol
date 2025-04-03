// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { Agent } from "./Agent.sol";
import { Pools } from "./Pools.sol";
import { Safe } from "./Safe.sol";
import { Contributor } from "./Contributor.sol";
import { Common } from "../apis/Common.sol";
import { IERC20 } from "../apis/IERC20.sol";
import { TokenInUse } from "./TokenInUse.sol";
import { Point } from "./Point.sol";
import { Utils } from "../libraries/Utils.sol";

contract CreatePool is Agent, Pools, Safe, Point, TokenInUse, Contributor {
    // using SafeMath for uint256;
    using Utils for *;

    error InvalidUnit();
    error InvalidSafe();
    error PoolIsTaken();
    error AddressMustBeArrayOfOneAddress();
    error CollaterlCoverageTooLow();
    error DurationExceed720HoursOrIsZero();
    error UserArrayExceedOne();
    error AddingUserEnded();
    error TokenBalanceInSafeNotTally();

    constructor(
        address controller, 
        address newAgent, 
        IERC20 _token
    ) 
        Agent(controller, newAgent) TokenInUse(_token)
    {}

    function _createPool(
        address newSafe, 
        address[] memory users, 
        uint256 unit,
        uint8 quorum,
        uint16 intRate,
        uint16 durationInHours,
        uint24 colCoverage,
        Common.Router router
    ) internal {
        if(users.length > 1) revert AddressMustBeArrayOfOneAddress();
        bytes32 ownerHash = _setOwnersHash(users, unit, users[0]);
        if(_getSafe(unit).id == address(0)) {
            if(newSafe == address(0)) revert InvalidSafe();
            require(IERC20(_getToken()).balanceOf(newSafe) >= unit, "Low Liq");
            _setSafe(Common.Safe(newSafe, ownerHash), unit); 
        }
        if(_getPool(unit, Common.UnitStatus.RECORD).lInt.status == Common.Status.TAKEN) revert PoolIsTaken();
        if(colCoverage < 100) revert CollaterlCoverageTooLow();
        if(durationInHours == 0 || durationInHours > 720) revert DurationExceed720HoursOrIsZero();      
        unchecked {
            _setPool(
                Common.Pool(
                    users[0],
                    address(0),
                    Common.LowInt(quorum, colCoverage, durationInHours * 1 hours, Common.Status.TAKEN, router, Common.Stage.JOIN),
                    Common.BigInt(unit, unit, _getRecordId()),
                    (unit * quorum).computeInterestsBasedOnDuration(intRate, uint24(durationInHours))
                ),
                unit,
                Common.UnitStatus.CURRENT
            );
        }
        _incrementUserCount(unit);
    }

    function _setOwnersHash(
        address[] memory addrs, 
        uint256 unit, 
        address admin
    ) internal returns(bytes32 _hash) {
        uint size = addrs.length;
        for(uint i = 0; i < size; i++) {
            address addr = addrs[i];
            if(addr == admin){
                _hash = keccak256(
                    abi.encodePacked(
                        _hash,
                        addr
                    )
                );
            } else { 
                _hash = keccak256(
                    abi.encodePacked(
                        _hash,
                        addr,
                        unit
                    )
                );
            }
            _setPoint(addr, 0, 2);
            _addContributor(unit, Common.Contributor(addr == admin, 0, 0, 0, 0, addr, true));
        }
    }

     function addUserToPool(uint256 unit, address[] memory user) public returns(bool) {
        Common.Pool memory _p = _getPool(unit, Common.UnitStatus.CURRENT);
        Common.Contributor memory _c = _getProfile(user[0], unit);
        _setOwnersHash(user, unit, address(0));
        unchecked {
            _p.bigInt.currentPool += unit;
        }
        if(_p.lInt.stage != Common.Stage.JOIN) revert AddingUserEnded();
        if(user.length > 1) revert UserArrayExceedOne();
        if(IERC20(_getToken()).balanceOf(_getSafe(unit).id) < _p.bigInt.currentPool) revert TokenBalanceInSafeNotTally();
        if(_p.lInt.router == Common.Router.PERMISSIONLESS) require(!_c.isMember, "User exist");
        else require(_c.isMember && !_c.sentQuota, "Already sent quota");
        _incrementUserCount(unit);
        _addContributor(unit, Common.Contributor(true, 0, 0, 0, 0, user[0], true));
        if(_getUserCount(unit) == _p.lInt.quorum) {
            _p.lInt.stage = Common.Stage.GET;
            _resetUserCount(unit);
            _setTurnTime(_p.admin, unit, Utils._now());
            // _p.beneficiary = _p.admin;
        }
        _setPool(_p, unit, Common.UnitStatus.CURRENT);

        return true;
    }

    function setToken(IERC20 newToken) public onlyOwner {
        _replaceToken(newToken);
    }

    /**
     * @dev Validate inputs from user
     * @param safe : Safe account
     * @param users : List of contributors. If pool type is permissionless, length of users should be 1
     * @param unit : Unit contribution
     * @param quorum : Expected number of contributors
     * @param intRate : Interest rate
     * @param durationInHours : Duration in hours, that the loan is due for repayment
     * @param colCoverage : Collateral ratio. Must be multiply by 100 before parsing as input i.e if raw ccr
     *              is 1.2, it should be rendered as 1.2 * 100 = 120.
     * @param router : Pool type. Can be permissoned or permissionless.
     */
    function _validateCreatepoolInputs(
        address safe, 
        address[] memory users, 
        uint256 unit,
        uint8 quorum,
        uint16 intRate,
        uint16 durationInHours,
        uint24 colCoverage,
        Common.Router router
    ) internal pure {
        if(safe == address(0)) revert InvalidSafe();
        if(router == Common.Router.PERMISSIONLESS) {
            require(users.length == 1, 'Invalid user list');
        } else {
            require(users.length > 1, 'Invalid user list');
        }
        if(unit == 0) revert InvalidUnit();

    }
    
}
