// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol"; 
import { Address } from "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title Agent contract - Non-deployable
 * @author : Simplifi. Written by Isaac Jesse, a.k.a Bobeu https://github.com/bobeu
 * @notice : Agent storage and retrieval contract. Agent can interact with Simplifi contracts on behalf of the users.
 *          - Calling account should be an approved agent if user selected to use an AiAssist method.
 */
abstract contract Agent is Ownable {
    error InvalidAgentAddress();
    error AgentAddressIsTheSame();

    // Approved agent address
    address public approvedAgent;

    // Platform fee
    uint public makerRate;

    // Only agent is allowed
    modifier onlyApprovedAgent {
        if(_msgSender() != approvedAgent) revert InvalidAgentAddress();
        _;
    }

    constructor(address controller, address newAgent) Ownable(controller){
        _setAgent(newAgent);
    }

    /**
     * @dev Update agent address
     * @param newAgent : New agent address
     */
    function _setAgent(address newAgent) internal {
        if(newAgent == address(0)) revert InvalidAgentAddress();
        if(newAgent == approvedAgent) revert AgentAddressIsTheSame();
        approvedAgent = newAgent;
    }

    /**
     * @dev Update agent address
     * @param newAgent : New agent address
     */
    function replaceAgent(address newAgent) public onlyOwner {
        _setAgent(newAgent);
    }

    /**
     * @dev Adjust fee
     * @param newRate : New fee
     */
    function setFee(uint16 newRate) public onlyOwner {
        makerRate = newRate;
    }
}