/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../../../common";
import type {
  SmartStrategy,
  SmartStrategyInterface,
} from "../../../../../contracts/implementations/strategies/SmartStrategy.sol/SmartStrategy";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "factory",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
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
    name: "AssetIndentifierNotMatch",
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
    name: "TransferFailed",
    type: "error",
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
    inputs: [
      {
        internalType: "address",
        name: "newRouter",
        type: "address",
      },
    ],
    name: "activateStrategy",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "closeTo",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [
      {
        internalType: "address",
        name: "_newWSmartStrategy",
        type: "address",
      },
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "upgrade",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "user",
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
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdrawAsset",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610aeb380380610aeb83398101604081905261002f916100db565b806001600160a01b038116610077576040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526000600482015260240160405180910390fd5b6100808161008b565b50506001805561010b565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156100ed57600080fd5b81516001600160a01b038116811461010457600080fd5b9392505050565b6109d18061011a6000396000f3fe60806040526004361061007f5760003560e01c80638da5cb5b1161004e5780638da5cb5b146101b357806399a88ec4146101d1578063d80ea5a0146101f1578063f2fde38b1461021157600080fd5b8063092ae4dc146101115780634f8632ba14610146578063715018a61461017e5780637fcd6e391461019357600080fd5b3661010c57600080546040516001600160a01b039091169034908381818185875af1925050503d80600081146100d1576040519150601f19603f3d011682016040523d82523d6000602084013e6100d6565b606091505b5050905061010a604051806040016040528060038152602001622f7c2f60e81b81525082151561023190919063ffffffff16565b005b600080fd5b34801561011d57600080fd5b5061013161012c366004610842565b61025e565b60405190151581526020015b60405180910390f35b34801561015257600080fd5b50600254610166906001600160a01b031681565b6040516001600160a01b03909116815260200161013d565b34801561018a57600080fd5b5061010a610304565b34801561019f57600080fd5b506101316101ae36600461087e565b610318565b3480156101bf57600080fd5b506000546001600160a01b0316610166565b3480156101dd57600080fd5b506101316101ec36600461087e565b6103a1565b3480156101fd57600080fd5b5061013161020c3660046108b1565b610451565b34801561021d57600080fd5b5061010a61022c3660046108b1565b6104d6565b80826102595760405162461bcd60e51b815260040161025091906108f0565b60405180910390fd5b505050565b60006002600154036102b25760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610250565b60026001819055506102ea60405180606001604052806021815260200161097b602191396002546001600160a01b0316331490610231565b6102f78260008686610514565b5060018080559392505050565b61030c61053b565b6103166000610568565b565b600061032261053b565b6040516370a0823160e01b8152306004820152610398906001600160a01b038416906370a08231906024015b602060405180830381865afa15801561036b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061038f9190610923565b30318486610514565b50600192915050565b60006103ab61053b565b604080518082018252601481527361636365707452656b657928616464726573732960601b60209182015281516001600160a01b038516602480830191909152835180830390910181526044909101909252810180516001600160e01b03166303a34c1b60e01b1790526104209084906105b8565b506040516370a0823160e01b8152306004820152610398906001600160a01b038416906370a082319060240161034e565b600061045b61053b565b336001600160a01b038316156104745761047483610568565b6104cb6040518060400160405280601581526020017420b1b1b7bab73a1d102737ba1030b71027bbb732b960591b8152506104b76000546001600160a01b031690565b6001600160a01b0384811691161490610231565b60019150505b919050565b6104de61053b565b6001600160a01b03811661050857604051631e4fbdf760e01b815260006004820152602401610250565b61051181610568565b50565b8315610525576105258483836105cd565b8215610535576105358184610670565b50505050565b6000546001600160a01b031633146103165760405163118cdaa760e01b8152336004820152602401610250565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60606105c683836000610708565b9392505050565b604080518082018252600d81526c115490d51c9e0819985a5b1959609a1b6020820152905163a9059cbb60e01b81526001600160a01b0383811660048301526024820186905261025992919085169063a9059cbb906044016020604051808303816000875af1158015610644573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610668919061093c565b151590610231565b30318111156106945760405163cd78605960e01b8152306004820152602401610250565b6000826001600160a01b03168260405160006040518083038185875af1925050503d80600081146106e1576040519150601f19603f3d011682016040523d82523d6000602084013e6106e6565b606091505b505090508061025957604051630a12f52160e11b815260040160405180910390fd5b6060303182111561072e5760405163cd78605960e01b8152306004820152602401610250565b600080856001600160a01b0316848660405161074a919061095e565b60006040518083038185875af1925050503d8060008114610787576040519150601f19603f3d011682016040523d82523d6000602084013e61078c565b606091505b509150915061079c8683836107a6565b9695505050505050565b6060826107bb576107b682610802565b6105c6565b81511580156107d257506001600160a01b0384163b155b156107fb57604051639996b31560e01b81526001600160a01b0385166004820152602401610250565b50806105c6565b8051156108125780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b80356001600160a01b03811681146104d157600080fd5b60008060006060848603121561085757600080fd5b6108608461082b565b925061086e6020850161082b565b9150604084013590509250925092565b6000806040838503121561089157600080fd5b61089a8361082b565b91506108a86020840161082b565b90509250929050565b6000602082840312156108c357600080fd5b6105c68261082b565b60005b838110156108e75781810151838201526020016108cf565b50506000910152565b602081526000825180602084015261090f8160408501602087016108cc565b601f01601f19169190910160400192915050565b60006020828403121561093557600080fd5b5051919050565b60006020828403121561094e57600080fd5b815180151581146105c657600080fd5b600082516109708184602087016108cc565b919091019291505056fe536d6172742057616c6c65743a20556e417574686f72697a65642063616c6c6572a26469706673582212201c033ee03fd71e572b0635680c3c4a82ed4c8e8c6f883b9630207ce25bc1216b64736f6c63430008180033";

type SmartStrategyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SmartStrategyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SmartStrategy__factory extends ContractFactory {
  constructor(...args: SmartStrategyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    factory: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(factory, overrides || {});
  }
  override deploy(
    factory: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(factory, overrides || {}) as Promise<
      SmartStrategy & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): SmartStrategy__factory {
    return super.connect(runner) as SmartStrategy__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SmartStrategyInterface {
    return new Interface(_abi) as SmartStrategyInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): SmartStrategy {
    return new Contract(address, _abi, runner) as unknown as SmartStrategy;
  }
}
