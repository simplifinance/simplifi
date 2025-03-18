export const withdrawFeeAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "asset",
        "type": "address"
      }
    ],
    "name": "withdrawFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  },
] as const;

export const withdrawCollateralAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "rId",
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

export const getUserDataAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "rId",
        "type": "uint256"
      }
    ],
    "name": "getUserData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bool",
            "name": "access",
            "type": "bool"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "withdrawable",
                "type": "uint256"
              }
            ],
            "internalType": "struct IBank.Collateral",
            "name": "collateral",
            "type": "tuple"
          }
        ],
        "internalType": "struct IBank.ViewUserData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

export const getBankDataAbi = [
  {
    "inputs": [],
    "name": "getData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "totalClients",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "aggregateFee",
            "type": "uint256"
          }
        ],
        "internalType": "struct IBank.ViewData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

export const depositCollateralAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "rId",
        "type": "uint256"
      }
    ],
    "name": "depositCollateral",
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

export const getCollateralQuoteAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "unit",
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
        "name": "unit",
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

export const removeLiquidityPoolAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "unit",
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
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "routers",
    "outputs": [
      {
        "internalType": "enum C3.Router",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

export const paybackAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "unit",
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
        "name": "unit",
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
        "name": "unit",
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
        "name": "asset",
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
        "name": "asset",
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
        "name": "unit",
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

export const getRecordAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "rId",
        "type": "uint256"
      }
    ],
    "name": "getRecord",
    "outputs": [
      {
        "components": [
          {
            "components": [
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
                  },
                  {
                    "internalType": "uint256",
                    "name": "cSlot",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "allGh",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "userCount",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct C3.Uints",
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
                    "name": "unitId",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "rId",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct C3.Uint256s",
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
                    "name": "bank",
                    "type": "address"
                  },
                  {
                    "internalType": "address",
                    "name": "admin",
                    "type": "address"
                  }
                ],
                "internalType": "struct C3.Addresses",
                "name": "addrs",
                "type": "tuple"
              },
              {
                "internalType": "enum C3.Status",
                "name": "status",
                "type": "uint8"
              },
              {
                "internalType": "enum C3.Router",
                "name": "router",
                "type": "uint8"
              },
              {
                "internalType": "enum C3.FuncTag",
                "name": "stage",
                "type": "uint8"
              }
            ],
            "internalType": "struct C3.Pool",
            "name": "pool",
            "type": "tuple"
          },
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
            "internalType": "struct C3.Contributor[]",
            "name": "cData",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct C3.ReadDataReturnValue",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

export const getPoolDataAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "unitId",
        "type": "uint256"
      }
    ],
    "name": "getPoolData",
    "outputs": [
      {
        "components": [
          {
            "components": [
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
                  },
                  {
                    "internalType": "uint256",
                    "name": "cSlot",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "allGh",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "userCount",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct C3.Uints",
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
                    "name": "unitId",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "rId",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct C3.Uint256s",
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
                    "name": "bank",
                    "type": "address"
                  },
                  {
                    "internalType": "address",
                    "name": "admin",
                    "type": "address"
                  }
                ],
                "internalType": "struct C3.Addresses",
                "name": "addrs",
                "type": "tuple"
              },
              {
                "internalType": "enum C3.Status",
                "name": "status",
                "type": "uint8"
              },
              {
                "internalType": "enum C3.Router",
                "name": "router",
                "type": "uint8"
              },
              {
                "internalType": "enum C3.FuncTag",
                "name": "stage",
                "type": "uint8"
              }
            ],
            "internalType": "struct C3.Pool",
            "name": "pool",
            "type": "tuple"
          },
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
            "internalType": "struct C3.Contributor[]",
            "name": "cData",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct C3.ReadDataReturnValue",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

export const getFactoryDataAbi = [
  {
    "inputs": [],
    "name": "getFactoryData",
    "outputs": [
      {
        "components": [
          {
            "components": [
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
            "internalType": "struct IFactory.Analytics",
            "name": "analytics",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "feeTo",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "assetAdmin",
                "type": "address"
              },
              {
                "internalType": "uint16",
                "name": "makerRate",
                "type": "uint16"
              },
              {
                "internalType": "address",
                "name": "bankFactory",
                "type": "address"
              }
            ],
            "internalType": "struct IFactory.ContractData",
            "name": "contractData",
            "type": "tuple"
          },
          {
            "internalType": "uint256",
            "name": "currentEpoches",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "recordEpoches",
            "type": "uint256"
          }
        ],
        "internalType": "struct IFactory.ViewFactoryData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

export const allowanceAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
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

export const balanceOfAbi = [
  {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
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

export const symbolAbi = [
{
  "inputs": [],
  "name": "symbol",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
] as const;

export const transferFromAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
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
