<!-- ```
    C:\Users\Bobman\Desktop\web3\simplifi\contract>yarn deploy-testnet
    yarn run v1.22.22
    $ hardhat deploy --network crossTest --export deployments/contracts.json
    Nothing to compile
    No need to generate any newer typings.
    deploying "OwnerShip" (tx: 0x42c548709d53fb5d06241153259af857fd3d9dda3993f6c7dfe9d103b5da705b)...: deployed at 0xe09e23F8a8032BB39326098802c970f9b48D726C with 415942 gas
    OwnershipManager deployed to: 0xe09e23F8a8032BB39326098802c970f9b48D726C
    deploying "TestAsset" (tx: 0x7b19935ebf64db27d09636aac71acf0c82e757e6442e7bb0a69cb5f604813c44)...: deployed at 0xb28721f7b977D64F9401161EA91bC25D59F25308 with 648848 gas
    Test Asset deployed to: 0xb28721f7b977D64F9401161EA91bC25D59F25308
    deploying "AssetClass" (tx: 0xae689c04d7e4c3c860e9ba6850cf614d06d9ca4af4965a92129ba51a3731fb45)...: deployed at 0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c with 574515 gas
    AssertMgr deployed to: 0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c
    deploying "StrategyManager" (tx: 0x08f33ed5ce64a7edcaa62d71797d621816730bb9608feb1d84ad5b2130cfdce1)...: deployed at 0x99C62eF80CA0ECc942994d407ecA89dDE3625F7d with 1450230 gas
    strategyManager deployed to: 0x99C62eF80CA0ECc942994d407ecA89dDE3625F7d
    deploying "FactoryLib" (tx: 0x93a2ebd70cad96284d2f4892a7ea26f966604ecd53f9bbd34792b3561f84e5d6)...: deployed at 0xfFF63Bc9aa8343e10870f871f7BE2Fd8a4D844e9 with 72281 gas
    factoryLib deployed to: 0xfFF63Bc9aa8343e10870f871f7BE2Fd8a4D844e9
    deploying "Factory" (tx: 0x2012cef6a81f492b53565f17c3b3ac1c5724ffdc7a79b264173058c607dfa9e6)...: deployed at 0x6c0DB3faE880a23f6b31e3DDa68866E3Ba2Bb57B with 4570135 gas
    Factory deployed to: 0x6c0DB3faE880a23f6b31e3DDa68866E3Ba2Bb57B
    [
    '0xD7c271d20c9E323336bFC843AEb8deC23B346352',
    '0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c',
    10,
    '0x99C62eF80CA0ECc942994d407ecA89dDE3625F7d',
    feeTo: '0xD7c271d20c9E323336bFC843AEb8deC23B346352',
    assetAdmin: '0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c',
    makerRate: 10,
    strategyManager: '0x99C62eF80CA0ECc942994d407ecA89dDE3625F7d'
    ]
    Done in 59.87s.
```

```
    $ hardhat deploy --network crossTest --export deployments/contracts.json
Nothing to compile
No need to generate any newer typings.
reusing "OwnerShip" at 0xe09e23F8a8032BB39326098802c970f9b48D726C
OwnershipManager deployed to: 0xe09e23F8a8032BB39326098802c970f9b48D726C
reusing "TestAsset" at 0xb28721f7b977D64F9401161EA91bC25D59F25308
Test Asset deployed to: 0xb28721f7b977D64F9401161EA91bC25D59F25308
reusing "AssetClass" at 0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c
AssertMgr deployed to: 0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c
deploying "StrategyManager" (tx: 0x7370f0cd31f77cb874cba99a96d00a6305d4c78bc617d4f043feca33aa7dc167)...: deployed at 0xf06dEA060647FFb3e50247FFdCB3d7616F37aDce with 1450230 gas
strategyManager deployed to: 0xf06dEA060647FFb3e50247FFdCB3d7616F37aDce
deploying "FactoryLib" (tx: 0xe9969829503adf4061ac8dd81f9704415c0ecdb401c4f1525aa06f4170e5e173)...: deployed at 0x308C6E16F08fB8f86252fE7222c76078D096A5a2 with 72281 gas
factoryLib deployed to: 0x308C6E16F08fB8f86252fE7222c76078D096A5a2
deploying "Factory" (tx: 0x928bd386e7ad4ff97d1066b3217899a4627dad5b6fe03b4efc71400d7eba59e7)...: deployed at 0xd35809a0e021407Cb9B4FFa7C9adC08166107305 with 4622019 gas
Factory deployed to: 0xd35809a0e021407Cb9B4FFa7C9adC08166107305
[
  '0xD7c271d20c9E323336bFC843AEb8deC23B346352',
  '0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c',
  10,
  '0xf06dEA060647FFb3e50247FFdCB3d7616F37aDce',
  feeTo: '0xD7c271d20c9E323336bFC843AEb8deC23B346352',
  assetAdmin: '0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c',
  makerRate: 10,
  strategyManager: '0xf06dEA060647FFb3e50247FFdCB3d7616F37aDce'
]
Done in 35.33s.
```

