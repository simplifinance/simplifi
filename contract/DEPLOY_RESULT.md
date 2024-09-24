```
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
```

444444444444444444