# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```



<!-- $ hardhat deploy --network alfajores --export deployments/contracts.json
Generating typings for: 1 artifacts in dir: typechain-types for target: ethers-v6
Successfully generated 52 typings!
Compiled 1 Solidity file successfully (evm target: constantinople).
NetworkName: alfajores
reusing "RoleManager" at 0x16884C8C6a494527f4541007A46239218e76F661
RoleManager deployed to: 0x16884C8C6a494527f4541007A46239218e76F661
reusing "BaseAsset" at 0x7779C32c796080e2C59A6696EB6afE783911e374
BaseAsset contract deployed to: 0x7779C32c796080e2C59A6696EB6afE783911e374
reusing "Escape" at 0xF6fB332d09763D7419FD463dd171304C96429311
Escape contract deployed to: 0xF6fB332d09763D7419FD463dd171304C96429311
reusing "Reserve" at 0xfa2Ab6F26cd0210F0f1e77Da4be357E129547f5F
Reserve contract deployed to: 0xfa2Ab6F26cd0210F0f1e77Da4be357E129547f5F
reusing "TokenDistributor" at 0x02A61feaCdB52bF45E86E39333aA3BEa818354e5
TokenDistributor deployed to: 0x02A61feaCdB52bF45E86E39333aA3BEa818354e5
reusing "Attorney" at 0x523C9B67F3Dd1C271Ed7D3dfF7DE08538f82A11B
Attorney contract deployed to: 0x523C9B67F3Dd1C271Ed7D3dfF7DE08538f82A11B
reusing "SimpliToken" at 0xFc9685ecaf3063002E97595A5Fe0D037a9d8A75B
SimpliToken deployed to: 0xFc9685ecaf3063002E97595A5Fe0D037a9d8A75B
reusing "Faucet" at 0x8A4AD5c647c7365BB696a6F6dCA1E598dB981db7
Faucet contract deployed to: 0x8A4AD5c647c7365BB696a6F6dCA1E598dB981db7
reusing "Points" at 0xBEfE9A70f4AE058C445EC0A06269aB4aa4356b9F
Points contract deployed to: 0xBEfE9A70f4AE058C445EC0A06269aB4aa4356b9F
reusing "SafeFactory" at 0xa398e5b7Ca6a9F87AE02AEC1B8060A92eF05eD49
SafeFactory deployed to: 0xa398e5b7Ca6a9F87AE02AEC1B8060A92eF05eD49
reusing "WrappedNative" at 0x152238bc1a9498464CA6ad055C4dcD33D495Be64
WrappedNative token deployed to: 0x152238bc1a9498464CA6ad055C4dcD33D495Be64
supportedManagerAndOracleArgs [
  [
    '0xFc9685ecaf3063002E97595A5Fe0D037a9d8A75B',
    '0x152238bc1a9498464CA6ad055C4dcD33D495Be64'
  ],
  '0x16884C8C6a494527f4541007A46239218e76F661',
  [
    {
      latestPrice: 0n,
      timestampOflatestPrice: 0n,
      oracleAddress: '0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946',
      pair: 'SIMPL/USD'
    },
    {
      latestPrice: 0n,
      timestampOflatestPrice: 0n,
      oracleAddress: '0x0568fD19986748cEfF3301e55c0eb1E729E0Ab7e',
      pair: 'CELO/USD'
    }
  ]
]
priceQuoteAsset 0x152238bc1a9498464CA6ad055C4dcD33D495Be64
deploying "CeloSupportedAssetManager" (tx: 0x882c66c870e9a8bf130c1790b18958b54be94d3e3a5a5c5b185f7eb05d664774)...: deployed at 0xf278e894173340d1D38260845Cd3e3aCB0fee8fA with 1355707 gas
SupportedAssetManager deployed to: 0xf278e894173340d1D38260845Cd3e3aCB0fee8fA
deploying "FlexpoolFactory" (tx: 0xb2a1c7a09f29f1c2c0f7b3e29f2bf2d991e06af5c3ed6dcde02aed296db6d483)...: deployed at 0x6551B4e0E9E413837bA451a3F3932e5c18711d31 with 5249788 gas
Factory deployed to: 0x6551B4e0E9E413837bA451a3F3932e5c18711d31
deploying "Providers" (tx: 0xa7c0100ca2928a1d6fcebffdd69ffa551b901e0853ffc4446909cde48ab79deb)...: deployed at 0x690195965032438A7E0B0C67E71a1F5027987BEb with 1402338 gas
Providers deployed to: 0x690195965032438A7E0B0C67E71a1F5027987BEb
Price 0
InTime false
Done in 85.76s. -->

