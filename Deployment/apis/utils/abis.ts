
export const getProfileAbi = [
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
    "name": "getProfile",
    "outputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "uint32",
                "name": "paybackTime",
                "type": "uint32"
              },
              {
                "internalType": "uint32",
                "name": "turnStartTime",
                "type": "uint32"
              },
              {
                "internalType": "uint32",
                "name": "getFinanceTime",
                "type": "uint32"
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
            "name": "profile",
            "type": "tuple"
          },
          {
            "internalType": "uint8",
            "name": "slot",
            "type": "uint8"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "slot",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "rate",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "earnStartDate",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "account",
                "type": "address"
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
                  }
                ],
                "internalType": "struct Common.Interest",
                "name": "accruals",
                "type": "tuple"
              }
            ],
            "internalType": "struct Common.Provider[]",
            "name": "providers",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct Common.ContributorReturnValue",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

export const getSafeDataAbi = [
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

export const getCollateralQuoteAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "unit",
        "type": "uint256"
      }
    ],
    "name": "getCollateralQuote",
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
      }
    ],
    "name": "getCurrentDebt",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "debt",
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
    "name": "closePool",
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
    "stateMutability": "nonpayable",
    "type": "function"
  },
] as const;

export const createPoolAbi = [
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "users",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "unit",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "maxQuorum",
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
        "internalType": "bool",
        "name": "isPermissionless",
        "type": "bool"
      },
      {
        "internalType": "contract IERC20",
        "name": "colAsset",
        "type": "address"
      }
    ],
    "name": "createPool",
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

export const contributeAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "unit",
        "type": "uint256"
      }
    ],
    "name": "contribute",
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

export const getPoolRecordAbi = [
  {
    "inputs": [
      {
        "internalType": "uint96",
        "name": "recordId",
        "type": "uint96"
      }
    ],
    "name": "getPoolRecord",
    "outputs": [
      {
        "components": [
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "uint8",
                    "name": "maxQuorum",
                    "type": "uint8"
                  },
                  {
                    "internalType": "uint8",
                    "name": "selector",
                    "type": "uint8"
                  },
                  {
                    "internalType": "uint24",
                    "name": "colCoverage",
                    "type": "uint24"
                  },
                  {
                    "internalType": "uint32",
                    "name": "duration",
                    "type": "uint32"
                  },
                  {
                    "internalType": "uint8",
                    "name": "allGh",
                    "type": "uint8"
                  },
                  {
                    "internalType": "uint8",
                    "name": "userCount",
                    "type": "uint8"
                  }
                ],
                "internalType": "struct Common.Low",
                "name": "low",
                "type": "tuple"
              },
              {
                "components": [
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
                    "internalType": "uint96",
                    "name": "recordId",
                    "type": "uint96"
                  },
                  {
                    "internalType": "uint96",
                    "name": "unitId",
                    "type": "uint96"
                  }
                ],
                "internalType": "struct Common.Big",
                "name": "big",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "contract IERC20",
                    "name": "colAsset",
                    "type": "address"
                  },
                  {
                    "internalType": "address",
                    "name": "lastPaid",
                    "type": "address"
                  },
                  {
                    "internalType": "address",
                    "name": "safe",
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
                "internalType": "enum Common.Router",
                "name": "router",
                "type": "uint8"
              },
              {
                "internalType": "enum Common.Stage",
                "name": "stage",
                "type": "uint8"
              },
              {
                "internalType": "enum Common.Status",
                "name": "status",
                "type": "uint8"
              }
            ],
            "internalType": "struct Common.Pool",
            "name": "pool",
            "type": "tuple"
          },
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "uint32",
                    "name": "paybackTime",
                    "type": "uint32"
                  },
                  {
                    "internalType": "uint32",
                    "name": "turnStartTime",
                    "type": "uint32"
                  },
                  {
                    "internalType": "uint32",
                    "name": "getFinanceTime",
                    "type": "uint32"
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
                "name": "profile",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                  },
                  {
                    "internalType": "bool",
                    "name": "isMember",
                    "type": "bool"
                  },
                  {
                    "internalType": "bool",
                    "name": "isAdmin",
                    "type": "bool"
                  }
                ],
                "internalType": "struct Common.Slot",
                "name": "slot",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "slot",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "rate",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "earnStartDate",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
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
                      }
                    ],
                    "internalType": "struct Common.Interest",
                    "name": "accruals",
                    "type": "tuple"
                  }
                ],
                "internalType": "struct Common.Provider[]",
                "name": "providers",
                "type": "tuple[]"
              }
            ],
            "internalType": "struct Common.ContributorReturnValue[]",
            "name": "cData",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct Common.ReadPoolDataReturnValue",
        "name": "result",
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
        "internalType": "uint96",
        "name": "unitId",
        "type": "uint96"
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
                    "internalType": "uint8",
                    "name": "maxQuorum",
                    "type": "uint8"
                  },
                  {
                    "internalType": "uint8",
                    "name": "selector",
                    "type": "uint8"
                  },
                  {
                    "internalType": "uint24",
                    "name": "colCoverage",
                    "type": "uint24"
                  },
                  {
                    "internalType": "uint32",
                    "name": "duration",
                    "type": "uint32"
                  },
                  {
                    "internalType": "uint8",
                    "name": "allGh",
                    "type": "uint8"
                  },
                  {
                    "internalType": "uint8",
                    "name": "userCount",
                    "type": "uint8"
                  }
                ],
                "internalType": "struct Common.Low",
                "name": "low",
                "type": "tuple"
              },
              {
                "components": [
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
                    "internalType": "uint96",
                    "name": "recordId",
                    "type": "uint96"
                  },
                  {
                    "internalType": "uint96",
                    "name": "unitId",
                    "type": "uint96"
                  }
                ],
                "internalType": "struct Common.Big",
                "name": "big",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "contract IERC20",
                    "name": "colAsset",
                    "type": "address"
                  },
                  {
                    "internalType": "address",
                    "name": "lastPaid",
                    "type": "address"
                  },
                  {
                    "internalType": "address",
                    "name": "safe",
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
                "internalType": "enum Common.Router",
                "name": "router",
                "type": "uint8"
              },
              {
                "internalType": "enum Common.Stage",
                "name": "stage",
                "type": "uint8"
              },
              {
                "internalType": "enum Common.Status",
                "name": "status",
                "type": "uint8"
              }
            ],
            "internalType": "struct Common.Pool",
            "name": "pool",
            "type": "tuple"
          },
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "uint32",
                    "name": "paybackTime",
                    "type": "uint32"
                  },
                  {
                    "internalType": "uint32",
                    "name": "turnStartTime",
                    "type": "uint32"
                  },
                  {
                    "internalType": "uint32",
                    "name": "getFinanceTime",
                    "type": "uint32"
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
                "name": "profile",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                  },
                  {
                    "internalType": "bool",
                    "name": "isMember",
                    "type": "bool"
                  },
                  {
                    "internalType": "bool",
                    "name": "isAdmin",
                    "type": "bool"
                  }
                ],
                "internalType": "struct Common.Slot",
                "name": "slot",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "slot",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "rate",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "earnStartDate",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
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
                      }
                    ],
                    "internalType": "struct Common.Interest",
                    "name": "accruals",
                    "type": "tuple"
                  }
                ],
                "internalType": "struct Common.Provider[]",
                "name": "providers",
                "type": "tuple[]"
              }
            ],
            "internalType": "struct Common.ContributorReturnValue[]",
            "name": "cData",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct Common.ReadPoolDataReturnValue",
        "name": "result",
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
                "name": "tvlCollateral",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "tvlBase",
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
            "internalType": "struct Common.Analytics",
            "name": "analytics",
            "type": "tuple"
          },
          {
            "internalType": "uint16",
            "name": "makerRate",
            "type": "uint16"
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
        "internalType": "struct Common.ViewFactoryData",
        "name": "data",
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

export const provideLiquidityAbi = [
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "rate",
        "type": "uint16"
      }
    ],
    "name": "provideLiquidity",
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

