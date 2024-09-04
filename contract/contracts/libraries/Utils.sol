  // SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { SafeMath } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/math/SafeMath.sol";
import { IERC20Metadata } from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import { Address } from "@openzeppelin/contracts/utils/Address.sol";
import { Common } from "../apis/Common.sol";

library Utils {
    using Address for address;
    using SafeMath for uint256;

    error InsufficientCollateral(uint256 actual, uint256 expected);

    error InvalidDenominator(string message);

    ///@dev Requires all conditions to be true 
    function assertTrue_2(bool a, bool b, string memory errorMessage) internal pure {
        require(a && b, errorMessage);
    }

    ///@dev Requires single condition to be true 
    function assertTrue(bool condition, string memory errorMessage) internal pure {
        require(condition, errorMessage);
    }

    ///@dev Requires conditions to be true 
    function assertFalse(bool condition, string memory errorMessage) internal pure {
        require(!condition, errorMessage);
    }

    /**     @dev Calculation of percentage.
        *   This is how we calculate percentage to arrive at expected value with 
        *   100% precision.
        *   We choose a base value (numerator as 10000) repesenting a 100% of input value. This means if Alice wish to set 
        *   her interest rate to 0.05%, she only need to multiply it by 100 i.e 0.05 * 100 = 5. Her input will be 5. 
        *   Since Solidity do not accept decimals as input, in our context, the minimum value to parse is '0' indicating 
        *   zero interest rate. If user wish to set interest at least, the minimum value will be 1 reprensenting 0.01%.
        *   The minimum interest rate to set is 0.01% if interest must be set at least.
        *   @notice To reiterate, user must multiply their interest rate by 100 before giving as input. 
        *   @param value : The principal value on which the interest is based. Value should be in decimals.
        *   @param denom : Interest rate. 
    */
    function getPercentage(uint256 value, uint16 denom) internal pure returns (uint _return) {
        uint16 base = _getBase(); 
        if(denom == 0) return 0;
        _return = value.mul(denom).div(base);
    }

    /**
     * Simplifi protocol percentage base
     */
    function _getBase() internal pure returns(uint16 base) {
        base = 10000;
    }
    
    function _decimals(address asset) internal view returns(uint8 decimals) {
        decimals = IERC20Metadata(asset).decimals();
    }
    /**
     * @dev Fetches collateral balance
     * @param token : token contract
     * @param strategy: strategy contract 
     */
    function getCollateralBalance(address token, address strategy) internal view returns(uint256 bal) {
        bal = IERC20Metadata(token).balanceOf(strategy);
    }

    /**
     * @dev Computes collateral on the requested loan amount
     * @param loanBaseDecimals : Decimals of asset used as contribution. USDT for instance is 18.
     * @param ccr : Collateral ratio. Must be multiply by 100 before parsing as input i.e if raw ccr
     *              is 1.3, it should be rendered as 1.2 * 100 = 120.
     * @param xfiUSDPriceInDecimals : Price of XFI in the right decimal.
     * @param loanReqInDecimals : Total requested contribution in USD
     * @param actualColInXFI : Amount sent in XFI as collateral.
     * @notice Based on Simplifi mvp, loans are collaterized in XFI until we add more pairs
     *         in the future.
     * Example: Alice, Bob and Joe formed a band to contribute $100 each where duration is for 
     * 10 days each. Alice being the admin set ccr to 1.5 equivalent to 150% of the total sum 
     * contribution of $300. If the price of XFI as at the time of GF is $0.5/XFI, where XFI decimals
     * is in 18, we calculate the required XFI to stake as follows:   
     *  
     *                    totalContribution *  (10** XFIdecimals)   |                 raw ccr
     *   totalLoanInXFI = --------------------------------------    |    actualCCR = (1.5 * 100) * 100 = 1500
     *                        (price * XFIdecimals)                n|
     * 
     *                     totalLoanInXFI * actualCCR
     *        XFINeeded = ----------------------------
     *                             _getBase()
     * 
     *  Therefore, Alice is required to stake 900XFI to GF $300 for 10 days.
     *   
     */
    function computeCollateral(
        uint actualColInXFI,
        uint8 loanBaseDecimals,
        uint24 ccr,
        uint xfiUSDPriceInDecimals,
        uint loanReqInDecimals
    ) 
        internal
        pure 
        returns(uint256 expColInXFI) 
    {
        uint8 mantissa = 100;
        if(ccr < mantissa) revert Common.CollateralCoverageCannotGoBelow_100(ccr);
        uint48 _ccr = uint48(uint(ccr).mul(100));
        uint totalLoanInXFI = loanReqInDecimals.mul(10**loanBaseDecimals).div(xfiUSDPriceInDecimals).div(loanBaseDecimals);
        expColInXFI = totalLoanInXFI.mul(_ccr).div(_getBase());
        require(actualColInXFI >= expColInXFI, "Insufficient XFI");
    }

    /**
        @dev Computes maker fee.
        @param makerRate : The amount of fee (in %) charged by the platform
            Note : Raw rate must multiply by 100 to get the expected value i.e
            if maker rate is 0.1%, it should be parsed as 0.1 * 100 = 10.
            See `getPercentage()`.
        @param amount should be in decimals.
    */
    function computeFee(
        uint amount, 
        uint16 makerRate
    ) 
        internal 
        pure 
        returns (uint mFee) 
    {
        mFee = getPercentage(amount, makerRate);
    }

    /**
     * @dev Compute interest based on specified rate.
     * @param rate : Interest rate.
     * @param principal : Total expected contribution.
     * @param durationInHour : Duration of loan. To be specified in hours.
     */
    function computeInterests(
        uint principal,
        uint16 rate,
        uint16 durationInHour
    )
        internal 
        pure 
        returns(Common.InterestReturn memory _itr) 
    {
        _itr.durInSec = durationInHour * 1 hours;
        _itr.fullInterest = getPercentage(principal, rate);
        _itr.intPerSec = _itr.fullInterest.div(_itr.durInSec);
    }

    function notZeroAddress(address target) internal pure {
        require(target != address(0), "Zero address");
    }

}