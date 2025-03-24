# Simplifinance
![bannersimplifi](https://github.com/user-attachments/assets/386f315d-4abf-47bd-9a4d-99d7c0a0f1a7)

A protocol for short-term lending and borrowing services through a peer-funding structure. At Simplifi, we provide a groundbreaking approach to peer-to-peer group lending and borrowing that combines inclusivity, transparency, and control. While other lending platforms rely on centralized liquidity pools with predetermined and algorithm-driven interest rates, Simplifi flips the script.

## What sets up apart
- __Near-Zero Interest Loans Via Peer-Funding Mechanisms__
Our solutions allow users to access short-term, flexible, and expandable credit with little or no interest. By eliminating centralized liquidity pools, users themselves control inflow and outflow, ensuring autonomy over their funds, interest rates, if applicable, are determined by the participants, not the platform, creating a competitive and fair lending environment.

- __FlexPool: User-Driven Liquidity Pools__
FlexPool is at the heart of our system. These user-created pools can be either permissioned (for trusted groups like friends and colleagues) or permissionless (open to anyone). Participants have equal access to the total liquidity generated within a pool, distributed on a rotational basis. The decentralized model is ideal for users ranging from market women to crypto traders.

## How it works
For example, Bob, a crypto trader, creates a FlexPool with $500 unit liquidity and a maximum of five participants. He sets parameters: no interest, a 6-hour duration, and a collateral requirement in SFToken with 130 index. Once the quorum is achieved, Bob receives $2,500 to execute his trade, replenishes the pool before the 6-hour deadline, and the next participant in line gets access. This cycle continues until all participants benefit.

## Optional yield generation strategy
Collateral staked in the pool can optionally be channeled into the yield strategy protocol, generating additional profits during the loan period - an innovative way to maximize value
<!-- https://youtu.be/2huZ2onFBb0 --> 

## Problem
- High interest rate monopoly.
- Centralized and rigid liquidity pattern.
- Low transparency and financial exclusion (especially for the lower class of users).

## Solution
- Near-zero interest loans via peer-funding mechanism.
- User-driven liquidity pool through our FlexPool design.
- Enhanced flexibility and inclusion for all class of users.
- Trust and transparency.
- Expandable liquidity.

By blending traditional group lending practices with blockchain tecehnology, Simplifi creates a financial solution that's transparent, inclusive, and uniquely user-focused.

## How FlexPool works
![ob2](https://github.com/user-attachments/assets/e806c380-96e5-4557-a076-dac58238dca9)

Flexpool emphasizes true decentralization, user control, and healthy loan competition to accommodate lower-class to middle-class users. Through liquidity synergy, users can create a large pool of funds with little or no interest, rotate it in form or loan it among themselves, invest their collaterals via the __Yield__ dashboard, and share the proceeds accordingly. The liquidity generated in a pool is accessible only to the contributors. You can view FlexPool as a form of loan equity where users provide only a part of the aggregate loan (based on the expected number of contributors) to access the total contributed amounts in the form of borrowed funds payable within a short period, usually between 1 to 30 days. FlexPools are owned and controlled by the users, not us.

## Architecture

Simplifinance __[repository](https://github.com/simplifinance/simplifi/)__ contains both the `frontend` and `contract` folders that manages te user interface and smart contracts. Smart contracts are the heart of Simplifinance serving as the database. Although the structure may change in the future as we plan to switch to a more robust structure.

- The frontend is divided into two segments - `Web app`/`Action-based` and `AI-Assist`. 
![slide4](https://github.com/user-attachments/assets/00aefd67-a545-43b9-9bee-74617aa585ab)
It is built with NextJs framework using __ReactJS__ and __Typescript__ libraries. We used __Shadcn__ and __TailwindCSS__ to give it a nice and customizable theme and components. The web-app uses a mobile-first approach while maintaining compatibility with the desktop. The __AI-Assist__ version uses LLM and Agentic workflow to give users an interactive chat-based experience. We have halted the development of the AI-version, and we plan to resume working on it in the future. We used Wagmi and the Viem libraries (coupled with the Alchemy APIs) to connect to and fetch data from the blockchain. 

- [contract] folder contains the smart contracts code and test files built with Solidity language and the Etherjs library.

## Project structure
- contract
    - contracts - (smart contracts                    )
    - deploy - (Deployment code)
    - deployments (Only available after running deployment command in __package.json__)
    - ignition (Not relevant)
    - test (Test files)
    - typechain-types (Available only after compile e.g. yarn compile)
    - env.local (Environment variable sample)
    - gitignore 
    - hardhat.config.ts
    - LICENSE
    - tsconfig.json
    - yarn.lock
- ui
    - apis (Backend files: OpenAI and Safe wallet configurations and tools)
        - openai
        - read
        - safe
        - update
        - utils
        - abis.ts
        - viemClient.ts
    - components
        - AppProvider (Wallet configuration)
        - ConnectWallet (Connect wallet button)
        - ErrorBoundary (Error catching)
        - Layout
        - MotionDivWrap
        - OnboardScreen
        - App.tsx
        - CustomButton.tsx
        - Message.tsx
    - deployments (copied folder from contracts)
    - fonts
    - pages
    - styles
    - env.example
    - eslintrc.json
    - gitignore
    - interfaces (types)
    - LICENSE
    - next.config.mjs
    - package.json
    - postcss.config.js
    - README.md
    - tailwind.config.ts
    - tsconfig.json
    - utilitie.ys
    - yarn.lock
 

# How to run

## Contracts
- Clone the repository

run:
```
    cd contract  
```

```
    yarn install
```

```
    yarn compile
```

Deploy locally to Hardhat built-in VM engine
```
    yarn deploy
```

Deploy to Celo testnet
```
    yarn deploy-alfa
```

## UI

- Clone the repository

```
    cd ui
```

Install dependencies
```
    yarn install
```

Run development server
```
    yarn run dev
```

Build
```
    yarn run build
```


# Relevant Links

- __[Webiste](https://simplifinance.xyz)__
- __[Testnet live](https://testnet.simplifinance.xyz)__
- __[Documentation](https://simplifinance.gitbook.io/docs/)__ -->


































    
<!-- 
- Our smart contracts are currently deployed on the Celo Alfajores since we're actively making a lot of changes. Celo blockchain serves as our core database, even though we had tested with other network, we chose Celo in order to benefit from the cheap transaction cost, scalabiity and EVM security features.

## Deployed Contract Addresses on Celo Alfajores

- Factory - __0x99D39170E2807D26E71C721bbb414f4a913eA2c4__ (Unverified)
- Stablecoin (test) - __0xF0046e26E286f966F77fFC6F408eD00949092Ccd__ (Unverified)

`NB`: We are yet to very these contracts as they are undergoing frequest changes.

## Commits

- __[1](https://github.com/bobeu/simplifi_proof_of_ship/commit/f1e04091efce2358fdbb6771bfa2510e7b50043a)__

- __[2](https://github.com/bobeu/simplifi_proof_of_ship/commit/e2eead19451c0c15379975bf27379406b97745cb)__

__[3](https://github.com/bobeu/simplifi_proof_of_ship/commit/990ee8131843ed5bdbeca54e86207c33d0070925)__

__[4](https://github.com/celo-org/Proof-of-Ship/commit/16fa2f242811958bcf8e1fdc0ff470dc5d41a2ab)__

__[5](https://github.com/celo-org/Proof-of-Ship/commit/f19ca4ae3d98b47b52fd184a41e7a20e33086625)__


## Video
__[Youtube](https://youtu.be/Ag4Jfwo6jHM)__

## Slide
__[Google](https://docs.google.com/presentation/d/1r4jqqVc-oMhMBpJAXiN9u0VSnVNS2uC3M0hgdH1c-Bg/edit?usp=sharing https://docs.google.com/presentation/d/1r4jqqVc-oMhMBpJAXiN9u0VSnVNS2uC3M0hgdH1c-Bg/edit?usp=sharing )__

## Team
- Isaac J
    - __[Github](https://github.com/bobeu)__
    - __[Email](mailto:bobmatea27@gmail.com)__
    - __[LinkedIn](https://www.linkedin.com/in/isaac-j-a6764a169)__
    - __[Project - Proof of ship](https://github.com/bobeu/simplifinance_bot_miniapp)__

            


 -->









<!-- # Simplifinanc AI-Agent/Integration

Simplifinance AI-powered Agent

Simplifinance provides users with multiple loan faucets with full control of their liquidity to maximize capital efficiency. Our MVP, FlexPool, is a customized liquidity pool for short-term crypto loan services focusing on all categories of users. 


## AI Assist Interface

## Project structure

The project is split into two main categories:
- __[Action Based - repo](https://github.com/simplifinance/simplifi)__ : Usual way to interact with an application through a call-to-action such as clicking a button to get response (s). Github __[repo](https://github.com/simplifinance/simplifi)__. Interact __[here](https://testnet.simplifinance.xyz)__

- __[AI Assist - repo](https://github.com/bobeu/simplifinance_bot_miniapp)__ : This a text-based mode of interacting with the Simplifinance's backend via AI agent. The Agent can connect and perform read and write access to the Simplifi's backend on behalf of the user using text prompts. Currently, we are working to improve the quality of the UI for this category. You can find the demo __[here]()__.




























<!-- # To interact with this app, please follow these steps

## Frontend

- Clone the repo 

```
    git clone https://github.com/simplifinance.git
```

- Navigate into the project. 

```
    cd frontend
```

- Install the dependencies

```
    Yarn install or npm install
```

- Run dev mode

```
    yarn run dev
```

- Build for production

```
    yarn build
```

- Start in production mode

```
    yarn start
```


## Contracts

```
    cd contract
```

- Installation

```
    yarn install or npm install
```

- Compile contracts

```
    yarn compile
```

- Run test

```
    yarn test
```

- Deploy to testnet

```
    yarn deploy-testnet
``` -->