export const faqContent = [
    {
        title: <h1>What is FlexPool?</h1>,
        content: <p>FlexPool is a fancy name given to a custom liquidity pool that is operated by an individual. They&apos;re created primarily for the benefits of accessing loans at little or no interest rate pushing the loan boundary beyond limit. It may be permissioned <span className="text-orange-200">(for closed group or peers who are familiar with one another)</span> or permissionless <span className="text-orange-200">(open to anyone)</span>. A worthy exception 
        to creating a permisssionless liquidity pool is that the proposed unit liquidity 
        must not exist. Two FlexPools with the same liquidity value cannot
        simultaneously exist in a Permissionless liquidity pool - PLP . To avoid and reduce the possibility of spamming and unexpected scenarios.
        Example: If a pool of 100 USDT exist, and the epoch is active, a request to operate a flexpool with similar unit amount will not succeed until the 
        existing one is filled up.</p>,
        subparagraph: <ul>
            <li>- FlexPools are designed this way to preserve orderliness, efficiency and 
            moderation while maintaning a healthy competition.</li>
            <li>- There is no limit to the
            number of flexpool an user can operate or participate, in as much as their balances are sufficient enough to cover the operating cost.</li>
            <li>- No user can operate a flexpool with a duration (in
                days) above 255 days.</li>
            <li>- Setting interet rate is at will.</li>
        </ul>
    },
    {
        title: <h1>What Is Unit Liquidity?</h1>,
        content: <p>
            An amount provided by each participant as liquidity or contribution.
        </p>,
        subparagraph: <p ></p>,
    },
    {
        title: <h1>What Is Quorum?</h1>,
        content: <p>
            The maximum mumber of users that can participate in a flexpool. Usually, it is set by the operator. Quorum is a required parameter 
            to launch a new FlexPool. If the type selected by the operator is &apos;permissioned&apos;, the quorum is the length of the list of participating addresses 
            supplied by the operator. Generally, the minimum number of participants in any FlexPool is 2 while the maximum is 255.
        </p>,
        subparagraph: <p></p>,
    },
    {
        title: <h1>What Is Epoch/Cycle?</h1>,
        content: <p>
            An Epoch otherwise called Cycle is the total period/time is took all FlexPool participants to benefit from the liquidity.
            It may however been perceived as the total period is took all the participants to fulfil their turn. 
            <span className="text-orange-200">
                Example: Assume a FlexPool with 3 hours duration, and the quorum is 3, the cycle.epoch will be 9 hours since this will be the
                aggregate time it will take all the participants to benefit from the liquidity contributed.
            </span>
        </p>,
        subparagraph: <p ></p>,
    },
    {
        title: <h1>What Does Duration Mean?</h1>,
        content: <div>
            The length of time that a loan is due for repayment. This period is often short and are specified in hours between 1 and 30 hours. 
            While &apos;Duration&apos; is set for an epoch, users/liquidity beneficiaries may specify their choices when 
            it&apos;s their turn to getFinance. User&apos;s choices are prioritize over the operator&apos;s. If user&apos;s choice is undefined, 
            the contract will fallback to operator&apos;s. The following conditions apply.
            <ul>
                <li>Borrower&apos;s choice must not be exceed that of operator&apos;s.</li>
                <li>Maximum epoch or operator&apos;s duration is currently pegged to 30 days equivalent to &apos;720 hrs&apos;, and may be expanded in the future</li>
            </ul> 
        </div>,
        subparagraph: <p ></p>,
    },
    {
        title: <h1>How To Get Finance</h1>,
        content: <p>
            Getting finance is treated in a first-in-first-out (FIFO) basis. When a 
            user provide liquidity in a FlexPool, they&apos;re assigned a unique slot in 
            a progressive manner. An operator/creator of a FlexPool is usually assigned the first slot but 
            may not be the first to GH due to a range of circumstances that will be discussed in the next section. 
            As a pariticipant, when is its your turn to borrow/getFinance, you only need to hit the &apos;getFinance&apos; button at the right time <strong>(often with 1hr grace period)</strong> 
            otherwise another participant may claim your slot. Slots are claimable when 
            the grace period elapsed.                          
        </p>,
        subparagraph: <p ></p>,
    },
    {
        title: <h1>How Do I Payback</h1>,
        content: <p>
            Payback utility button will become active when users have unpaid loans matched to 
            their profiles. An important step in this process is that user must give approval to the designated contract to spend from their wallet.
        </p>,
        subparagraph: <p ></p>,
    },
    {
        title: <h1>How Do I Withdraw My loan?</h1>,
        content: <div>
            Withdrawal is activate when users send a valid borrow request to 
            a FlexPool. A few conditions must be met before the transaction can pass. 
            <ul>
                <li>- The users must have enough XFI coin in their wallet to provide 
                cover for the given loan based on the operating collateral multiplier.</li>
                <li>User must give enough approval for spending cap.</li>
            </ul>
            
            Payback period is another instance where withdrawal is activated. This time,
            user pay back their loans and the collateral is unlocked. With our smart 
            interface, these steps are covered in a smart contract call.
        </div>,
        subparagraph: <p ></p>,
    },
    {
        title: <h1>What Is Liquidation?</h1>,
        content: <p>
            Liquidation is possible where a participant failed to meet up with the
            loan deadline. When a borrower fails to replenish the pool at the due date,
            they stand the chance of being liquidated by any user of the protocol.
            It can be profitable or otherwise for liquidators since they bear 
            the burdens of repaying the full loan. The full collateral value is also 
            released to the liquidator.
        </p>,
        subparagraph: <p>
            <span className="text-orange-200">NOTE:</span> Liquidation may cause participants in a permissioned pool to forfeit 
            earnings or a part of their liquidity. Losses and profits are spread evenly among the participants where interest is set.
        </p>,
    },
    {
        title: <h1>What Is Collateral ratio/Multiplier</h1>,
        content: <p>
            Collateral factor/coverage is usually determined by the operator of 
            FlexPool at the time of creation. This is the percentage of loan 
            that is secure by discounting the value of XFI. 
        </p>,                                                                         
        subparagraph: <p>
            If a FlexPool has 100 &apos;USDT&apos; as the loan base while collateral factor 
            is 150. If the price of XFI at borrow point is &apos;$0.5 USDT&apos; the required
            collateral in XFI will be calculated as <strong>collateralNeeded = ((100/0.5) * 150) / 100</strong>
        </p>,
    },

]