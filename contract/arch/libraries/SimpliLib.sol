  // SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IERC20 } from "../apis/IERC20.sol";
import { Common } from "../apis/Common.sol";
import { ISimplifi } from "../apis/ISimplifi.sol";
// import { Address } from "@openzeppelin/contracts/utils/Address.sol";

struct Data {
        /**
     * Mapping of unit contribution pool variants
     * Variation of pools is tracked in Common.Branch which can be either RECORD or CURRENT
     * We use one storage reference 'pool' to hold both the current and past pools except that it
     * branched off using Branch and different uint256 key.
     *      To get current Pool, use pools[unit][Common.Branch.CURRENT];
     *      To get past Pool, use pools[recordId][Common.Branch.RECORD]; This is beacuse a unit contribution can have 
     *          multiple records while current maintains only one data reference.
     * @notice We preserve slot 0 in Branch.CURRENT to easily replace a completed pool with an empty 
     * one. This is easier and efficient for us than deleting an entire pool. 
     */
    mapping (uint256 => mapping( Common.Branch => Common.Pool)) pools; 
}


library SimpliLib {

     /**
     * @dev Create a new pool : Permissioned or Permissionless
     * @param asset : Asset to use. It should be a supported asset
     * @param users : Users. If Router is Permissioned, list is expected to minimum 2
     * @param unit : Unit contribution
     * @param quorum : Number of participants expected to participate
     * @param intRate : Rate of interest that should be charged
     * @param durationInHours : Number of hours each contributor will have the possession of funds before they return it to the pool
     * @param colCoverage : Collateral index coverage. Collateral determinant for contributors to borrow.
                            This is expressed as a multiplier index in the total loanable amount.
     * @param router : Flat of type Router to determined the type of pool to create. It could be Permissioned or Permissionless
     * @notice We removed collateral coverage check so as to enable more flexible tuning and customization. Example: Bob, Alice and Kate agreed
   *            to operate a flexpool of unit $100 at zero collateral index. So Bob creates a flexpool of $100 setting quorum to maximum 3 participants.
   *            He set colCoverage to 0. If particapant A wants to get finance, they will be required to provide (collateralCalculor * 0) which is 0
   *            in order to get finance.
     */
    function _createPool(
        IERC20 asset, 
        address[] memory users, 
        uint256 unit,
        uint8 quorum,
        uint16 intRate,
        uint16 durationInHours,
        uint24 colCoverage,
        Common.Router router
    ) internal {
        if(router == Common.Router.PERMISSIONLESS) {
            if(quorum <= 1) revert ISimplifi.MinimumParticipantIsTwo();
        } else {
            if(users.length < 2) revert ISimplifi.MinimumParticipantIsTwo();
        }
        if(_getPool(unit, Common.Branch.CURRENT).lInt.status == Common.Status.TAKEN) revert PoolIsTaken();
        if(colCoverage < 100) revert CollaterlCoverageTooLow();
        if(durationInHours == 0 || durationInHours > 720) revert DurationExceed720HoursOrIsZero();      
        Bank safe = _getSafe(unit, feeTo, collateralToken);
        _checkAndWithdrawToken(asset, unit, users[0], address(this), address(safe));

        unchecked {
            _setPool(
                Common.Pool(
                    Common.Addresses(users[0], address(0), asset),
                    Common.LowInt(0, quorum, colCoverage, uint(durationInHours) * 1 hours, Common.Status.TAKEN, router, Common.Stage.JOIN),
                    Common.BigInt(unit, unit, _generateRecordId(), _getUnitId(false)),
                    uint256(unit * uint(quorum)).computeInterestsBasedOnDuration(intRate, uint24(durationInHours))
                ),
                unit,
                Common.Branch.CURRENT
            );
        }
        safe.addUp(_getProfile(users[0], unit), _getUnitId(true));
        for(uint i = 0; i < users.length; i++) {
            bool isAdmin = users[i] == users[0];
            _updateContributor(users[i], unit, isAdmin, isAdmin? true : false, true);
        }
        _createAnalytics(unit, 0, true, router == Common.Router.PERMISSIONLESS, true, false);
        emit PoolCreated(_getPool(unit, Common.Branch.CURRENT));
    }
    
}