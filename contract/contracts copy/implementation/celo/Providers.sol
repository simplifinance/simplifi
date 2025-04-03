// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { IFactory, Common } from "../../apis/IFactory.sol";
import { ERC20Manager, IERC20 } from "../../peripherals/ERC20Manager.sol";
import { MinimumLiquidity, IRoleBase, ErrorLib } from "../../peripherals/MinimumLiquidity.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Providers is ERC20Manager, MinimumLiquidity, ReentrancyGuard {
    using ErrorLib for string;
    event LiquidityProvided(Common.Provider);
    event LiquidityRemoved(Common.Provider);
    event Borrowed(Common.Provider[] memory provs, address borrower);

    // Flexpool factory contract
    IFactory public immutable flexpoolFactory;

    // List of providers
    Common.Providers[] private providers;

    /**
     * @dev Mapping of providers to their position in the providers list
     * @notice Slot '0' is reserved
     */
    mapping (address provider => uint id) public slots;

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
        address _assetManager
    ) 
        ERC20Manager(_assetManager, _baseAsset) 
        MinimumLiquidity(_roleManager)
    {
        if(address(_flexpoolFactory) == address(0)) '_flexpoolFactory is zero'._throw();
        providers.push();
        flexpoolFactory = _flexpoolFactory;
    }

    /**
    * @dev Utility for provide liquidity
    * @notice User must approve this contract with the liquidiy amount prior to this call.
    *       We choose a base value (numerator as 10000) repesenting a 100% of input value. This means if Alice wish to set 
    *       her interest rate to 0.05% for instance, she only need to multiply it by 100 i.e 0.05 * 100 = 5. Her input will be 5. 
    *       Since Solidity do not accept decimals as input, in our context, the minimum value to parse is '0' indicating 
    *       zero interest rate. If user wish to set interest at least, the minimum value will be 1 reprensenting 0.01%.
    *       The minimum interest rate to set is 0.01% if interest must be set at least.
    *       To reiterate, raw interest must be multiplied by 100 before giving as input. 
    */
    function provideLiquidity(uint16 rate) public returns(bool) {
        if(rate >= type(uint16).max) "Invalid rate"._throw();
        (Common.Provider memory prov, uint slot, address caller) = _getProvider();
        bool isExistProvider = slot > 0;
        uint liquidity = _checkAndWithdrawAllowance(baseAsset, caller, address(this), minimumLiquidity);
        unchecked {
            if(!isExistProvider){
                slot = providers.length;
                slots[caller] = slot;
                providers.push(Common.Provider( slot, prov.amount + liquidity, rate, 0, caller));
            } else {
                prov = providers[slot];
                providers[slot].amount = prov.amount + liquidity;
            }
        }

        emit LiquidityProvided(providers[slot]);
        return true;
    }

    /**
     * @dev Remove liquidity.
     * @notice Liquidity can be removed anytime provided the balance exceeds zero
     */
    function removeLiquidity() public nonReentrant returns(bool) {
        (Common.Provider memory prov, uint slot, address caller) = _getProvider();
        if(prov.amount == 0) "Nothing to remove"._throw();
        providers[slot].amount = 0;
        _setApprovalFor(baseAsset, caller, prov.amount);
        prov.amount = 0;
        emit LiquidityRemoved(prov);
    }

    /**
     * @dev Users can borrow from liquidity providers to finance a Flexpool
     * @param providersSlots : Selected providers' slots are required 
     * @param amount : Amount user wish to borrow.
     */
    function borrow(uint[] memory providersSlots, uint amount) public returns(bool) {
        if(providersSlots.length == 0) 'List is empty'._throw();
        if(amount == 0) 'Loan amt is 0'._throw();
        Common.Provider[] memory provs = _aggregateLiquidityFromProviders(providersSlots, amount); 
        if(!IFactory(flexpoolFactory).joinViaProvider(provs, _msgSender(), amount)) 'Factory erroed'._throw();

        emit Borrowed(provs, _msgSender());
    }

    /**
     * @dev Loop through the selected providers balances, and check if there is enough balances
     * to accommodate the requested loan, otherwise operation fails.
     * @param providersSlot : Array of selected providers slots
     * @param amount : Requested loan amount
     */
    function _aggregateLiquidityFromProviders(
        uint[] memory providersSlots, 
        uint amount
    ) 
        internal 
        view 
        returns(Common.Provider[] memory provs)
    {
        uint amountLeft = amount;
        for(uint i = 0; i < providersSlots.length; i++) {
            uint slot = providersSlots[i];
            Common.Provider memory prov = providers[slot];
            if(slot > 0) {
                unchecked {
                    if(prov.amount >= amountLeft) {
                        providers[slot].amount = lprov.amount - amountLeft;
                        amountLeft = 0;
                        break;
                    } else {
                        amountLeft -= prov.amount;
                        providers[slot].amount = 0;
                    }
                }
            }
            uint snapshotBal = providers[slot].amount;
            prov.amount -= snapshotBal; // Record actual amount the provider lends to the borrower
            provs[i] = prov;
        }
        if(amountLeft > 0) 'Loan exceed aggregate providers bal'._throw();
    }

    // ReadOnly function. Return provider's information. 
    function _getProvider() 
        internal 
        view 
        returns(Common.Provider memory prov, uint slot, address caller) 
    {
        caller = _msgSender();
        slot = slots[caller];
        prov = providers[slot];
    }

    // Returns providers in storage.
    function getProviders() public view returns(Common.Providers[] memory) {
        return providers;
    }
}