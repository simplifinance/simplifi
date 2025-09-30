// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IVerifier } from "../interfaces/IVerifier.sol";
import { SelfVerificationRoot } from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import { ISelfVerificationRoot } from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import { SelfStructs } from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import { IIdentityVerificationHubV2 } from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";
import { SelfUtils } from "@selfxyz/contracts/contracts/libraries/SelfUtils.sol";

contract Verifier is IVerifier, SelfVerificationRoot, Ownable {
    // Events
    event UserIdentifierVerified(address indexed registeredUserIdentifier);

    /// @notice Verification config ID for identity verification
    // bytes32 public configId;

    ///@notice When this flag is turned off, user will need no verification to claim reward
    bool public isWalletVerificationRequired; // default is true in the constructor, meaning user must verify before claiming

    SelfStructs.VerificationConfigV2 public verificationConfig;

    bytes32 public verificationConfigId;

    /// @dev User's registered claim. We use this to prevent users from trying to verify twice
    mapping(address => bool) internal verification;

    modifier whenWalletRequired() {
        require(isWalletVerificationRequired, "Wallet verification required");
        _;
    }

    /**
     * @dev Constructor
     * @notice We set the scope to zero value hoping to set the real value immediately after deployment. This saves 
     * us the headache of generating the contract address ahead of time 
     */
    constructor(
        address hubV2, 
        string memory scopeSeed,
        bool ofacEnabled,
        uint8 olderThan,
        string[] memory forbiddenCountries
    )
        Ownable(_msgSender())
        SelfVerificationRoot(hubV2, scopeSeed)
    {
        isWalletVerificationRequired = true; 
        verificationConfig = SelfUtils.formatVerificationConfigV2(
            _generateRawVerificationConfig(
                olderThan,
                forbiddenCountries,
                ofacEnabled
            )
        );
        verificationConfigId = IIdentityVerificationHubV2(hubV2).setVerificationConfigV2(verificationConfig);
    }

    // receive() external payable {}

    function getConfigId(
        bytes32 /**unused-param */,
        bytes32 /**unused-param */, 
        bytes memory /**unused-param */
    ) public view override returns (bytes32) {
        // Return your app's configuration ID
        return verificationConfigId;
    }

    function _generateRawVerificationConfig(
        uint8 olderThan,
        string[] memory forbiddenCountries,
        bool ofacEnabled
    ) internal pure returns(SelfUtils.UnformattedVerificationConfigV2 memory rawConfig) {
        // string[] memory forbiddenCountries = new string[](4);
        // forbiddenCountries[0] = CountryCodes.UNITED_STATES;
        rawConfig = SelfUtils.UnformattedVerificationConfigV2({
            olderThan: olderThan,
            forbiddenCountries: forbiddenCountries,
            ofacEnabled: ofacEnabled
        });
    }

    // // Set verification config ID
    // function setConfigId(bytes32 _configId) external onlyOwner returns(bool) {
    //     configId = _configId;
    //     return true;
    // }

    // /**
    //  * @notice Updates the scope used for verification.
    //  * @dev Only callable by the contract owner.
    //  * @param newScope The new scope to set.
    //  */
    // function setScope(uint256 newScope) external onlyOwner returns(bool) {
    //     _setScope(newScope);
    //     return true;
    // }
    
    /**
     * @dev Verify and register users for unclaim rewards. 
     * @param user : User account
     * @notice This is expected to be the data parse as userData to the verification hook. To prevent attack,
     * user cannot make eligibity check twice in the same week. 
     * Note: User cannot verify eligibility for a week twice.
    */
    function _setVerification(address user) internal {
        require(user != address(0), "Zero address");
        require(!verification[user], "Already verified");
        verification[user] = true;
    }

    /**
     * @dev Registers user for the claim. 
     * @notice This is expected to be the data parse as userData to the verification hook. To prevent attack,
     * user cannot make eligibity check twice in the same week.
     * @notice Should be called by anyone provided they subscribed to the campaign already
     */
    function setVerification() external whenWalletRequired returns(bool) {
        _setVerification(_msgSender());
        return true;
    }
 
    /**
     * @dev Manually registers user for the claim. 
     * @notice This is expected to be the data parse as userData to the verification hook. To prevent attack,
     * user cannot make eligibity check twice in the same week.
     * @notice Should be called only by the approved account provided the parsed user had subscribed to the campaign already.
     * Must not be using Self verification.
     */
    function setVerificationByOwner(address user) external whenWalletRequired onlyOwner returns(bool) {
        _setVerification(user);
        return true;
    }
 
    /**
     * @notice Hook called after successful verification - handles user registration
     * @dev Validates registration conditions and registers the user for both E-Passport and EUID attestations
     * @param output The verification output containing user data
    */
    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory /** unused-param */ 
    ) internal override {
        address user = address(uint160(output.userIdentifier));
        require(output.userIdentifier > 0, "InvalidUserIdentifier");
        _setVerification(user);

        emit UserIdentifierVerified(user);
    }

    /**
     * @dev Update the isWalletVerificationRequired = true; flag
     */
    function toggleUseWalletVerification() public onlyOwner {
       isWalletVerificationRequired = !isWalletVerificationRequired;
    }

    /**@dev Get user status
        @param user: Target user
     */
    function isVerified(address user) external view returns(bool) {
        return verification[user];
    }

}