```
  C:\Users\Bobman\Desktop\web3\simplifi\contract>yarn deploy-testnet
  yarn run v1.22.22
  $ hardhat deploy --network crossTest --export deployments/contracts.json
  Nothing to compile
  No need to generate any newer typings.
  reusing "OwnerShip" at 0xe09e23F8a8032BB39326098802c970f9b48D726C
  OwnershipManager deployed to: 0xe09e23F8a8032BB39326098802c970f9b48D726C
  reusing "TestAsset" at 0xb28721f7b977D64F9401161EA91bC25D59F25308
  Test Asset deployed to: 0xb28721f7b977D64F9401161EA91bC25D59F25308
  reusing "AssetClass" at 0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c
  AssertMgr deployed to: 0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c
  deploying "StrategyManager" (tx: 0x1fe133fe8ad9f0050d28c640ccb02d94624291590dcbc2622147aad23f64367f)...: deployed at 0x8B024493A376A38455d3caAfF2b7D77C3Bf9B2c6 with 1450230 gas
  strategyManager deployed to: 0x8B024493A376A38455d3caAfF2b7D77C3Bf9B2c6
  deploying "FactoryLib" (tx: 0x50414ab361810e6efae5b567d946e43f40d4233a91e70cd0f0ceabc2d015cd21)...: deployed at 0xe87a05c8f11999EDA2cfB10f347ca7da94D34e58 with 72281 gas
  factoryLib deployed to: 0xe87a05c8f11999EDA2cfB10f347ca7da94D34e58
  deploying "Factory" (tx: 0xd0025d9c4e2c03e9a11da9033686523f82ef10f832a994110a2db8e045a408e8)...: deployed at 0x82263AF611A7E1bb11aB15722d3Da5cD9B2a86B8 with 4645769 gas
  Factory deployed to: 0x82263AF611A7E1bb11aB15722d3Da5cD9B2a86B8
  [
    '0xD7c271d20c9E323336bFC843AEb8deC23B346352',
    '0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c',
    10,
    '0x8B024493A376A38455d3caAfF2b7D77C3Bf9B2c6',
    feeTo: '0xD7c271d20c9E323336bFC843AEb8deC23B346352',
    assetAdmin: '0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c',
    makerRate: 10,
    strategyManager: '0x8B024493A376A38455d3caAfF2b7D77C3Bf9B2c6'
  ]
  Done in 76.76s.
```

```
  C:\Users\Bobman\Desktop\web3\simplifi\contract>yarn deploy-testnet
yarn run v1.22.22
$ hardhat deploy --network crossTest --export deployments/contracts.json
Nothing to compile
No need to generate any newer typings.
reusing "OwnerShip" at 0xe09e23F8a8032BB39326098802c970f9b48D726C
OwnershipManager deployed to: 0xe09e23F8a8032BB39326098802c970f9b48D726C
reusing "TestAsset" at 0xb28721f7b977D64F9401161EA91bC25D59F25308
Test Asset deployed to: 0xb28721f7b977D64F9401161EA91bC25D59F25308
reusing "AssetClass" at 0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c
AssertMgr deployed to: 0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c
deploying "StrategyManager" (tx: 0x49485ff4d8f7bdd3464caf35be7983af89420272cea43999d385dfb9602e2aee)...: deployed at 0xFCA8C9e854BD0Ca42D16bBE73Bc75bC427Cb401d with 1450218 gas
strategyManager deployed to: 0xFCA8C9e854BD0Ca42D16bBE73Bc75bC427Cb401d
deploying "FactoryLib" (tx: 0xb981dcd2aa5722d0bd7399a7557f9b55d71b48c8a8ca34a600a7a16e67de290c)...: deployed at 0xc15d6a9B3C7706a974528824AdA319e36376173A with 72281 gas
factoryLib deployed to: 0xc15d6a9B3C7706a974528824AdA319e36376173A
deploying "Factory" (tx: 0xa7dc86ab760ec8639ca5e3c610eb50f922cb409a5cae426a8843d1d86aff8eea)...: deployed at 0xe4Dd196b3529FDa4B3e3cd22077AAF815862F839 with 5138452 gas
Factory deployed to: 0xe4Dd196b3529FDa4B3e3cd22077AAF815862F839
[
  '0xD7c271d20c9E323336bFC843AEb8deC23B346352',
  '0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c',
  10,
  '0xFCA8C9e854BD0Ca42D16bBE73Bc75bC427Cb401d',
  feeTo: '0xD7c271d20c9E323336bFC843AEb8deC23B346352',
  assetAdmin: '0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c',
  makerRate: 10,
  strategyManager: '0xFCA8C9e854BD0Ca42D16bBE73Bc75bC427Cb401d'
]
Done in 87.22s.
```


```
  C:\Users\Bobman\Desktop\web3\simplifi\contract>yarn deploy-testnet
yarn run v1.22.22
$ hardhat deploy --network crossTest --export deployments/contracts.json
Nothing to compile
No need to generate any newer typings.
reusing "OwnerShip" at 0xe09e23F8a8032BB39326098802c970f9b48D726C
OwnershipManager deployed to: 0xe09e23F8a8032BB39326098802c970f9b48D726C
reusing "TestAsset" at 0xb28721f7b977D64F9401161EA91bC25D59F25308
Test Asset deployed to: 0xb28721f7b977D64F9401161EA91bC25D59F25308
reusing "AssetClass" at 0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c
AssertMgr deployed to: 0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c
reusing "StrategyManager" at 0xFCA8C9e854BD0Ca42D16bBE73Bc75bC427Cb401d
strategyManager deployed to: 0xFCA8C9e854BD0Ca42D16bBE73Bc75bC427Cb401d
reusing "FactoryLib" at 0xc15d6a9B3C7706a974528824AdA319e36376173A
factoryLib deployed to: 0xc15d6a9B3C7706a974528824AdA319e36376173A
deploying "Factory" (tx: 0xee4480381118f76443a8c90fffee153720e606cb84491b53fad2f6e6a39543fb)...: deployed at 0x9890feB714834586aABD839F3395f017C4bA5BFe with 5138452 gas
Factory deployed to: 0x9890feB714834586aABD839F3395f017C4bA5BFe
[
  '0xD7c271d20c9E323336bFC843AEb8deC23B346352',
  '0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c',
  10,
  '0xFCA8C9e854BD0Ca42D16bBE73Bc75bC427Cb401d',
  feeTo: '0xD7c271d20c9E323336bFC843AEb8deC23B346352',
  assetAdmin: '0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c',
  makerRate: 10,
  strategyManager: '0xFCA8C9e854BD0Ca42D16bBE73Bc75bC427Cb401d'
]
Done in 40.20s.
```

