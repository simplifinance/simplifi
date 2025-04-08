<!-- # Worksheet

A decentralized loan services through peer-funding mechanism.
- Bob opens a Flexpool of $200 unit contribution.
- cUSD is the base contribution.
- He sets quorum to 3 being the expected number of participants. 
- He selects any supported ERC20 token as his supported collateral asset.
- Zero interest rate.
- If Alice wants to join Bob's pool, and has no cUSD to contribute, she can borrow from a general pool and send it as a unit contribution to the factory contract.
- The general pool contract can safely interact with the factory contract.

## General Pools
A several individual pool with borrowable funds. In this type of pool, users single-handedly provide liquidity with customized parameters such as interest rate. - - Liquidity not engaged can be removed at any time.
- Funds are not transferable to any other address.
- Funds are sent to the pool the user wish to contribute to.
- No seperate collateral is needed.
- The collateral provided for getting finance covers this type of loan.
- Disbursements are prioritize from the provider's profile the user selected. 
- Borrowers can select more than one providers. The first on the list is prioritized. If the balance of the first provider cannot cover the loan request, the remainder is treated from the next provider.
- The providers information is registered to the borrower's profile in the specific unit contribution.
- The interest rate is charged to the borrower's account.
- When payback, interest is calculated, and spread among the providers in the borrower's profile.
- Providers earn interest in cUSD


- A borrower cannot appear twice in a pool.

## Using Mento
Assume :
- Bob opens a Flexpool of $200 unit contribution.
- He sets quorum to 3 being the expected number of participants. 
- He selected Mento USD as the collateral asset. Note: that Mento USD is a synthetic asset with 5% minting power for instance. Hence, to mint a 100 USD, user will have to pay a minting fee of $5.
- He input collateral index as 120 i.e 1.2 * totalLoanableAmount. E.g If total loanable is $600, users will deposit collateral as 1.2 * 600 = $720 Mento USD.
- To get $720 Mento USD, user will pay $36 Mento USD. So total amount the user owes is $756 Mento USD. This is a backUp asset  -->