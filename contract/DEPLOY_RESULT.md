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