```
:\Users\Bobman\Desktop\web3\simplifi\contract>yarn deploy-testnet
yarn run v1.22.22
$ hardhat deploy --network crossTest --export deployments/contracts.json
Nothing to compile
No need to generate any newer typings.
reusing "OwnerShip" at 0xe09e23F8a8032BB39326098802c970f9b48D726C
OwnershipManager deployed to: 0xe09e23F8a8032BB39326098802c970f9b48D726C
reusing "TestAsset" at 0xb28721f7b977D64F9401161EA91bC25D59F25308
Test Asset deployed to: 0xb28721f7b977D64F9401161EA91bC25D59F25308
reusing "AssetClass" at 0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c
AssertMgr deployed to: 0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c
reusing "StrategyManager" at 0xFCA8C9e854BD0Ca42D16bBE73Bc75bC427Cb401d
strategyManager deployed to: 0xFCA8C9e854BD0Ca42D16bBE73Bc75bC427Cb401d
deploying "FactoryLib" (tx: 0x40f95783089270d1e7eaf752007da479d2ffd376a298956ec712662ea67b648e)...: deployed at 0x881E46D24d81776e5c4c839E12648C5880904874 with 72281 gas
factoryLib deployed to: 0x881E46D24d81776e5c4c839E12648C5880904874
deploying "Factory" (tx: 0x1dab2083a987f1d3ec0bd556933734a2359c9413417ffc0fb6806dbc56c450ff)...: deployed at 0x4976c4999187416eE499F3Fb9974966C74747eAd with 5157165 gas
Factory deployed to: 0x4976c4999187416eE499F3Fb9974966C74747eAd
[
  '0xD7c271d20c9E323336bFC843AEb8deC23B346352',
  '0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c',
  10,
  '0xFCA8C9e854BD0Ca42D16bBE73Bc75bC427Cb401d',
  feeTo: '0xD7c271d20c9E323336bFC843AEb8deC23B346352',
  assetAdmin: '0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c',
  makerRate: 10,
  strategyManager: '0xFCA8C9e854BD0Ca42D16bBE73Bc75bC427Cb401d'
]
Done in 35.90s.
``` -->

<!-- ```
  C:\Users\Bobman\Desktop\web3\simplifi\contract>yarn deploy-testnet
yarn run v1.22.22
$ hardhat deploy --network crossTest --export deployments/contracts.json
Nothing to compile
No need to generate any newer typings.
reusing "OwnerShip" at 0xe09e23F8a8032BB39326098802c970f9b48D726C
OwnershipManager deployed to: 0xe09e23F8a8032BB39326098802c970f9b48D726C
reusing "TestAsset" at 0xb28721f7b977D64F9401161EA91bC25D59F25308
Test Asset deployed to: 0xb28721f7b977D64F9401161EA91bC25D59F25308
reusing "AssetClass" at 0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c
AssertMgr deployed to: 0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c
reusing "StrategyManager" at 0xFCA8C9e854BD0Ca42D16bBE73Bc75bC427Cb401d
strategyManager deployed to: 0xFCA8C9e854BD0Ca42D16bBE73Bc75bC427Cb401d
reusing "FactoryLib" at 0x881E46D24d81776e5c4c839E12648C5880904874
factoryLib deployed to: 0x881E46D24d81776e5c4c839E12648C5880904874
reusing "Factory" at 0x12dFb47DA38787d9c80c3680dc73bc347Ca3fcCB
Factory deployed to: 0x12dFb47DA38787d9c80c3680dc73bc347Ca3fcCB
[
  '0xD7c271d20c9E323336bFC843AEb8deC23B346352',
  '0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c',
  10,
  '0xFCA8C9e854BD0Ca42D16bBE73Bc75bC427Cb401d',
  feeTo: '0xD7c271d20c9E323336bFC843AEb8deC23B346352',
  assetAdmin: '0x1a375D2aEF1370B306B4aCc9d930e3C2defaBF9c',
  makerRate: 10,
  strategyManager: '0xFCA8C9e854BD0Ca42D16bBE73Bc75bC427Cb401d'
]
Done in 34.77s.
``` -->





<!-- 
**Tserundede Godswill Ejueyitchie** - Cofounder, Project Manager
A Blockchain consultant. Experienced in the telecommunication industry and cross-border payment.

**Gbenga Olotu ** - Lead Designer, Cofounder

A Software engineer with over 12 years of experience spanning Telecommunications and Media, Entertainment, Oil and Gas, and Financial Technology (FinTech). A crypto enthusiast and a blockchain developer/consultant.

**Isaac J** Cofounder, Developer

Solidity/Ethereum/Web3/Python/Javascript/React developer with over 5+ years of experience in the blockchain and Fintech sectors. 


CrossFi Evolution Hackathon (CEH) #1_ Boost XFI Utility _ Hackathon _ DoraHacks

https://docs.google.com/document/d/1hfFCgGVc3HXY0ZhgGAsFiLahFJIVloUG1cRdQdD2k3Y/edit?usp=drivesdk

