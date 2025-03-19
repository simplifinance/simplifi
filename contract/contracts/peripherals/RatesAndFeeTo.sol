// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { OnlyOwner } from "../abstracts/OnlyOwner.sol";

abstract contract RatesAndFeeTo is OnlyOwner {
    // Platform fee
    uint public makerRate;

    // Address to receive fee
    address public feeTo;

    constructor (
        address _ownershipManager,
        uint16 _makerRate,
        address _feeTo
    ) OnlyOwner(_ownershipManager) 
    {
        _setMakerRate(_makerRate);
        _setFeeTo(_feeTo);
    }

    /**
     * @dev Sets new rate
     * @param newRate : New rate
     */
    function _setMakerRate(uint16 newRate) internal {
        makerRate = newRate;
    }
    
    /**
     * @dev Sets new fee receiver
     * @param newFeeTo : New fee receiver
     */
    function _setFeeTo(address newFeeTo) internal {
        feeTo = newFeeTo;
    }
    
    /**
        * @dev Set platform fee percent
        * @param newRate : New rate
    */
    function setMakerRate(uint16 newRate) public onlyOwner {
       _setMakerRate(newRate);
    }

    /**
     * @dev Sets new fee receiver
     * @param newFeeTo : New fee receiver
     */
    function setFeeTo(address newFeeTo) public onlyOwner {
        _setFeeTo(newFeeTo);
    }

}