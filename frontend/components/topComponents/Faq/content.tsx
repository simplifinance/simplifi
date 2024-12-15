export const faqContent = [
    {
        title: <h1>What is FlexPool</h1>,
        content: <p>FlexPool is a fancy name given to a custom liquidity pool being operated by an individual. They're created purposely to raise capital for specific purpose (s). It may be permissioned <span>(for closed group or peers who are familiar with one another)</span> or permissionless <span>(open for anyone to participate)</span>. A worthy exception 
        to creating a permisssionless liquidity pool is that the proposed unit liquidity 
        amount must not already be created. Two FlexPools with same liquidity value cannot
        exist simultaneously otherwise it may resort to spamming and unwanted scenarios.
        If a pool of 100 USDT exist, and the 
        epoch is still active, a pool with the same amount cannot be launched until the 
        existing pool is filled up.</p>,
        subparagraph: <p>
            FlexPools are designed this way to preserve orderliness, efficiency and 
            moderation while maintaning a healthy competition. There is no limit to the
            number of flexpool an user can operate or participate, so long their balances are sufficient enough. You cannot create a band with duration (in
            days) above 255 days. Setting APR below 100 will cause unexpected
            behavior. 100 mean no interest should be charged in this band. 120 means
            to set interest rate to 20% per annum. Same rule for APR applies to
            multiplier (i.e. collateral factor)
        </p>
    },
    {
        title: <h1>Unit Liquidity</h1>,
        content: <p>
            This is the unit liquidity per provider added as a commitment showing proof of 
            willingness to be part of the community.
        </p>,
        subparagraph: <p ></p>,
    },
    {
        title: <h1>Epoch/Cycle</h1>,
        content: <p>
            This is the total period it takes for all participants in
            a FlexPool to have their turn fulfilled i.e getFinance. If a pool is 
            set up with 3 hours duration while the quorum is 3, the full cycle will be 9 hours. 
            This is because it will take at least 9 hours for the pooled fund to fully 
            serve the participants.
        </p>,
        subparagraph: <p ></p>,
    },
    {
        title: <h1>Duration</h1>,
        content: <p>
            The length of time that the loan is due for repayment which determines the 
            length of an epoch. This periods are often short and are specified in hours. 
            While &apos;Duration&apos; is set for an epoch, users may specify their choice when 
            they want to GetFinance, and will be considered first. Borrower's choice 
            must not be greater than the epoch's.  Maximum epoch duration is currently 
            pegged at 30 days equivalent to &apos;720 hrs&apos;, and may be expanded in the future. 
        </p>,
        subparagraph: <p ></p>,
    },
    {
        title: <h1>Get Finance</h1>,
        content: <p>
            Getting finance is treated in a first-in-first-out (FIFO) basis. When a 
            user provide liquidity in a FlexPool, they're assigned a unique slot in 
            a progressive manner. When is its your turn to borrow as a member in a 
            FlexPool, you only need to call at the right time (often with 1hr grace period)
            otherwise another participant may claim your slot. Slots are claimable when 
            the grace period elapsed.                          
        </p>,
        subparagraph: <p ></p>,
    },
    {
        title: <h1>Payback</h1>,
        content: <p>
            Payback utility will be activated when users have unpaid loans matched to 
            their profiles. An amount not lesser than the given loan must be approved
            as spending cap to the Factory contract.
        </p>,
        subparagraph: <p ></p>,
    },
    {
        title: <h1>Withdraw</h1>,
        content: <p>
            Withdrawal is activate when users send a valid borrow request to 
            a FlexPool. A few conditions must be met before the request can be 
            granted. Users must have enough of XFI coin in their wallet to provide 
            cover for the given loan based on the supplied collateral coverage ratio.
            Payback period is another instance where withdrawal is activated. This time,
            user pay back their loans and the collateral is unlocked. With our 
            interface, these steps are covered in one smart contract call.
        </p>,
        subparagraph: <p ></p>,
    },
    {
        title: <h1>Liquidation</h1>,
        content: <p>
            Liquidation is possible after a participant failed to meet up with the
            loan deadline. When a borrower fails to replenish the pool at the due date,
            they stand the chance of being liquidated by anyone users of the protocol.
            Liquidation can be profitable or otherwise for liquidators since they bear 
            the burdens of repaying the full loan. The full collateral value is also 
            passed on to the liquidator.
        </p>,
        subparagraph: <p>
            NOTE: Liquidation may cause participants in a permissioned pool to forfeit 
            earnings or a part of their liquidity. Losses and profits are spread evenly
            the participants.
        </p>,
    },
    {
        title: <h1>Collateral ratio/Multiplier</h1>,
        content: <p>
            Collateral factor/coverage is usually determined by the creator of 
            FlexPool at the point of creation. This is the percentage of loan 
            that is secure by discounted by the value of XFI. 
        </p>,
        subparagraph: <p>
            If a FlexPool has 100 &apos;USDT&apos; as the loan base while collateral factor 
            is 150. If the price of XFI at borrow point is &apos;$0.5 USDT&apos; the required
            collateral in XFI will be calculated as <strong>collateralNeeded = ((100/0.5) * 150) / 100</strong>
        </p>,
    },
    {
        title: <h1>Quorum</h1>,
        content: <p>
            The mumber of participants allowed in a pool. It is explicit 
            and is required when user wants to create a permissionless pool. 
            If permissioned, the quorum is the length of supplied participating 
            addresses. The minimum number of participants in a FlexPool is 2 
            and maximum is 255.
        </p>,
        subparagraph: <p></p>,
    },
]