https://github.com/simplifinance/simpliDoc
https://github.com/simplifinance/devdoc

Simplifinance FlexPools uses XFI as a collateral base asset. Users who want to GF/Borrow are required to lock a certain amount of XFI  as a pledge to return the loans. With this, we drive a huge value and demand for XFI. 

The locked collaterals are sent to our aggregated yield strategy dashboard to earn more crypto for the users.

Lastly, user of Simplifinance's products are require to pay gas fee in XFI.



https://test.xfiscan.com/tx/0x9029e146e72a6c09f657f971f4b1229d45d1268ca86e55b1acd136011ace9eb7

https://test.xfiscan.com/tx/0x1dab2083a987f1d3ec0bd556933734a2359c9413417ffc0fb6806dbc56c450ff

https://test.xfiscan.com/tx/0xa7dc86ab760ec8639ca5e3c610eb50f922cb409a5cae426a8843d1d86aff8eea

https://github.com/simplifinance/simplifi/blob/main/contract/DEPLOY_RESULT.md



https://youtu.be/SwPouAJYx6E

https://simplifi-st5h.vercel.app/

mx16lp8r5svncerxd4lepp6awx7cgangc6j3w6ctk
0xD7c271d20c9E323336bFC843AEb8deC23B346352

We are a team of passionate persons with knowledge and background in software development, design, community management, and blockchain know-how.
Our mission is to continuously build decentralized innovative products; easily accessible without constraints; to drive adoption for the blockchain sector.


**Inspiration**
Decentralized finance can be described as fueling the blockchain and crypto space over the years. Often, it is a way of providing and accessing crypto loans to make more money. We discovered that many existing liquidity protocols remain complex for an average crypto user with web3 jargon and technicalities thereby creating an atmosphere for financial exclusion to thrive.  We could encourage financial inclusion by building simple protocols usable by all classes of users. This is coupled with our passion for decentralization.

**What Our Project Does**
The MVP of Simplifinance is 'FlexPool' which we designed in 3 ways. We built the first part of FlexPool in this hackathon. Users can create a synergy of liquidity using FlexPool.  It is divided into two categories.

- The first category is the permissioned pool which brings together people of the same settings, backgrounds, ethnic groups, friends, or peers. One person (the creator) only needs to initialize a FlexPool with the addresses of the others.  These predefined members can later provide liquidity or contribute to the pool.
When the pool is filled with the required providers, a round to borrow is started. The total pooled funds will be rotated among the providers until the last person uses their turn. This type of funding often will attract no interest but it depends on what they agreed upon. Each time a participant wants to GF/Borrow, they are required to lock a weighted amount of XFI as a pledge to return the loan. The locked collaterals are directed to the yield strategy protocol to generate more income for the epoch duration.

- Permissionless pool as the second category operates similarly to the permission except that it is open to anyone to participate. Interest may or may not be charged. Since users decide how long they wish to utilize the loan, charging interest may be necessary.  

- The second type of FlexPool lets users access an expandable liquidity pool without committing. This is contrary to the logic of the type described above.

The flow of any of the types remains:

- Create flexPool
- Add liquidity
- GetFinance/Borrow
   - Lock collateral to a strategy.
- Payback
  - Unlock collateral from strategy
- Finalized.

**How we built it**
The project is a combination of on-chain code (the Simplifi contracts), client code, backend, and Oracle APIs fetching the price of XFI. The client sends a request to the backend (web3) which in turn interacts with the blockchain. For demo purposes and to manage time, we directly fetch data from the blockchain and relay it to the front end.  This method may be slow but we plan to subscribe to a more intuitive service like Covalent, or others in the future for better user experience. 

Contracts: Written in Solidity, can be found here: https://github.com/simplifinance/simplifi/tree/main/contract

Frontend: Written in Typescript with React, can be found here: https://github.com/simplifinance/simplifi/tree/main/frontend

Web3 Backend: Written using Wagmi and Ethers, can be found here: https://github.com/simplifinance/simplifi/tree/main/frontend/apis

**Challenges we encountered**

We want to have reliable data sources instead of fetching on-chain code but the limited time won't permit us. We encountered very tough logical bugs while writing the smart contracts considering we have to write secure code. It took us days to get this fixed. We also encountered a nightmare while try to deploy the smart contracts to the CrossFi testnet as 99% of the nodes were not open to connection. Thanks to the Alchemy endpoint.

We are very excited to have pushed this project to this stage. This is an accomplishment we are proud of.




https://x.com/Sim_pliFi?t=lVINiuaAU5qTiCRGqww_JA&s=08
 -->


