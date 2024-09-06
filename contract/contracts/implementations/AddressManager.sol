// // SPDX-License-Identifier: MIT

// pragma solidity 0.8.24;

// import { IOwnable } from "../apis/IOwnable.sol";
// import { IAddressManager } from "../apis/IAddressManager.sol";

// contract AddressManager is IAddressManager { 

//     /**
//      * @notice Versions of ownershipManager contact
//     */
//     address[] private ownershipManagers;
    
//     /**
//      * @notice Versions of Factory contact
//     */
//     address[] private factories;
   
//     /**
//      * @notice Versions of Strategy contact
//     */
//     address[] private strategies;

//     /**
//      * @notice Versions of Strategy Manager contact
//     */
//     address[] private strategyManagers;
    
//     /**
//      * @notice Versions of Token contact
//     */
//     address[] private tokens;
    
//     /**
//      * @notice Versions of AssetManager contact
//     */
//     address[] private assetManagers;
    
//     /**
//      * @notice Versions of Fee receivers
//      * This could be an EOA or a multisig account.
//     */
//     address[] private feeReceivers;

//     modifier validateTag(uint8 tag) {
//         require(tag < 8, "invalidTag");
//         _; 
//     }
//     constructor() {

//     }

//     function getAddress(

//     )
//         external
//         view
//         returns(address)
//     {

//     }

//     function setAddress(
//         address[] memory addrs,
//         uint8 tag
//     )
//         public 
//     {

//     }

// }