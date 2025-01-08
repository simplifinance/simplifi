export const analyticAbi = [
    {
        "inputs": [],
        "name": "analytics",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "tvlInXFI",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tvlInUsd",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalPermissioned",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalPermissionless",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
    },
] as const;

export const getCollateralQuoteAbi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "epochId",
          "type": "uint256"
        }
      ],
      "name": "getCollaterlQuote",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "collateral",
          "type": "uint256"
        },
        {
          "internalType": "uint24",
          "name": "colCoverage",
          "type": "uint24"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
] as const;

export const getCurrentDebtAbi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "epochId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "target",
          "type": "address"
        }
      ],
      "name": "getCurrentDebt",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
] as const;
  
export const profileAbi = [
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

export const getPoolsAbi = [
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
                  },
                  {
                    "internalType": "bool",
                    "name": "sentQuota",
                    "type": "bool"
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

export const withdrawCollateralAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "epochId",
        "type": "uint256"
      }
    ],
    "name": "withdrawCollateral",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
] as const;

export const removeLiquidityPoolAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "epochId",
        "type": "uint256"
      }
    ],
    "name": "removeLiquidityPool",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
] as const;

export const paybackAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "epochId",
        "type": "uint256"
      }
    ],
    "name": "payback",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
] as const;

export const liquidateAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "epochId",
        "type": "uint256"
      }
    ],
    "name": "liquidate",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
] as const;

export const getFinanceAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "epochId",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "daysOfUseInHr",
        "type": "uint8"
      }
    ],
    "name": "getFinance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
] as const;

export const createPermissionlessLiquidityPoolAbi = [
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "intRate",
        "type": "uint16"
      },
      {
        "internalType": "uint8",
        "name": "quorum",
        "type": "uint8"
      },
      {
        "internalType": "uint16",
        "name": "durationInHours",
        "type": "uint16"
      },
      {
        "internalType": "uint24",
        "name": "colCoverage",
        "type": "uint24"
      },
      {
        "internalType": "uint256",
        "name": "unitLiquidity",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "liquidAsset",
        "type": "address"
      }
    ],
    "name": "createPermissionlessPool",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
] as const;

export const createPermissionedLiquidityPoolAbi = [
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "intRate",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "durationInHours",
        "type": "uint16"
      },
      {
        "internalType": "uint24",
        "name": "colCoverage",
        "type": "uint24"
      },
      {
        "internalType": "uint256",
        "name": "unitLiquidity",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "liquidAsset",
        "type": "address"
      },
      {
        "internalType": "address[]",
        "name": "contributors",
        "type": "address[]"
      }
    ],
    "name": "createPermissionedPool",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
] as const;

export const addToPoolAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "epochId",
        "type": "uint256"
      }
    ],
    "name": "joinAPool",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
] as const;
