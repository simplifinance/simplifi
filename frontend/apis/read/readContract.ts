import type { WagmiConfig, Address, TrxnResult } from "@/interfaces";
import { readContract as read } from "wagmi/actions";
import { getFactoryAddress } from "../contractAddress";

const address = getFactoryAddress();

export async function getProfile({config, epochId, account} : {config: WagmiConfig, epochId: bigint, account: Address}) {
  console.log("EpochId", epochId);
  return await read(config, {
    abi: profileAbi,
    address, 
    functionName: "getProfile",
    args: [epochId, account]
  });
}

export async function getEpoches({config} : {config: WagmiConfig}) {
  return await read(config, {
    abi: getPoolsAbi,
    address, 
    functionName: "getPoolFromAllEpoches",
    args: []
  });
}

export async function getContractData(arg: {config: WagmiConfig}) : Promise<TrxnResult> 
{
  const { config } = arg;
  const pools = await getEpoches({config});
  return { pools }
}

const profileAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "epochId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getProfile",
    "outputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "durOfChoice",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "expInterest",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "payDate",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "turnTime",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "loan",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "colBals",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "id",
                "type": "address"
              }
            ],
            "internalType": "struct Common.Contributor",
            "name": "cData",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "admin",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "member",
                "type": "bool"
              }
            ],
            "internalType": "struct Common.Rank",
            "name": "rank",
            "type": "tuple"
          },
          {
            "internalType": "uint8",
            "name": "slot",
            "type": "uint8"
          }
        ],
        "internalType": "struct Common.ContributorData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

const getPoolsAbi = [
  {
    "inputs": [],
    "name": "getPoolFromAllEpoches",
    "outputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
              }
            ],
            "internalType": "struct Counters.Counter",
            "name": "userCount",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "quorum",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "selector",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "colCoverage",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "duration",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "intRate",
                "type": "uint256"
              }
            ],
            "internalType": "struct Common.Uints",
            "name": "uints",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "fullInterest",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "intPerSec",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "unit",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "currentPool",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "epochId",
                "type": "uint256"
              }
            ],
            "internalType": "struct Common.Uint256s",
            "name": "uint256s",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "asset",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "lastPaid",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "strategy",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "admin",
                "type": "address"
              }
            ],
            "internalType": "struct Common.Addresses",
            "name": "addrs",
            "type": "tuple"
          },
          {
            "internalType": "uint256",
            "name": "allGh",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isPermissionless",
            "type": "bool"
          },
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "durOfChoice",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "expInterest",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "payDate",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "turnTime",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "loan",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "colBals",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address",
                    "name": "id",
                    "type": "address"
                  }
                ],
                "internalType": "struct Common.Contributor",
                "name": "cData",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "bool",
                    "name": "admin",
                    "type": "bool"
                  },
                  {
                    "internalType": "bool",
                    "name": "member",
                    "type": "bool"
                  }
                ],
                "internalType": "struct Common.Rank",
                "name": "rank",
                "type": "tuple"
              },
              {
                "internalType": "uint8",
                "name": "slot",
                "type": "uint8"
              }
            ],
            "internalType": "struct Common.ContributorData[]",
            "name": "cData",
            "type": "tuple[]"
          },
          {
            "internalType": "enum Common.FuncTag",
            "name": "stage",
            "type": "uint8"
          }
        ],
        "internalType": "struct Common.Pool[]",
        "name": "pools",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;