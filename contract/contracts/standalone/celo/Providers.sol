// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { IFactory, Common } from "../../apis/IFactory.sol";
import { MinimumLiquidity, IRoleBase, ErrorLib, IERC20, ISupportedAsset, ISafeFactory } from "../../peripherals/MinimumLiquidity.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Providers
 * @author Simplifi (Bobeu)
 * @notice Deployable Providers contract is a general liquidity pool purposely for funding Flexpools.
 * Contributors that cannot afford unit contributions can access providers pool to source for funds. 
 * Loans accessed in this pool are not withdrawable by the borrower. Since there is a direct relationship
 * between the Providers contract and the Flexpool's, borrowed funds are moved straight to the Flexpool contract
 * and registered on behalf of the contributor.
 * With this contract, you can perform the following actions:
 * - Provider liquidity.
 * - Remove liquidity
 * - Borrow to finance Flexpool
 * - Get the list of providers
 */
contract Providers is MinimumLiquidity, ReentrancyGuard {
    using ErrorLib for *;
    event LiquidityProvided(Common.Provider);
    event LiquidityRemoved(Common.Provider);
    event Borrowed(Common.Provider[] providers, address borrower);

    struct Data { 
        uint id;
        bool hasIndex;
    }

    // Flexpool factory contract
    IFactory public immutable flexpoolFactory;

    // List of providers
    Common.Provider[] private providers;

    /**
     * @dev Mapping of providers to their position in the providers list
     * @notice Slot '0' is reserved
     */
    mapping (address provider => Data) public slots;

    /**
     * ============= Constructor ================
     * @param _roleManager : RoleBase manager contract.
     * @param _baseAsset : Base asset to use for contribution e.g cUSD.
     * @param _assetManager : Asset Manager contract.
     * @notice At construction, we initialized the providers array slot 0 with an empty provider data.
     * This is so we can reuse the slot in the future such as reseting a provider's data or ensuring 
     * that providers with zero index are restricted from calling certain functions.
     */
    constructor(
        IFactory _flexpoolFactory,
        IRoleBase _roleManager, 
        IERC20 _baseAsset,
        ISupportedAsset _assetManager,
        ISafeFactory _safeFactory
    )
        MinimumLiquidity(_assetManager, _baseAsset, _roleManager, _safeFactory)
    {
        if(address(_flexpoolFactory) == address(0)) '_flexpoolFactory is zero'._throw();
        flexpoolFactory = _flexpoolFactory;
    }

    /**
    * @dev Utility for provide liquidity
    * @notice User must approve this contract with the liquidiy amount prior to this call.
    * @param rate: Interest rate the provider is willing to charge.      
    *   We choose a base value (numerator as 10000) repesenting a 100% of input value. This means if Alice wish to set 
    *   her interest rate to 0.05% for instance, she only need to multiply it by 100 i.e 0.05 * 100 = 5. Her input will be 5. 
    *   Since Solidity do not accept decimals as input, in our context, the minimum value to parse is '0' indicating 
    *   zero interest rate. If user wish to set interest at least, the minimum value will be 1 reprensenting 0.01%.
    *   The minimum interest rate to set is 0.01% if interest must be set at least.
    *   To reiterate, raw interest must be multiplied by 100 before giving as input. 
    */
    function provideLiquidity(uint16 rate) public whenNotPaused returns(bool) {
        if(rate >= type(uint16).max) "Invalid rate"._throw();
        address sender = _msgSender();
        Data memory data = slots[sender];
        Common.Interest memory interest;
        uint liquidity = _checkAndWithdrawAllowance(baseAsset, sender, address(this), minimumLiquidity);
        unchecked {
            if(!data.hasIndex){
                data.id = providers.length;
                data.hasIndex = true;
                slots[sender] = data;
                providers.push(Common.Provider(data.id, liquidity, rate, 0, sender, interest));
            } else {
                providers[data.id].amount += liquidity;
            }
        }

        emit LiquidityProvided(providers[data.id]);
        return true;
    }

    /**
     * @dev Remove liquidity.
     * @notice Liquidity can be removed anytime provided the balance exceeds zero
     */
    function removeLiquidity() public whenNotPaused nonReentrant returns(bool) {
        (Common.Provider memory prov, uint slot, address caller) = _getProvider();
        if(prov.amount == 0) "Nothing to remove"._throw();
        providers[slot].amount = 0;
        _setApprovalFor(baseAsset, caller, prov.amount);

        emit LiquidityRemoved(prov);
        return true;
    }

    /**
     * @dev Users can borrow from liquidity providers to finance a Flexpool
     * @param providersSlots : Selected providers' slots are required 
     * @param amount : Amount user wish to borrow.
     */
    function borrow(uint[] memory providersSlots, uint amount) public whenNotPaused returns(bool) {
        if(providersSlots.length == 0) 'List is empty'._throw();
        if(amount == 0) 'Loan amt is 0'._throw();
        Common.Provider[] memory provs = _aggregateLiquidityFromProviders(providersSlots, amount); 
        address spender = address(flexpoolFactory);
        _setApprovalFor(baseAsset, spender, amount);
        if(!IFactory(spender).contributeThroughProvider(provs, _msgSender(), amount)) 'Factory erroed'._throw();

        emit Borrowed(provs, _msgSender());
        return true;
    }

    /**
     * @dev Loop through the selected providers balances, and check if there is enough balances
     * to accommodate the requested loan, otherwise operation fails.
     * @param providersSlots : Array of selected providers slots
     * @param amount : Requested loan amount
     * Return a list of providers that financed the contribution
     */
    function _aggregateLiquidityFromProviders(
        uint[] memory providersSlots, 
        uint amount
    ) 
        internal 
        returns(Common.Provider[] memory result)
    {
        uint amountLeft = amount;
        uint providersSize = providersSlots.length;
        Common.Provider[] memory _providers = new Common.Provider[](providersSize);
        for(uint i = 0; i < providersSize; i++) {
            uint slot = providersSlots[i];
            if(slot >= providers.length) 'Invalid slot detected'._throw();
            Common.Provider memory prov = providers[slot];
            unchecked {
                if(prov.amount >= amountLeft) {
                    providers[slot].amount = prov.amount - amountLeft; 
                    amountLeft = 0;
                } else {
                    amountLeft -= prov.amount; 
                    providers[slot].amount = 0;
                }
            }

            uint snapshotBal = providers[slot].amount;
            prov.amount -= snapshotBal; // Record actual amount the provider lends to the borrower
            _providers[i] = prov;
            if(amountLeft == 0) break;
        }
        if(amountLeft > 0) 'Loan exceed aggregate providers bal'._throw();
        result = _providers;
    }

    // ReadOnly function. Return provider's information. 
    function _getProvider() 
        internal 
        view 
        returns(Common.Provider memory prov, uint slot, address caller) 
    {
        caller = _msgSender();
        Data memory data = slots[caller];
        if(!data.hasIndex) 'User is not a provider'._throw();
        slot = data.id;
        prov = providers[slot];
    }

    // Returns providers in storage.
    function getProviders() public view returns(Common.Provider[] memory prov) {
        prov = providers;
        return prov;
    }
}