15/4/2025
C:\Users\Bobman\Desktop\web3\simplifi\contract>yarn deploy-alfa
yarn run v1.22.22
$ hardhat deploy --network alfajores --export deployments/contracts.json
Nothing to compile
No need to generate any newer typings.
reusing "RoleManager" at 0x79dF2FCc7DfDdc0C85Cc1f82B1f631b4b9D994B0
RoleManager deployed to: 0x79dF2FCc7DfDdc0C85Cc1f82B1f631b4b9D994B0
reusing "BaseAsset" at 0x476ED9B38aB286f6ce5DD70830067e645c754094
Escape contract deployed to: 0x476ED9B38aB286f6ce5DD70830067e645c754094
reusing "Escape" at 0xE9bC7eD3AaF48DC7E81c3e37DaDDb87d4059862B
Escape contract deployed to: 0xE9bC7eD3AaF48DC7E81c3e37DaDDb87d4059862B
reusing "Reserve" at 0xCe2f003766D426e404B4492A1293CD379c998b9B
Reserve contract deployed to: 0xCe2f003766D426e404B4492A1293CD379c998b9B
reusing "TokenDistributor" at 0x91EdD1Dc2c2Fa44EdFeB26bb1718c608fC68C805
TokenDistributor deployed to: 0x91EdD1Dc2c2Fa44EdFeB26bb1718c608fC68C805
reusing "Attorney" at 0x4CD0676d990ED89fC0F476252c5BEf145443aB28
Attorney contract deployed to: 0x4CD0676d990ED89fC0F476252c5BEf145443aB28
reusing "SimpliToken" at 0xf4991C26f62524073C4d8eFa57Df0Ce9bC5313Cd
SimpliToken deployed to: 0xf4991C26f62524073C4d8eFa57Df0Ce9bC5313Cd
deploying "Faucet" (tx: 0x4a560e37ab0ceff4c5641585de6bc6016e743345400584094bb9d4beb0ce2616)...: deployed at 0xcec7B50d2ccbBc7ac3e509b5C0dcBA11d67D351c with 819382 gas
Escape contract deployed to: 0xcec7B50d2ccbBc7ac3e509b5C0dcBA11d67D351c
deploying "Points" (tx: 0xeb3b8501b4f95fd140c80451ee7dcd4dce33550d05a96a957abf259bcdf66b2e)...: deployed at 0x187E1b8D5F3287db849374E8C966f648693971D1 with 623973 gas
Point contract deployed to: 0x187E1b8D5F3287db849374E8C966f648693971D1
deploying "SafeFactory" (tx: 0x9d520e1aa5375f6d0f1c1b9124c309a3efef7656de23d490b30365ce69722436)...: deployed at 0x13711fF6397B0510c1E774579EAB7C5fD85F03db with 1605139 gas
SafeFactory deployed to: 0x13711fF6397B0510c1E774579EAB7C5fD85F03db
reusing "SupportedAssetManager" at 0x8a7a88e6Af8F2A2966D0E46E09fc46E3c3943551
SupportedAssetManager deployed to: 0x8a7a88e6Af8F2A2966D0E46E09fc46E3c3943551
deploying "FlexpoolFactory" (tx: 0x12678a6a77081d6d71969de4dfce5f6f0ae07a8b6b7a5d960d3a2fb696a73f94)...: deployed at 0x8dA20f4e64Fe11FdB1addFf0C95F0D0d7C443f90 with 5373419 gas
Factory deployed to: 0x8dA20f4e64Fe11FdB1addFf0C95F0D0d7C443f90
deploying "Providers" (tx: 0xf794332bb2b208dbc2aaa919a8e2d34233d33ee42ada9a7e0758a1f4ec99c89c)...: deployed at 0xaF226c73e2a98CC9F5efefeef8f8F0Ce43f5d25D with 1367132 gas
Providers deployed to: 0xaF226c73e2a98CC9F5efefeef8f8F0Ce43f5d25D
Done in 154.58s.


22/4
C:\Users\Bobman\Desktop\web3\simplifi\contract>yarn deploy-alfa
yarn run v1.22.22
$ hardhat deploy --network alfajores --export deployments/contracts.json
Nothing to compile
No need to generate any newer typings.
reusing "RoleManager" at 0x79dF2FCc7DfDdc0C85Cc1f82B1f631b4b9D994B0
RoleManager deployed to: 0x79dF2FCc7DfDdc0C85Cc1f82B1f631b4b9D994B0
reusing "BaseAsset" at 0x476ED9B38aB286f6ce5DD70830067e645c754094
Escape contract deployed to: 0x476ED9B38aB286f6ce5DD70830067e645c754094
reusing "Escape" at 0xE9bC7eD3AaF48DC7E81c3e37DaDDb87d4059862B
Escape contract deployed to: 0xE9bC7eD3AaF48DC7E81c3e37DaDDb87d4059862B
reusing "Reserve" at 0xCe2f003766D426e404B4492A1293CD379c998b9B
Reserve contract deployed to: 0xCe2f003766D426e404B4492A1293CD379c998b9B
reusing "TokenDistributor" at 0x91EdD1Dc2c2Fa44EdFeB26bb1718c608fC68C805
TokenDistributor deployed to: 0x91EdD1Dc2c2Fa44EdFeB26bb1718c608fC68C805
reusing "Attorney" at 0x4CD0676d990ED89fC0F476252c5BEf145443aB28
Attorney contract deployed to: 0x4CD0676d990ED89fC0F476252c5BEf145443aB28
reusing "SimpliToken" at 0xf4991C26f62524073C4d8eFa57Df0Ce9bC5313Cd
SimpliToken deployed to: 0xf4991C26f62524073C4d8eFa57Df0Ce9bC5313Cd
deploying "Faucet" (tx: 0xdf59c5f70ee62897215ef1b3bb090ecf5577ae3edc191e20f075002578a1c67f)...: deployed at 0x0B097193b0B7a6bC240591351173540467f5f3d4 with 819382 gas
Escape contract deployed to: 0x0B097193b0B7a6bC240591351173540467f5f3d4
deploying "Points" (tx: 0xdd567da7a7bf86f087384e3d0e96c35b70bdb8ba083b9ca6f196acc4716af03f)...: deployed at 0x76685868B6c270d081450c488372E04F6db11494 with 623973 gas
Point contract deployed to: 0x76685868B6c270d081450c488372E04F6db11494
deploying "SafeFactory" (tx: 0x6a4bc7d983945a9c1374200288fbf32edc317e7802487832ef897edcb5bdd685)...: deployed at 0x09472cBF305BF8323cb2E8DF79C942E76aeB38cd with 1605163 gas
SafeFactory deployed to: 0x09472cBF305BF8323cb2E8DF79C942E76aeB38cd
reusing "SupportedAssetManager" at 0x8a7a88e6Af8F2A2966D0E46E09fc46E3c3943551
SupportedAssetManager deployed to: 0x8a7a88e6Af8F2A2966D0E46E09fc46E3c3943551
deploying "FlexpoolFactory" (tx: 0x39bf948861240b6dcf88e2720e57380d708971108da8e3956e406a0958a8cbeb)...: deployed at 0x39bD775C6488Cc27897D4f5A215E6D6569c3ddf1 with 5449692 gas
Factory deployed to: 0x39bD775C6488Cc27897D4f5A215E6D6569c3ddf1
deploying "Providers" (tx: 0x72be597afae01b02b8e263263eee96be644471256a84700f9f7c3468d0079723)...: deployed at 0x5082d03870CC648156820BD0b2CDb2b31C6b6433 with 1367132 gas
Providers deployed to: 0x5082d03870CC648156820BD0b2CDb2b31C6b6433
Done in 84.98s.

