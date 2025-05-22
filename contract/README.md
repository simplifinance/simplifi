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