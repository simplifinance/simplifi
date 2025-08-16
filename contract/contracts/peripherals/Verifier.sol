// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { SelfVerificationRoot } from "../abstract/SelfVerificationRoot.sol";
import { ISelfVerificationRoot } from "../interfaces/self/ISelfVerificationRoot.sol";
import { AttestationId } from "../constants/AttestationId.sol";
import { IERC20, SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IVerifier } from "../interfaces/IVerifier.sol";

contract Verifier is IVerifier, SelfVerificationRoot, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum Type { UNCLAIM, CLAIMED }

    // Errors
    error NativeClaimUnsuccessful();

    // Events
    event UserIdentifierVerified(address indexed registeredUserIdentifier);

    /// @notice Verification config ID for identity verification
    bytes32 public configId;

    ///@notice When this flag is turned off, user will need no verification to claim reward
    bool public isWalletVerificationRequired; // default is true in the constructor, meaning user must verify before claiming

    /// @dev User's registered claim. We use this to prevent users from trying to verify twice
    mapping(address => bool) internal verification;

    // Blacklist
    // mapping(address => bool) internal blacklisted;

    modifier whenWalletRequired() {
        require(isWalletVerificationRequired, "Wallet verification required");
        _;
    }

    /**
     * @dev Constructor
     * @param identityVerificationHubAddress : Hub verification address
     * @notice We set the scope to zero value hoping to set the real value immediately after deployment. This saves 
     * us the headache of generating the contract address ahead of time 
     */
    constructor(address identityVerificationHubAddress)
        Ownable(_msgSender())
        SelfVerificationRoot(identityVerificationHubAddress, 0)
    {
        isWalletVerificationRequired = true; 
    }

    // receive() external payable {}

    function getConfigId(
        bytes32 destinationChainId,
        bytes32 userIdentifier, 
        bytes memory userDefinedData // Custom data from the qr code configuration
    ) public view override returns (bytes32) {
        // Return your app's configuration ID
        return configId;
    }

    // /**@dev Return user's verification status
    //     * @param user : User's account
    //  */
    // function getVerificationStatus(address user) public view returns(bool _verification) {
    //     return verification[user];
    // }

    // Set verification config ID
    function setConfigId(bytes32 _configId) external onlyOwner {
        configId = _configId;
    }

    /**
     * @notice Updates the scope used for verification.
     * @dev Only callable by the contract owner.
     * @param newScope The new scope to set.
     */
    function setScope(uint256 newScope) external onlyOwner {
        _setScope(newScope);
    }
    
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
    function setVerification(address user) external whenWalletRequired onlyOwner returns(bool) {
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
        bytes memory userData 
    ) internal override {
        address user = address(uint160(output.userIdentifier));
        require(output.userIdentifier > 0, "InvalidUserIdentifier");
        require(output.olderThan >= 16, "You should be at least 16 yrs");
        bool[3] memory ofacs = output.ofac;
        for(uint8 i = 0; i < ofacs.length; i++) {
            require(ofacs[i], "Sanction individual");
        }
 
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
