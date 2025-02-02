// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { OnlyOwner } from "../../abstracts/OnlyOwner.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { Lib } from "../../libraries/Lib.sol";
import { SafeERC20 } from "./SafeERC20.sol";
import { IERC20 } from "../../apis/IERC20.sol";

/**
 * @title InitialTokenReceiver
 * @dev Total supply is minted to this contract and is controlled by a set of addresses
 *  acting as multisig addresses. 
 * To transfer any amount of token out of this contract, the following steps
 * must be peformed:
 * 
 * - INITIATE TRXN: A request to transfer an amount must be made. An event is emitted 
 *      to extract the request Id. Request IDs are unique to another.
 * 
 * - SIGN TRXN: The predefined signers addresses will have to sign the transaction with 
 *      the given request Id. The number of signers needed to validate execution must match 
 *      `quorum` declared as state variable.
 * 
 * - EXECUTE TRXN: Transactions can only be executed if the delay period has passed and are 
 *      are already signed.
 * 
 * Same functionalities can be used to add and remove a new signer, and change quorum. 
 */
contract TokenDistributor is 
    OnlyOwner,
    ReentrancyGuard
{
    using Lib for *;
    using SafeERC20 for IERC20;

    error Pending();
    error AlreadySigned();
    error InvalidRequestId(uint);
    error InsufficientBalance(uint256);

    event Requested(uint reqId, address from);
    event Signer(uint reqId, address from);

    enum Status {NONE, INITIATED, PENDING, EXECUTED}

    /**
     * @notice Transaction type
     * Transaction can be ERC20 or Native.
     * By default, they're ERC20 type.
     * We also use other type from 2 and above to denote the 
     * type of transaction that can be performed by the owner account
     */
    enum Type {ERC20, NATIVE, ADDSIGNER, REMOVESIGNER, SETQUORUM}

    /**
     * @notice Number of signers require to execute a transfer
     */
    uint public quorum;

    /**
     * @dev Unique order ID mapped to each transfer request.
     * Note: Two requests can not have same order ID. 
     */
    uint private requestIDs;

    /**
     * @notice Delay timer.
     * Transfers are executed after the expiration of this period.
     */
    uint public delay;

    struct Request {
        uint256 amount;
        address recipient;
        uint delay;
        address[] executors;
        Status status;
        Type txType;
    }

    address[] private executors;

    /**
     * @dev Transfer orders.
     * Mapping of Ids to Request
     * Note: We assigned slot `0` to add and remove signer.
     * i.e requests[0].
     */
    mapping (uint => Request) private requests;

    /**
     * @dev Signers
     * Mapping of address to bool
     */
    mapping (address => bool) private signers;

    /**
     * @dev Signed requests
     * Mapping of signer to request id to bool
     */
    mapping (address => mapping (uint => bool)) private signed;

    // ERC20 basic token contract held by this contract
    IERC20 public token;

    /**
     * @dev Only signers are allowed
     */
    modifier onlySigner {
        require(signers[_msgSender()], "Not a signer");
        _;
    }

    /**
     * @dev Request Id must not be zero
     * @param reqId : Request Id
     */
    modifier validateRequestId(uint reqId) {
        if(reqId == 0) revert InvalidRequestId(reqId);
        _;
    }

    /**
     * @dev Only when not signed.
     * @param reqId : Request Id
     */
    modifier whenNotSign(uint reqId) {
        address caller = _msgSender();
        if(signed[caller][reqId]) revert AlreadySigned();
        _;
        signed[caller][reqId] = true;
    }

    constructor(
        address _ownershipManager,
        address[] memory _signers, 
        uint8 _quorum
    ) 
        OnlyOwner(_ownershipManager) 
    {
        uint size = _signers.length;
        quorum = _quorum;
        if(size > 0) {
            for (uint i = 0; i < size; i++) {
                _addSigner(_signers[i]);
            }
        }
    }

    receive() external payable {}

    function setToken(IERC20 newToken) 
        public 
        onlyOwner
    {
        address(newToken).cannotBeEmptyAddress();
        token = newToken;
    }

    /**
     * @dev Generate request Id
     * Request Id is generated for all transaction type
     */
    function _generateRequestId() private returns(uint id) {
        requestIDs ++;
        id = requestIDs;
        // id = _type < 2? requestIDs : 0;
    }
    
    /**
     * @dev Check that current request's staus correspond
     * @param _req : Request struct.
     * @param _status : Status to match with.
     * @param errorMessage : Error message.
     */
    function _whenStatus(Request memory _req, Status _status, string memory errorMessage) internal pure {
        require(_req.status == _status, errorMessage);
    }

    /**@dev Initiate transaction. 
        This function can be invoked only by the authorized accounts
        as signers.
        The `_type` parameter is used to select the type of transaction 
        the caller want to perform - a more reason we restrict the `_type` 
        input to number between 0 and 5 otherwise we get out of bound error
        since enums work similar to arrays.
        @param _recipient :     An address to act as the beneficiary of this 
                                transaction.
        @param _amount:         Amount to send as value (in token).
        @param _delayInHours:   If this flag is set to value greater than 0,
                                execution of the proposed transaction will not succeed unless the 
                                delay time has passed.
        @param  _type:  The type of transaction to perform. Transction could be any of the following
                        as set in the `Type` enum:
                        ERC20 (0): Transfer ERC20 token.
                        NATIVE (1): Transfer network asset such as ETH.
                        ADDSIGNER (2): Add more signers to the list.
                        REMOVESIGNER (3): Deactivate the `_recipient` address from as a signers. 
                        SETQUORUM (4): Increase or decrease the number of signatories needed to execute a transaction.
        Note: By default, the caller is deemed to have signed the transaction.
     */
    function initiateTransaction(
        address _recipient,
        uint256 _amount,
        uint16 _delayInHours,
        uint8 _type
    ) public onlySigner {
        require(_type < 5, "Invalid selector");
        uint reqId = _generateRequestId();
        if(_type < 4) {
            require(_recipient != address(0), "Recipient is zero addr");
        }
        requests[reqId].amount = _amount;
        requests[reqId].recipient = _recipient;
        requests[reqId].status = Status.INITIATED;
        requests[reqId].txType = Type(_type);
        unchecked {
            requests[reqId].delay = _now() + (_delayInHours * 1 hours);
            
        }
        address caller = _msgSender();
        requests[reqId].executors.push(caller);
        signed[caller][reqId] = true;

        emit Requested(reqId, caller);
    }

    function _now() internal view returns(uint64) {
        return uint64(block.timestamp);
    }

    /**
     * @dev Sign transactions
     * @param reqId : Request Id.
     * Note: Caller must be one of the signers
     */
    function signTransaction(uint reqId) 
        public 
        onlySigner
        validateRequestId(reqId)
        whenNotSign(reqId)
    {
        Request memory req = requests[reqId];
        _whenStatus(req, Status.INITIATED, "Trxn must be initiated");
        uint currentSigners = req.executors.length;
        require(currentSigners < quorum, "Signers complete");
        address caller = _msgSender();
        requests[reqId].executors.push(caller);
        signed[caller][reqId] = true;
        if((currentSigners + 1) == quorum) {
            requests[reqId].status = Status.PENDING;
        }
    }

    /**
     * @dev Executes pending transaction.
     * @param reqId : Request Id
     * Transaction must be pending in status. When moved to executed, 
     * they have no way to be restored.
     * Only signer accounts can call.
     */
    function executeTransaction(uint reqId) public onlySigner validateRequestId(reqId) nonReentrant {
        Request memory req = requests[reqId];
        _whenStatus(req, Status.PENDING, "Trxn must be initiated");
        if(_now() < req.delay) revert Pending();
        requests[reqId].status = Status.EXECUTED;
        if(req.txType == Type.ERC20) {
            address(token).cannotBeEmptyAddress();
            token.safeTransfer(req.recipient, req.amount);
        } else if(req.txType == Type.NATIVE) {
            uint256 balance = address(this).balance;
            if(balance < req.amount) revert InsufficientBalance(balance);
            (bool success,) = req.recipient.call{value: req.amount}("");
            require(success,"Trxn failed");
        } else if(req.txType == Type.ADDSIGNER) {
            req = requests[reqId];
            delete requests[reqId];
            _addSigner(req.recipient);
        } else if(req.txType == Type.REMOVESIGNER) {
            req = requests[reqId];
            delete requests[reqId];
            _removeSigner(req.recipient);
        } else if(req.txType == Type.SETQUORUM) {
            quorum = req.amount;
        }

    }
    
    /**
     * @dev Remove a signer from the list
     */
    function _removeSigner(address account) private {
        signers[account] = false;
    }

    /**
     * @dev Add a signer to the list
     */
    function _addSigner(address account) private {
        signers[account] = true;
        executors.push(account);
    }

    /**
        @dev Return request struct at the reqId ref.
     */
    function getTransactionRequest(uint reqId) public view returns(Request memory req) {
        return requests[reqId];
    }

    function deposit() public payable {
        require(msg.value > 0, "000/");
    }

    function getExecutors() public view returns(address[] memory) {
        return executors;
    }

}