export const removeLiquidityAbi = [
  {
    "inputs": [],
    "name": "removeLiquidity",
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

export const borrowAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "providersSlots",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "borrow",
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

export const getProvidersAbi = [
  {
    "inputs": [],
    "name": "getProviders",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "slot",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "earnStartDate",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
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
              }
            ],
            "internalType": "struct Common.Interest",
            "name": "accruals",
            "type": "tuple"
          }
        ],
        "internalType": "struct Common.Provider[]",
        "name": "prov",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

export const lockTokenAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_routeTo",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "lockToken",
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

export const unlockTokenAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "unlockToken",
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

export const panicUnlockTokenAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "lostAccount",
        "type": "address"
      }
    ],
    "name": "panicUnlock",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
] as const;

export const activateRewardAbi = [
  {
    "inputs": [],
    "name": "activateReward",
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

export const getPointAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getPoint",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "contributor",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "creator",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "referrals",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "user",
            "type": "address"
          }
        ],
        "internalType": "struct Common.Point",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

export const getPointsAbi = [
  {
    "inputs": [],
    "name": "getPoints",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "key",
            "type": "string"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "contributor",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "creator",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "referrals",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "user",
                "type": "address"
              },
              {
                "internalType": "enum Common.Phase",
                "name": "phase",
                "type": "uint8"
              }
            ],
            "internalType": "struct Common.Point[]",
            "name": "value",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct Common.PointsReturnValue[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

export const registerToEarnPointAbi = [
  {
    "inputs": [],
    "name": "registerToEarnPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
] as const;

export const faucetAbi = [
  {
    "inputs": [],
    "name": "claimTestTokens",
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

export const approveAbi = [
  {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
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
        "name": "recordId",
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
            "internalType": "uint256",
            "name": "collateralBalance",
            "type": "uint256"
          }
        ],
        "internalType": "struct ISafe.ViewUserData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

export const getSupportedAssetsAbi = [
  {
    "inputs": [],
    "name": "getSupportedAssets",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "id",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "symbol",
            "type": "string"
          }
        ],
        "internalType": "struct SupportedAssetManager.SupportedAsset[]",
        "name": "_assets",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

export const approveCUSDAbi = [
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
] as const;

export const withdrawCUSDAbi = [
  {
    "constant": false,
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
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },  
] as const;

export const allowanceCUSDAbi = [
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "accountOwner",
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
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
] as const;

export const supportAssetAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_asset",
        "type": "address"
      }
    ],
    "name": "supportAsset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
] as const;

export const editPoolAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "unit",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "maxQuorum",
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
      }
    ],
    "name": "editPool",
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