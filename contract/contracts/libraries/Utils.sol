  // SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { SafeMath } from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import { IERC20Metadata } from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import { Address } from "@openzeppelin/contracts/utils/Address.sol";
import { Common } from "../apis/Common.sol";
import { ISmartAccount } from "../apis/ISmartAccount.sol";

library Utils {
    using Address for address;
    using SafeMath for uint256;

    error InsufficientCollateral(uint256 actual, uint256 expected);

    error InvalidDenominator(string memory);

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

    /**Calculate the % over the principal amount such as makerRate
        for instance, if:
        makerRate = 1020, 

        Note: We restrict denominator to 4 figure i.e max is 9999 (denom/).
        This enables us peg the numerator to 1000 (/num),
        where a 100% of @param value : will always be 2000.
        Ex:
        Passing 1000 as the denominator is 0%.
        1500 = 50%.

        The computation will always preserve the result in the original decimals or 
        denomination of the value i.e if value is 5000 in 9 decimals, and denomator
        is 1500 which is 50%, result will be calculated as :
        result = ((5000000000000 * 1500) / 1000) - 5000000000000
        result = 2500000000000

    */
    function mulDivOp(uint256 value, uint16 denominator) internal pure returns (uint _return) {
        uint16 numerator = 1000; 
        if(denominator >= 10000) revert InvalidDenominator("Denominator should be less than 10000");
        if(value == 0 || denominator == 0 || denominator == numerator || uint(denominator).mod(numerator) == 0) return 0;
        _return = value.mul(denominator).div(numerator).sub(value);
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
     * @param token : Collaterized asset 
     * @param strategy : Strategy account 
     * @param ccr : Collateral ratio 
     * @param assetPriceInUSDWithDecimals : Asset Price in USD denominated in decimals
     * @param loanRequestInUSDWithDecimals : Total requested contribution in USD
     * 
     * Note: `ccr` should be in 3 figure and greater than type(uint8).max
     */
    function computeCollateral(
        address token,
        address strategy,
        uint ccr,
        uint assetPriceInUSDWithDecimals,
        uint loanRequestInUSDWithDecimals
    ) internal view returns(uint256 expColInToken) {
        require(ccr < 1000, "Utils: CCR should be 3 figure");
        uint priceMantissa = 10**12;
        uint256 actualColInToken = getCollateralBalance(token, strategy);
        uint actualLoan;
        actualLoan = ccr == 0? loanRequestInUSDWithDecimals : ccr.mul(loanRequestInUSDWithDecimals).div(100);
        expColInToken = actualLoan.mul(assetPriceInUSDWithDecimals).div(priceMantissa);
        if(actualColInToken < expColInToken) revert InsufficientCollateral(actualColInToken, expColInToken);
        // assertTrue(actualColInToken >= expColInToken,"Insufficient collaterized token");
    }

    /**
        @dev Computes maker fee.
        @param makerRate : The amount of fee (in %) charged by the platform
            Note : Maker rate must be in denomination of 1000 e.g 1010, 1100 etc.
        See `mulDivOp` above
        Note: @param amount should already be in destination asset denomination.
    */
    function computeFee(uint amount, uint16 makerRate) internal pure returns (uint mFee) {
        mFee = mulDivOp(amount, makerRate);
    }

    function notZeroAddress(address target) internal pure {
        require(target != address(0), "Zero address");
    }

}