<!-- 
"0x205c278cFa62aEd3c3661C58672eC4eD9DDe58C8", Celobased
"0xdFA25197AC1298AaE3B497484e99e98c72b4419a", WrappedAsset
"0x7C0408BC8c6f217fF3D2e89D67f4D7E964ec6282" Providers -->



<!-- C:\Users\Bobman\Desktop\web3\simplifi\contract>yarn deploy-alfa
yarn run v1.22.22
$ hardhat deploy --network alfajores --export deployments/contracts.json && node sync-abis.js
Nothing to compile
No need to generate any newer typings.
reusing "RoleManager" at 0xB255A1e088Dffb63155a8B4baDA12e5572e11376
RoleManager deployed to: 0xB255A1e088Dffb63155a8B4baDA12e5572e11376
reusing "BaseAsset" at 0x210e77886554170bBa347db97CA64E2B9258124E
BaseAsset contract deployed to: 0x210e77886554170bBa347db97CA64E2B9258124E
reusing "Escape" at 0xd7d9d1A748B7f4E1b6146554cA9FA846d400fDae
Escape contract deployed to: 0xd7d9d1A748B7f4E1b6146554cA9FA846d400fDae
reusing "Reserve" at 0x855cf61d408B9c7A94d20324d83ac12e28f3c5E0
Reserve contract deployed to: 0x855cf61d408B9c7A94d20324d83ac12e28f3c5E0
reusing "TokenDistributor" at 0xa952784B6d93ddB16C9b7b1DedE28efe39D14e2f
TokenDistributor deployed to: 0xa952784B6d93ddB16C9b7b1DedE28efe39D14e2f
reusing "Attorney" at 0x424B80b6D7Fa4d6193D813b8564d57a29162174C
Attorney contract deployed to: 0x424B80b6D7Fa4d6193D813b8564d57a29162174C
reusing "SimpliToken" at 0x152f0E7dD92F01E66295ED2214c4B5A6b3737D6C
SimpliToken deployed to: 0x152f0E7dD92F01E66295ED2214c4B5A6b3737D6C
reusing "Faucet" at 0x129568fe5620790B9A04b0CbE639A675Eb542E76
Faucet contract deployed to: 0x129568fe5620790B9A04b0CbE639A675Eb542E76
reusing "Points" at 0x0A8e93768c85e788A3fC67A4Af0d3C98A974c9D7
Points contract deployed to: 0x0A8e93768c85e788A3fC67A4Af0d3C98A974c9D7
deploying "SafeFactory" (tx: 0xb32b43c83d115fad8ec2bdf17f5fb52add53c5524f194e1abd8593dc9e095869)...: deployed at 0x49DD23Df148240b603dcEA49fae6Bd425C0A7EFd with 2048478 gas
SafeFactory deployed to: 0x49DD23Df148240b603dcEA49fae6Bd425C0A7EFd
NetworkName: alfajores
deploying "WrappedNative" (tx: 0xfa6e0b7477ce8f865c801cc42e14464253d78ed445c357ae86bf3d0e45afc70b)...: deployed at 0xC163DC8A8DAb0f6a3a9705df2DE43266eD281b8a with 700853 gas
WrappedNative token deployed to: 0xC163DC8A8DAb0f6a3a9705df2DE43266eD281b8a
deploying "SupportedAssetManager" (tx: 0x2f85138ec383631dfe21924f96106ce6c2975625a6d1aed06e258116bc07ab39)...: deployed at 0xe67EaD1582465d64295698693801493A7b06c7aF with 906829 gas
SupportedAssetManager contract deployed to: 0xe67EaD1582465d64295698693801493A7b06c7aF
Deploying StateManager
deploying "StateManager" (tx: 0x7ad2f2b1d8acb8bba23e9d374164f40ff10476c2d1c84a9db7c60b8a455e886f)...: deployed at 0x2Bb7897aa4AffD7661b5f22b16244b6Eb7CAfD72 with 473932 gas
Factory deployed to: 0x2Bb7897aa4AffD7661b5f22b16244b6Eb7CAfD72
Deploying CeloBased
deploying "CeloBased" (tx: 0xa6812c7bf127baedff0267bc16e105cc7964740394af5ab7d29c6b1aacbd7674)...: deployed at 0x8635ba601A3a519d540a14d773EE09486E584606 with 5283743 gas
Factory deployed to: 0x8635ba601A3a519d540a14d773EE09486E584606
deploying "Providers" (tx: 0xec871e297bb9c99a9076c6bddfd1f1f45f66a3e0da76a8fb1b0f79489aa9c952)...: deployed at 0x813F94222a056B3548bD8C332550d3F79EeA280C with 1781102 gas
Providers deployed to: 0x813F94222a056B3548bD8C332550d3F79EeA280C
Confirmation block 1
Quote 37474773
🔄 Syncing contracts data to Next App...
✅ Data synchronization completed!
Done in 179.50s. -->