<!-- Transactions -->
yarn run v1.22.22
$ hardhat deploy --network alfajores --export deployments/contracts.json
Nothing to compile
No need to generate any newer typings.
reusing "RoleManager" at 0x79dF2FCc7DfDdc0C85Cc1f82B1f631b4b9D994B0
RoleManager deployed to: 0x79dF2FCc7DfDdc0C85Cc1f82B1f631b4b9D994B0
reusing "BaseAsset" at 0x476ED9B38aB286f6ce5DD70830067e645c754094
BaseAsset contract deployed to: 0x476ED9B38aB286f6ce5DD70830067e645c754094
reusing "Escape" at 0xE9bC7eD3AaF48DC7E81c3e37DaDDb87d4059862B
Escape contract deployed to: 0xE9bC7eD3AaF48DC7E81c3e37DaDDb87d4059862B
reusing "Reserve" at 0xCe2f003766D426e404B4492A1293CD379c998b9B
Reserve contract deployed to: 0xCe2f003766D426e404B4492A1293CD379c998b9B
reusing "TokenDistributor" at 0x91EdD1Dc2c2Fa44EdFeB26bb1718c608fC68C805
TokenDistributor deployed to: 0x91EdD1Dc2c2Fa44EdFeB26bb1718c608fC68C805
reusing "Attorney" at 0x4CD0676d990ED89fC0F476252c5BEf145443aB28
Attorney contract deployed to: 0x4CD0676d990ED89fC0F476252c5BEf145443aB28
reusing "SimpliToken" at 0xf4991C26f62524073C4d8eFa57Df0Ce9bC5313Cd
SimpliToken deployed to: 0xf4991C26f62524073C4d8eFa57Df0Ce9bC5313Cd
deploying "Faucet" (tx: 0x8989a0288c71ac926685b558b2af3ace625efdb2c56a77d6b54bcad6f0410780)...: deployed at 0x96A4D0d1302DBE5DEfDA6aB2a77c0FaFfC20c5A9 with 819382 gas
Faucet contract deployed to: 0x96A4D0d1302DBE5DEfDA6aB2a77c0FaFfC20c5A9
deploying "Points" (tx: 0x5d8f6c6f5e4dd66abceb474bfcfd3a1f0cd6b29357b8c65081402b89ddd4af6e)...: deployed at 0x803C0997623CF5bcb033cD03bA4B3E662aa843ed with 698350 gas
Points contract deployed to: 0x803C0997623CF5bcb033cD03bA4B3E662aa843ed
deploying "SafeFactory" (tx: 0x451cf58b185e5167f1bfbbb583a656f3f79cf51fd585555b0d2fd88a2513d576)...: deployed at 0xB868518D5E0dC52A74301e24763312840B2CdB2d with 1605163 gas
SafeFactory deployed to: 0xB868518D5E0dC52A74301e24763312840B2CdB2d
deploying "SupportedAssetManager" (tx: 0x6329b0b44443b38c72564eeb3fef6db74fcf6f65c9b1b81ecd0e74cffeb6fc46)...: deployed at 0x7fa06DeeF92926964ed0D49Cc63E689C690D1b31 with 820116 gas
SupportedAssetManager deployed to: 0x7fa06DeeF92926964ed0D49Cc63E689C690D1b31
deploying "FlexpoolFactory" (tx: 0x7497f30ad37a6f4b4aa3698dda6ed6faca832c73ff23443d4565fa5fb6ff0c0f)...: deployed at 0x3b451a9E55e2414A2f831bF3A3A910Fe5E8d1168 with 5388777 gas
Factory deployed to: 0x3b451a9E55e2414A2f831bF3A3A910Fe5E8d1168
deploying "Providers" (tx: 0xb7e5d37bbb2a7b870786b0cab6fbc720098d405bf16d34c3ff83f1917b0d6094)...: deployed at 0xF9859F3aa6d1Eab788623930aFAaFCC30E751a7a with 1367132 gas
Providers deployed to: 0xF9859F3aa6d1Eab788623930aFAaFCC30E751a7a
Done in 123.66s.

