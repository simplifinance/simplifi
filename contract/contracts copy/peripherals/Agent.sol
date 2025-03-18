// // SPDX-License-Identifier: MIT

// pragma solidity 0.8.24;

// import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol"; 

// abstract contract Agent is Ownable {
//     error InvalidAgentAddress();
//     error AgentAddressIsTheSame();

//     address private agent;

//     // Platform fee
//     uint public makerRate;

//     constructor(address controller, address newAgent) Ownable(controller){
//         agent = newAgent;
//     }

//     function replaceAgent(address newAgent) public onlyOwner {
//         if(newAgent == address(0)) revert InvalidAgentAddress();
//         if(newAgent == agent) revert AgentAddressIsTheSame();
//         agent = newAgent;
//     }

//     /**
//      * @dev Adjust fee
//      * @param newRate : New fee
//      */
//     function setFee(uint16 newRate) public onlyOwner {
//         makerRate = newRate;
//     }
// }