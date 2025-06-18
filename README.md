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











<!-- yarn run v1.22.22
Mainnet
$ hardhat deploy --network celo --export deployments/contracts.json && node sync-data.js
Nothing to compile
No need to generate any newer typings.
Deployer 0xa1f70ffA4322E3609dD905b41f17Bf3913366bC1
deploying "RoleManager" (tx: 0x1ebbe506167d51fbe070f5f190c516be1aedc34573dbe370375300d708a466fd)...: deployed at 0xC12E651d037C8b369FA70978e91c863ab39E7d52 with 411215 gas
RoleManager deployed to: 0xC12E651d037C8b369FA70978e91c863ab39E7d52
deploying "BaseAsset" (tx: 0x87b23854af08a70f390a5eb435b24161ee5b70d8e6e47ea593fe8356a9a65864)...: deployed at 0xFE1A76334Ee2cd9855684a800012Eb4820Bb0CA6 with 553401 gas
BaseAsset contract deployed to: 0xFE1A76334Ee2cd9855684a800012Eb4820Bb0CA6
deploying "Escape" (tx: 0x4211d44be8ee72dba336a45f9201176993b4425e35a804465093777ff299f724)...: deployed at 0x005adf762f58e9beb75051DaEc40a6589d166B45 with 640615 gas
Escape contract deployed to: 0x005adf762f58e9beb75051DaEc40a6589d166B45
deploying "Reserve" (tx: 0x167a008496c7035941dbed0ef4f41f2493949972c7c15414ab86cf7ba8ea536a)...: deployed at 0xBDD3A1EED3ac97c6c526d4DBDC82C1d845CEEb86 with 640831 gas
Reserve contract deployed to: 0xBDD3A1EED3ac97c6c526d4DBDC82C1d845CEEb86
deploying "TokenDistributor" (tx: 0x53834ff1456652b739d06d49b6ef2c7f4b4488d19712bd9eca01b5ef9ce9e3a3)...: deployed at 0x6e4faA340d48728bBCfC03da74894B97267B2246 with 1759287 gas
TokenDistributor deployed to: 0x6e4faA340d48728bBCfC03da74894B97267B2246
deploying "Attorney" (tx: 0xf2d7ef96e48fb144acdd212b920fb48920e26d7d1e0dbd9697a8655d3f8752ae)...: deployed at 0x0d207554fAEbd86CEc769922dc22279343Cdf450 with 652152 gas
Attorney contract deployed to: 0x0d207554fAEbd86CEc769922dc22279343Cdf450
deploying "SimpliToken" (tx: 0xe6cc8ca126778a39afaf23c303a55d16fd97e2f8ace2448b63291ed4adb1a197)...: deployed at 0x88DdCaA95d04024caE76506f9a584412071072e1 with 1400524 gas
SimpliToken deployed to: 0x88DdCaA95d04024caE76506f9a584412071072e1
deploying "Faucet" (tx: 0x7e9cbaa7eae6129c7494f60b5cf65670ce74476f9381b73ca06509cd52daf80b)...: deployed at 0xbfFd6Ea701D2FFf426cC343E4323ca17f88DCB57 with 822899 gas
Faucet contract deployed to: 0xbfFd6Ea701D2FFf426cC343E4323ca17f88DCB57
deploying "Points" (tx: 0x6db9bd6c46096802ac60be279d09deca0c26c5b76fd60ff644246b11b649f22e)...: deployed at 0xCaDE50298B65e0Cead712FdE46Cc1aa00043Eabc with 1115339 gas
Points contract deployed to: 0xCaDE50298B65e0Cead712FdE46Cc1aa00043Eabc
deploying "SafeFactory" (tx: 0x91c24c00fe4e7fa65f7e2fdffd7fc0c9ba7337fd9c84ce248472ef017d14f763)...: deployed at 0xAd5b46EbAbf5a84a351981C6a671d42D052C01DA with 2173356 gas
SafeFactory deployed to: 0xAd5b46EbAbf5a84a351981C6a671d42D052C01DA
NetworkName: celo
deploying "WrappedNative" (tx: 0xdff8e7160ce764fd4dae540980a91c89281790d104329891035ae158254f683c)...: deployed at 0x212A58E62C2259bbd7DAE1656e3936b79e8d5C56 with 753386 gas
WrappedNative token deployed to: 0x212A58E62C2259bbd7DAE1656e3936b79e8d5C56
deploying "SupportedAssetManager" (tx: 0x9afc9ed08352e46236aa6d5755742afa027d0e6596fbe9f3e66822c6676ff893)...: deployed at 0x83542F0b78cA891b4457aE78F22ef263646177a5 with 1076603 gas
SupportedAssetManager contract deployed to: 0x83542F0b78cA891b4457aE78F22ef263646177a5
Deploying StateManager
deploying "StateManager" (tx: 0x5bfaf46c0a6f6e8b662d265e02242bb7d3bc25ddc7bd168a9dcba535850e383a)...: deployed at 0x56c011916dEcFc8bB68174f69bD9F7ECa36Ed0f4 with 470702 gas
Factory deployed to: 0x56c011916dEcFc8bB68174f69bD9F7ECa36Ed0f4
deploying "CeloBased" (tx: 0x8d5f1c6f1eb0585afdbf4bf0a83bf2659dded9937f0ec6e58fd37a04b3f1d503)...: deployed at 0xD9038820937F7ba1A63948016AF8F2f9d72700B3 with 5446407 gas
Factory deployed to: 0xD9038820937F7ba1A63948016AF8F2f9d72700B3
deploying "Providers" (tx: 0xa2ebb30cd8b4ae7cee4078894cb7c5317de4b38d4464afbbd564793aed01bdbf)...: deployed at 0xac31b4186060237A6f40419848FaaF2ef827b300 with 1802186 gas
Providers deployed to: 0xac31b4186060237A6f40419848FaaF2ef827b300
Confirmation block 1
Quote 28805865 -->