23/4 ran
C:\Users\Bobman\Desktop\web3\simplifi\contract>yarn deploy-alfa
yarn run v1.22.22
$ hardhat deploy --network alfajores --export deployments/contracts.json
Nothing to compile
No need to generate any newer typings.
reusing "RoleManager" at 0x79dF2FCc7DfDdc0C85Cc1f82B1f631b4b9D994B0
RoleManager deployed to: 0x79dF2FCc7DfDdc0C85Cc1f82B1f631b4b9D994B0
reusing "BaseAsset" at 0x476ED9B38aB286f6ce5DD70830067e645c754094
BaseAsset contract deployed to: 0x476ED9B38aB286f6ce5DD70830067e645c754094
reusing "Escape" at 0xE9bC7eD3AaF48DC7E81c3e37DaDDb87d4059862B
Escape contract deployed to: 0xE9bC7eD3AaF48DC7E81c3e37DaDDb87d4059862B
reusing "Reserve" at 0xCe2f003766D426e404B4492A1293CD379c998b9B
Reserve contract deployed to: 0xCe2f003766D426e404B4492A1293CD379c998b9B
reusing "TokenDistributor" at 0x91EdD1Dc2c2Fa44EdFeB26bb1718c608fC68C805
TokenDistributor deployed to: 0x91EdD1Dc2c2Fa44EdFeB26bb1718c608fC68C805
reusing "Attorney" at 0x4CD0676d990ED89fC0F476252c5BEf145443aB28
Attorney contract deployed to: 0x4CD0676d990ED89fC0F476252c5BEf145443aB28
reusing "SimpliToken" at 0xf4991C26f62524073C4d8eFa57Df0Ce9bC5313Cd
SimpliToken deployed to: 0xf4991C26f62524073C4d8eFa57Df0Ce9bC5313Cd
reusing "Faucet" at 0x96A4D0d1302DBE5DEfDA6aB2a77c0FaFfC20c5A9
Faucet contract deployed to: 0x96A4D0d1302DBE5DEfDA6aB2a77c0FaFfC20c5A9
reusing "Points" at 0x803C0997623CF5bcb033cD03bA4B3E662aa843ed
Points contract deployed to: 0x803C0997623CF5bcb033cD03bA4B3E662aa843ed
reusing "SafeFactory" at 0xB868518D5E0dC52A74301e24763312840B2CdB2d
SafeFactory deployed to: 0xB868518D5E0dC52A74301e24763312840B2CdB2d
reusing "SupportedAssetManager" at 0x7fa06DeeF92926964ed0D49Cc63E689C690D1b31
SupportedAssetManager deployed to: 0x7fa06DeeF92926964ed0D49Cc63E689C690D1b31
reusing "FlexpoolFactory" at 0x3b451a9E55e2414A2f831bF3A3A910Fe5E8d1168
Factory deployed to: 0x3b451a9E55e2414A2f831bF3A3A910Fe5E8d1168
deploying "Providers" (tx: 0x2dd53501b33ecebca814823c669f3fa2c7b5473dad8e031f1c88c5f3b7558436)...: deployed at 0x3252e2F4097936f078213937a356b65619341E3b with 1387006 gas
Providers deployed to: 0x3252e2F4097936f078213937a356b65619341E3b
Done in 57.83s.




C:\Users\Bobman\Desktop\web3\simplifi\contract>yarn deploy-alfa
yarn run v1.22.22
$ hardhat deploy --network alfajores --export deployments/contracts.json
Nothing to compile
No need to generate any newer typings.
reusing "RoleManager" at 0x79dF2FCc7DfDdc0C85Cc1f82B1f631b4b9D994B0
RoleManager deployed to: 0x79dF2FCc7DfDdc0C85Cc1f82B1f631b4b9D994B0
reusing "BaseAsset" at 0x476ED9B38aB286f6ce5DD70830067e645c754094
BaseAsset contract deployed to: 0x476ED9B38aB286f6ce5DD70830067e645c754094
deploying "Escape" (tx: 0x4fb1a24473719961b030e6345b8074476edba5edc94140e6f9b6ec111b47faff)...: deployed at 0x3AE3825D0562c05bA88f12cC3B69c3c70A845452 with 658695 gas
Escape contract deployed to: 0x3AE3825D0562c05bA88f12cC3B69c3c70A845452
deploying "Reserve" (tx: 0xfcc1fe0b7f71653a18e8edbac8bb3f2be9b8af8f4d5d11cdb2eab7560156d4ec)...: deployed at 0x21Aac90ac21Fa49dba988efe52a5fB1BC90D19f0 with 658911 gas
Reserve contract deployed to: 0x21Aac90ac21Fa49dba988efe52a5fB1BC90D19f0
deploying "TokenDistributor" (tx: 0xea566ff5514ff6c0d916203c3cefa61f0fe97e0b93a467ea2ec5b915080a7619)...: deployed at 0x0281a9DB774C6D1d57065faE4E53E92832309bB4 with 1831739 gas
TokenDistributor deployed to: 0x0281a9DB774C6D1d57065faE4E53E92832309bB4
deploying "Attorney" (tx: 0x08f7b69a9992a4f30a056501a4919315327cc0a6a3c01740e008d68b26a19484)...: deployed at 0xCDeB864acD240D8C1961c7dF9079D361BEE5707C with 710405 gas
Attorney contract deployed to: 0xCDeB864acD240D8C1961c7dF9079D361BEE5707C
deploying "SimpliToken" (tx: 0xd0afcd55d173641cb1e5df023a716eccfb9e681cfa841ab3988081f3e570ac19)...: deployed at 0x962289B0F4f0Aa00d84D7a55DAFC68F28C54fAC0 with 1458852 gas
SimpliToken deployed to: 0x962289B0F4f0Aa00d84D7a55DAFC68F28C54fAC0
deploying "Faucet" (tx: 0x168dcb6996b8f45c63f4984069537a106df87c5ace0e4f06c15a9077312a817f)...: deployed at 0x1DD9a1535AfE5FB5A9FdbD12ce741aE82475BC37 with 819370 gas
Faucet contract deployed to: 0x1DD9a1535AfE5FB5A9FdbD12ce741aE82475BC37
reusing "Points" at 0x803C0997623CF5bcb033cD03bA4B3E662aa843ed
Points contract deployed to: 0x803C0997623CF5bcb033cD03bA4B3E662aa843ed
reusing "SafeFactory" at 0xB868518D5E0dC52A74301e24763312840B2CdB2d
SafeFactory deployed to: 0xB868518D5E0dC52A74301e24763312840B2CdB2d
deploying "SupportedAssetManager" (tx: 0x9c43742e8eee3c6e09d8d8606cd7edf9c39d5ca490ea5cd76a86e7355462230d)...: deployed at 0xa00E598D0c6c2Ab62E74B1282c9Efd9d2010F47A with 820104 gas
SupportedAssetManager deployed to: 0xa00E598D0c6c2Ab62E74B1282c9Efd9d2010F47A
deploying "FlexpoolFactory" (tx: 0x20a5eddb2231412a5088083a7b69e84d1f36aaac717731ca5f183645e48555cf)...: deployed at 0x16f0512caA28DA6a890589819Fb70815DFd1206E with 5388777 gas
Factory deployed to: 0x16f0512caA28DA6a890589819Fb70815DFd1206E
deploying "Providers" (tx: 0x66ad775a3bb5b069dc4c04767fcff0873f961e98f2410b89a6292e038e28686e)...: deployed at 0x74C073D9d460458f2703cc27e6eD39fe3270a602 with 1387006 gas
Providers deployed to: 0x74C073D9d460458f2703cc27e6eD39fe3270a602
Done in 292.84s.