<!-- C:\Users\Bobman\Desktop\web3\simplifi\contract>yarn deploy-alfa
yarn run v1.22.22
$ hardhat deploy --network alfajores --export deployments/contracts.json && node sync-abis.js
Nothing to compile
No need to generate any newer typings.
reusing "RoleManager" at 0xB255A1e088Dffb63155a8B4baDA12e5572e11376
RoleManager deployed to: 0xB255A1e088Dffb63155a8B4baDA12e5572e11376
reusing "BaseAsset" at 0x210e77886554170bBa347db97CA64E2B9258124E
BaseAsset contract deployed to: 0x210e77886554170bBa347db97CA64E2B9258124E
reusing "Escape" at 0xd7d9d1A748B7f4E1b6146554cA9FA846d400fDae
Escape contract deployed to: 0xd7d9d1A748B7f4E1b6146554cA9FA846d400fDae
reusing "Reserve" at 0x855cf61d408B9c7A94d20324d83ac12e28f3c5E0
Reserve contract deployed to: 0x855cf61d408B9c7A94d20324d83ac12e28f3c5E0
reusing "TokenDistributor" at 0xa952784B6d93ddB16C9b7b1DedE28efe39D14e2f
TokenDistributor deployed to: 0xa952784B6d93ddB16C9b7b1DedE28efe39D14e2f
reusing "Attorney" at 0x424B80b6D7Fa4d6193D813b8564d57a29162174C
Attorney contract deployed to: 0x424B80b6D7Fa4d6193D813b8564d57a29162174C
reusing "SimpliToken" at 0x152f0E7dD92F01E66295ED2214c4B5A6b3737D6C
SimpliToken deployed to: 0x152f0E7dD92F01E66295ED2214c4B5A6b3737D6C
reusing "Faucet" at 0x02ac9244bDe73DD1324d19F376DDF6fA67Af2b9D
Faucet contract deployed to: 0x02ac9244bDe73DD1324d19F376DDF6fA67Af2b9D
reusing "Points" at 0xcef62f6c3B044527b571b96256F3Af82C65d23E3
Points contract deployed to: 0xcef62f6c3B044527b571b96256F3Af82C65d23E3
reusing "SafeFactory" at 0xCb46c7Ed31555eCdE84F5906881EC0f1cc0CdD03
SafeFactory deployed to: 0xCb46c7Ed31555eCdE84F5906881EC0f1cc0CdD03
NetworkName: alfajores
reusing "WrappedNative" at 0x3039894384187Eb107F9052fef12787BAf133b70
WrappedNative token deployed to: 0x3039894384187Eb107F9052fef12787BAf133b70
reusing "SupportedAssetManager" at 0x3FC994C5FB639F389B083963657d36BF681E0a0A
SupportedAssetManager contract deployed to: 0x3FC994C5FB639F389B083963657d36BF681E0a0A
Deploying StateManager
reusing "StateManager" at 0xe2DcF31F68a678C30e06CBB37ec6a23140F0cec2
Factory deployed to: 0xe2DcF31F68a678C30e06CBB37ec6a23140F0cec2
reusing "CeloBased" at 0x4a5bBda280D38644b08bcBdD413E80ED07faD60d
Factory deployed to: 0x4a5bBda280D38644b08bcBdD413E80ED07faD60d
reusing "Providers" at 0x727ED1dF4421f45456aC04A67275895ED13905E9
Providers deployed to: 0x727ED1dF4421f45456aC04A67275895ED13905E9
Confirmation block 3
Quote 36153132
🔄 Syncing contracts data to Next App...
✅ Data synchronization completed!
Done in 41.10s. -->