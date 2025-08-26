# Simplifinance
![bannersimplifi](https://github.com/user-attachments/assets/386f315d-4abf-47bd-9a4d-99d7c0a0f1a7)

A protocol for short-term lending and borrowing services through a peer-funding structure. At Simplifi, we provide a groundbreaking approach to peer-to-peer group lending and borrowing that combines inclusivity, transparency, and control. While other lending platforms rely on centralized liquidity pools with predetermined and algorithm-driven interest rates, Simplifi flips the script.

## What sets up apart
- __Near-Zero Interest Loans Via Peer-Funding Mechanisms__
Our solutions allow users to access short-term, flexible, and expandable credit with little or no interest. By eliminating centralized liquidity pools, users themselves control inflow and outflow, ensuring autonomy over their funds, interest rates, if applicable, are determined by the participants, not the platform, creating a competitive and fair lending environment.

- __FlexPool: User-Driven Liquidity Pools__
FlexPool is at the heart of our system. These user-centred pools can be permissioned (for trusted groups like friends and colleagues) or permissionless (open to anyone). Participants have equal access to the total liquidity generated within a pool, distributed on a rotational basis. The decentralized model is ideal for users ranging from market women to crypto traders.

## How it works
For example, Bob, a crypto trader, creates a FlexPool with $500 unit liquidity and a maximum of five participants. He sets parameters: no interest, a 6-hour duration, and a collateral requirement in SFToken with 130 index. Once the quorum is achieved, Bob receives $2,500 to execute his trade, replenishes the pool before the 6-hour deadline, and the next participant in line gets access. This cycle continues until all participants benefit.

## Optional yield generation strategy
Collateral staked in the pool can optionally be channeled into the yield strategy protocol, generating additional profits during the loan period - an innovative way to maximize value
<!-- https://youtu.be/2huZ2onFBb0 --> 

## Problem
- Financial exclusion.
- High interest rate monopoly.
- Centralized and rigid liquidity pattern.
- Low transparency (especially for the lower classes of users).

## Solution
- Financial inclusion for all classes of users.
- Near-zero interest loans via peer-funding mechanism.
- User-driven liquidity pool through our FlexPool design.
- Enhanced flexibility and inclusion for all classes of users.
- Trust and transparency.
- Expandable liquidity.

By blending traditional group lending practices with blockchain technology, Simplifi creates a financial solution that's transparent, inclusive, and uniquely user-focused.

## Current web view
- Light version
![lightversion](https://github.com/user-attachments/assets/0f75c821-e791-46f7-85fc-9d2ba7df59ee)


Flexpool emphasizes true decentralization, user control, and healthy loan competition to accommodate lower-class to middle-class users. Through liquidity synergy, users can create a large pool of funds with little or no interest, rotate it in form or loan among the participants, optionally divert their collaterals via the __Yield__ strategy, and share the proceeds accordingly. The liquidity generated in a pool is accessible only to the contributors. You can view FlexPool as a form of loan equity where users provide only a portion of the aggregate projected pooled funds (i.e based on the expected number of contributors) to access the total contributed amounts in the form of borrowed funds payable within a short period, usually between 1 to 30 days. FlexPools are owned and controlled by the users, not us.

- Dark version
- ![darkersion](https://github.com/user-attachments/assets/bd9583dc-af81-43c8-9742-e95717f37308)


## Architecture

Simplifinance __[repository](https://github.com/simplifinance/simplifi/)__ contains both the `frontend` and `contract` folders that manages te user interface and smart contracts. Smart contracts are the heart of Simplifinance serving as the database. Although the structure may change in the future as we plan to switch to a more robust structure.

- The front end is divided into two segments - `Web app`/`Action-based` and `AI-Assist`. 
![slide4](https://github.com/user-attachments/assets/00aefd67-a545-43b9-9bee-74617aa585ab)
It is built with the NextJs framework using __ReactJS__ and __Typescript__ libraries. We used __Shadcn__ and __TailwindCSS__ to give it a nice and customizable theme and components. The web app uses a mobile-first approach while maintaining compatibility with the desktop. The __AI-Assist__ version uses LLM and Agentic workflow to give users an interactive chat-based experience. We have halted the development of the AI version, and we plan to resume working on it in the future. We used Wagmi and the Viem libraries (coupled with the Alchemy APIs) to connect to and fetch data from the blockchain. 

- [contract] folder contains the smart contracts code and test files built with Solidity language and the Etherjs library.

## Smart Contracts - Unverified (Celo Alfajores)
The following smart contracts are deployed to the Celo Alfajores network for thorough testing.

### SupportedAssetManager 
- Contract addresses
    - __[0xa00E598D0c6c2Ab62E74B1282c9Efd9d2010F47A]()__ (current)
    -  __[0xa00E598D0c6c2Ab62E74B1282c9Efd9d2010F47A]()__ (v2)
    - __[0x7fa06DeeF92926964ed0D49Cc63E689C690D1b31]()__ (v1)

- Description
    - A standalone smart contract that manages the type of assets used as base contribution and collateral. It can be used to add or remove assets. Only accounts with role permission can call most of the functions. It is consumed by other standalone contracts such as the Flexpool and Providers contracts. 

### Points And Rewards 
- Contract addresses
    - __[0x5b3d1a90717f6EDbD08b6c4aC8a6d900942BcAa6]()__ (current)
    -  __[0x5aD28E7E90DAfB40468FCa3F19B4771e33C795B5]()__ (v2)
    - __[0x803C0997623CF5bcb033cD03bA4B3E662aa843ed]()__ (v1)

- Description
    - A contract that tracks rewards for participating in the project. Only accounts with role permission can make state changes e.g. the FlexpoolFactory contract. It has a few APIs for integrating with other role-based smart contracts.   

### Providers 
- Contract addresses
    - __[0xf3226E5bc32Ad476916C808198cFEBc5a154dD97]()__ (current)
    - __[0x813F94222a056B3548bD8C332550d3F79EeA280C]()__ (v6)
    - __[0xf3226E5bc32Ad476916C808198cFEBc5a154dD97]()__ (v5)
    -  __[0x727ED1dF4421f45456aC04A67275895ED13905E9]()__ (v4)
    -  __[0x2DcAD71e4487c32c6F6763C59088E4b61fF0af3a]()__ (v3)
    - __[0x74C073D9d460458f2703cc27e6eD39fe3270a602]()__ (v2)
    - __[0x3252e2F4097936f078213937a356b65619341E3b]()__ (v1)

- Description
    - Providers is a standalone contract where users provide liquidity to the pool using stable assets such as the cUSD, etc. Users with excess savings can engage their assets in a low-risk income generator like the providers pool where Flexpool users can access loans with minimal and competitive interest to finance a contribution.

### Collateral asset 
- Contract addresses
    - __[0x962289B0F4f0Aa00d84D7a55DAFC68F28C54fAC0]()__ (current)

- Description
    - Since our peer-funding structure requires contributing in a stable asset such as the CUSD, it requires a collateral asset to function as expected. Any supported ERC20 compatible asset can be used as a collateral cover against getting finance hence Simplifi Token can act as a collateral asset including any supported Mento stable assets.

### Faucet 
- Contract addresses
    - __[0xa8ac853Ec5Ba50eDB0617116b734578Fac6Fb214]()__ (current)
    -  __[0x1DD9a1535AfE5FB5A9FdbD12ce741aE82475BC37q]()__ (v1)

- Description
    - This is a temporary contract we created for testing. Through the __[ui](https://testnet.simplifinance.xyz)__, our users can access test tokens to be able to test with us and earn rewards in points for contribution to the project.

### FlexPoolFactory (main) 
- Contract addresses
    - __[0x75884011edb2fD48C8f38d4e0EC0868f6b986aa9]()__ (current)
    - __[0x8635ba601A3a519d540a14d773EE09486E584606]()__ (V5)
    - __[0x4a5bBda280D38644b08bcBdD413E80ED07faD60d]()__ (v4)
    - __[0x0A04Bc2e7eba58F9b60E9baBb7d6d2A9B8DF6B49]()__ (v3)
    -  __[0x66ECA3234F0Aec3D69252B3c3CEA27916cfF0511]()__ (v2)
    - __[0x16f0512caA28DA6a890589819Fb70815DFd1206E]()__ (v1)

- Description
    - This is the main engine that powers the Simplifi's vehicle. It is designed with conciseness, modularity, readability, scalability, and standard security practices. It enables users to initiate Flexpools, join a pool, getFinance, payback, and liquidate.


# Relevant Links
- __[Webiste](https://simplifinance.xyz)__
- __[X/Twitter](https://x.com/SimpliFina)__
- __[Testnet site](https://testnet.simplifinance.xyz)__
- __[Documentation](https://simplifinance.gitbook.io/docs/)__









<!-- Verifer -->
<!-- This code is a collection of Solidity smart contracts and libraries that are part of a decentralized identity verification system. The system appears to be designed to handle identity attestations, verification of identity documents, and management of user verification statuses. Here's a breakdown of the key components:




OpenZeppelin Imports: The code uses several OpenZeppelin contracts and libraries, including:



Context.sol: Provides information about the current execution context.

Ownable.sol: Implements a basic access control mechanism with a single owner.

IERC20Permit.sol and IERC20.sol: Interfaces for ERC20 tokens with permit functionality.

Address.sol: A library for handling address-related operations.

SafeERC20.sol: A library for safe ERC20 token operations.

ReentrancyGuard.sol: A contract module to prevent reentrant calls.




Custom Libraries and Interfaces:



AttestationId.sol: Defines constants for different types of attestation identifiers.

CircuitConstantsV2.sol: Defines constants and structures for handling circuit-related data.

SelfStructs.sol: Contains data structures for identity verification.

Various interfaces (IDscCircuitVerifier.sol, IRegisterCircuitVerifier.sol, IIdentityVerificationHubV2.sol, ISelfVerificationRoot.sol) define the expected functionality for different parts of the system.




Main Contracts:



SelfVerificationRoot.sol: An abstract contract that provides base functionality for verifying and disclosing identity credentials.

Verifier.sol: The main contract that implements the SelfVerificationRoot, Ownable, and ReentrancyGuard contracts. It handles user verification and registration for claims.




Functionality:



Verification and Registration: The Verifier contract allows users to verify their identity and register for claims. It includes functions to set verification status, toggle wallet verification requirements, and handle verification hooks.

Scope Management: The contract includes functionality to update the scope used for verification.

Config Management: The contract allows setting and retrieving configuration IDs for verification.




Security Features:



Ownership: The contract uses the Ownable pattern to restrict certain functions to the contract owner.

Reentrancy Guard: The contract includes a reentrancy guard to prevent reentrant calls.

Verification Checks: The contract includes checks to ensure that users meet certain criteria (e.g., age verification, sanction checks) before they can be verified.




Events and Errors:



The contract emits events for important actions, such as when a user identifier is verified.

It includes custom errors for handling specific error conditions, such as invalid data formats and unauthorized callers.




Overall, this codebase is designed to provide a secure and decentralized way to verify identities and manage user verification statuses within a blockchain environment. -->



<!-- Verified Contracts -->
<!-- https://celoscan.io/address/0x5FA880883a4BB7b44ddCb115a09ff86c3d764C61#code Verifier -->
<!-- https://celoscan.io/address/0xEEB164Dce776B4B8Aa24Cc22f4E6Fe1c79Fa4fF7#code Flexpool -->
<!-- https://celoscan.io/address/0xcAc7738F4FCc4A70C8EEA7AA97237839A54E068A#code Provider -->
<!-- https://celoscan.io/address/0x8B247cE6A56e39E6C4b7090e68aA07b13C1ee0B8#code WrappedNative -->