24/4
C:\Users\Bobman\Desktop\web3\simplifi\contract>yarn deploy-alfa
yarn run v1.22.22
$ hardhat deploy --network alfajores --export deployments/contracts.json
Nothing to compile
No need to generate any newer typings.
reusing "RoleManager" at 0x79dF2FCc7DfDdc0C85Cc1f82B1f631b4b9D994B0
RoleManager deployed to: 0x79dF2FCc7DfDdc0C85Cc1f82B1f631b4b9D994B0
reusing "BaseAsset" at 0x476ED9B38aB286f6ce5DD70830067e645c754094
BaseAsset contract deployed to: 0x476ED9B38aB286f6ce5DD70830067e645c754094
reusing "Escape" at 0x3AE3825D0562c05bA88f12cC3B69c3c70A845452
Escape contract deployed to: 0x3AE3825D0562c05bA88f12cC3B69c3c70A845452
reusing "Reserve" at 0x21Aac90ac21Fa49dba988efe52a5fB1BC90D19f0
Reserve contract deployed to: 0x21Aac90ac21Fa49dba988efe52a5fB1BC90D19f0
reusing "TokenDistributor" at 0x0281a9DB774C6D1d57065faE4E53E92832309bB4
TokenDistributor deployed to: 0x0281a9DB774C6D1d57065faE4E53E92832309bB4
reusing "Attorney" at 0xCDeB864acD240D8C1961c7dF9079D361BEE5707C
Attorney contract deployed to: 0xCDeB864acD240D8C1961c7dF9079D361BEE5707C
reusing "SimpliToken" at 0x962289B0F4f0Aa00d84D7a55DAFC68F28C54fAC0
SimpliToken deployed to: 0x962289B0F4f0Aa00d84D7a55DAFC68F28C54fAC0
deploying "Faucet" (tx: 0xb71ad3e599c6cd6173ed1b2a49bdcba70bf5d2f3e41610c8aa08a54a532b9071)...: deployed at 0xEd8E71619bae50624Db76a986e0A7E4821F17ef2 with 819370 gas
Faucet contract deployed to: 0xEd8E71619bae50624Db76a986e0A7E4821F17ef2
deploying "Points" (tx: 0xa13cdade9febe50b3cb8ec3a7ce5e4c0480c34dca450e0253010a093a55015c0)...: deployed at 0x5aD28E7E90DAfB40468FCa3F19B4771e33C795B5 with 698350 gas
Points contract deployed to: 0x5aD28E7E90DAfB40468FCa3F19B4771e33C795B5
deploying "SafeFactory" (tx: 0x42c58fba0be64caeaaa51dd80e54e7548d8e80596672be71c7795ff8ee613b62)...: deployed at 0x52Efc8EDcceC2282e0B9bf68586e2Daad6021Be7 with 1605163 gas
SafeFactory deployed to: 0x52Efc8EDcceC2282e0B9bf68586e2Daad6021Be7
reusing "SupportedAssetManager" at 0xa00E598D0c6c2Ab62E74B1282c9Efd9d2010F47A
SupportedAssetManager deployed to: 0xa00E598D0c6c2Ab62E74B1282c9Efd9d2010F47A
deploying "FlexpoolFactory" (tx: 0x88cd1e4a3a2b9c21a5425b424974e370ba26d9849714c8c2ff6f091dcfe9b46b)...: deployed at 0x66ECA3234F0Aec3D69252B3c3CEA27916cfF0511 with 5445267 gas
Factory deployed to: 0x66ECA3234F0Aec3D69252B3c3CEA27916cfF0511
deploying "Providers" (tx: 0x6abdaa5b5f31ef76565c99ca6a92a8caeb101a9ce96faf5b0897adb3c57d2008)...: deployed at 0x2DcAD71e4487c32c6F6763C59088E4b61fF0af3a with 1402338 gas
Providers deployed to: 0x2DcAD71e4487c32c6F6763C59088E4b61fF0af3a
Done in 116.75s