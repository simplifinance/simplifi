/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  AbstractRouter,
  AbstractRouterInterface,
} from "../../../contracts/abstracts/AbstractRouter";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "AddressInsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "AllMemberIsPaid",
    type: "error",
  },
  {
    inputs: [],
    name: "EnforcedPause",
    type: "error",
  },
  {
    inputs: [],
    name: "ExpectedPause",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedInnerCall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "enum Common.FuncTag",
        name: "",
        type: "uint8",
      },
    ],
    name: "FunctionAlreadyLocked",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "enum Common.FuncTag",
        name: "",
        type: "uint8",
      },
    ],
    name: "FunctionAlreadyUnlocked",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    name: "FunctionNotCallable",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "IndexOutOfBound",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "actual",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expected",
        type: "uint256",
      },
    ],
    name: "InsufficientCollateral",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientFund",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "InvalidDenominator",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "QuorumIsInvalid",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
      {
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "quorum",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "selector",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "ccr",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "duration",
                type: "uint256",
              },
            ],
            internalType: "struct Common.Uints",
            name: "uints",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "unit",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "currentPool",
                type: "uint256",
              },
            ],
            internalType: "struct Common.Uint256s",
            name: "uint256s",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "address",
                name: "asset",
                type: "address",
              },
              {
                internalType: "address",
                name: "lastPaid",
                type: "address",
              },
            ],
            internalType: "struct Common.Addresses",
            name: "addrs",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "allGh",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct Common.Pool",
        name: "pool",
        type: "tuple",
      },
    ],
    name: "AllGh",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
      {
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "quorum",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "selector",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "ccr",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "duration",
                type: "uint256",
              },
            ],
            internalType: "struct Common.Uints",
            name: "uints",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "unit",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "currentPool",
                type: "uint256",
              },
            ],
            internalType: "struct Common.Uint256s",
            name: "uint256s",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "address",
                name: "asset",
                type: "address",
              },
              {
                internalType: "address",
                name: "lastPaid",
                type: "address",
              },
            ],
            internalType: "struct Common.Addresses",
            name: "addrs",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "allGh",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct Common.Pool",
        name: "pool",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "isMember",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isAdmin",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "payDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "turnTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "owings",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "colBals",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "hasGH",
            type: "bool",
          },
          {
            internalType: "address",
            name: "id",
            type: "address",
          },
        ],
        indexed: false,
        internalType: "struct Common.StrategyInfo",
        name: "info",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "position",
        type: "uint16",
      },
    ],
    name: "BandCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
    ],
    name: "Cancellation",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "isMember",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isAdmin",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "payDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "turnTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "owings",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "colBals",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "hasGH",
            type: "bool",
          },
          {
            internalType: "address",
            name: "id",
            type: "address",
          },
        ],
        indexed: false,
        internalType: "struct Common.StrategyInfo",
        name: "info",
        type: "tuple",
      },
    ],
    name: "GetFinanced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "isMember",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isAdmin",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "payDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "turnTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "owings",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "colBals",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "hasGH",
            type: "bool",
          },
          {
            internalType: "address",
            name: "id",
            type: "address",
          },
        ],
        indexed: false,
        internalType: "struct Common.StrategyInfo",
        name: "info",
        type: "tuple",
      },
    ],
    name: "Liquidated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "isMember",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isAdmin",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "payDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "turnTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "owings",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "colBals",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "hasGH",
            type: "bool",
          },
          {
            internalType: "address",
            name: "id",
            type: "address",
          },
        ],
        indexed: false,
        internalType: "struct Common.StrategyInfo",
        name: "info",
        type: "tuple",
      },
    ],
    name: "NewMemberAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "isMember",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isAdmin",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "payDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "turnTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "owings",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "colBals",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "hasGH",
            type: "bool",
          },
          {
            internalType: "address",
            name: "id",
            type: "address",
          },
        ],
        indexed: false,
        internalType: "struct Common.StrategyInfo",
        name: "info",
        type: "tuple",
      },
    ],
    name: "Payback",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "Rekeyed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "quorum",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "selector",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "ccr",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "duration",
                type: "uint256",
              },
            ],
            internalType: "struct Common.Uints",
            name: "uints",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "unit",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "currentPool",
                type: "uint256",
              },
            ],
            internalType: "struct Common.Uint256s",
            name: "uint256s",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "address",
                name: "asset",
                type: "address",
              },
              {
                internalType: "address",
                name: "lastPaid",
                type: "address",
              },
            ],
            internalType: "struct Common.Addresses",
            name: "addrs",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "allGh",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct Common.Pool",
        name: "",
        type: "tuple",
      },
    ],
    name: "RoundUp",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "durationInHours",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "colCoverageRatio",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "participants",
        type: "address[]",
      },
    ],
    name: "createPermissionedPool",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "quorum",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "durationInHours",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "colCoverageRatio",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "createPermissionlessPool",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "creationFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentPoolId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
    ],
    name: "enquireLiquidation",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "position",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "expectedRepaymentTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "debt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "colBalInToken",
            type: "uint256",
          },
        ],
        internalType: "struct Common.Liquidation",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
    ],
    name: "getFinance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
    ],
    name: "getPoolData",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "quorum",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "selector",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "ccr",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "duration",
                type: "uint256",
              },
            ],
            internalType: "struct Common.Uints",
            name: "uints",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "unit",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "currentPool",
                type: "uint256",
              },
            ],
            internalType: "struct Common.Uint256s",
            name: "uint256s",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "address",
                name: "asset",
                type: "address",
              },
              {
                internalType: "address",
                name: "lastPaid",
                type: "address",
              },
            ],
            internalType: "struct Common.Addresses",
            name: "addrs",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "allGh",
            type: "uint256",
          },
        ],
        internalType: "struct Common.Pool",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
    ],
    name: "getRouterWithPoolId",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "functionSelector",
        type: "uint8",
      },
    ],
    name: "isFunctionCallable",
    outputs: [
      {
        internalType: "string",
        name: "_isCallable",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
    ],
    name: "joinBand",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
    ],
    name: "liquidate",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "minContribution",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
    ],
    name: "payback",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "makerRate",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "_minContribution",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_bandCreationFee",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_feeTo",
        type: "address",
      },
      {
        internalType: "address",
        name: "_assetAdmin",
        type: "address",
      },
      {
        internalType: "address",
        name: "_strategyAdmin",
        type: "address",
      },
      {
        internalType: "address",
        name: "_trustee",
        type: "address",
      },
    ],
    name: "performSetUp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
    ],
    name: "removeBand",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "trustee",
        type: "address",
      },
      {
        internalType: "address",
        name: "assetAdmin",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "makerRate",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "_creationFee",
        type: "uint256",
      },
    ],
    name: "setVariables",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "strategyAdmin",
    outputs: [
      {
        internalType: "contract ISmartStrategyAdmin",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalPool",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newAmount",
        type: "uint256",
      },
    ],
    name: "updateMinContributionAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class AbstractRouter__factory {
  static readonly abi = _abi;
  static createInterface(): AbstractRouterInterface {
    return new Interface(_abi) as AbstractRouterInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): AbstractRouter {
    return new Contract(address, _abi, runner) as unknown as AbstractRouter;
  }
}