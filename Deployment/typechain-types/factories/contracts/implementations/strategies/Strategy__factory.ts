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
import type { NonPayableOverrides } from "../../../../common";
import type {
  Strategy,
  StrategyInterface,
} from "../../../../contracts/implementations/strategies/Strategy";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_ownershipManager",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ContractBalanceTooLow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "InsufficientCredit",
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
    name: "InsufficientNativeBalanceInContract",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "epochId",
        type: "uint256",
      },
    ],
    name: "addUp",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "assets",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "contributors",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "credits",
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
        name: "epochId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "assetInUse",
        type: "address",
      },
    ],
    name: "mapAsset",
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
    name: "ownershipManager",
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
        internalType: "uint256",
        name: "claim",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "credit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "epochId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "feeTo",
        type: "address",
      },
      {
        internalType: "bool",
        name: "allHasGF",
        type: "bool",
      },
      {
        internalType: "enum Common.TransactionType",
        name: "txType",
        type: "uint8",
      },
    ],
    name: "setClaim",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newManager",
        type: "address",
      },
    ],
    name: "setOwnershipManager",
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
        internalType: "uint256",
        name: "epochId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "newProv",
        type: "address",
      },
      {
        internalType: "address",
        name: "oldProv",
        type: "address",
      },
    ],
    name: "swapProvider",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "epochId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "xfiBalances",
        type: "uint256",
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
  "0x608060405234801561001057600080fd5b5060405161131138038061131183398101604081905261002f91610050565b600080546001600160a01b0319166001600160a01b03831617905550610080565b60006020828403121561006257600080fd5b81516001600160a01b038116811461007957600080fd5b9392505050565b6112828061008f6000396000f3fe6080604052600436106100945760003560e01c806354346b661161005957806354346b661461024557806361737d621461027d5780636d6ccde11461029d578063b88a3915146102bd578063cf35bdd0146102dd57600080fd5b8062f714ce14610182578063036a1c22146101b55780633be42320146101e257806341a8d7ce14610212578063527846641461023257600080fd5b3661017d576040518060600160405280602681526020016111bd602691396000546001600160a01b0316806100e45760405162461bcd60e51b81526004016100db90610ec6565b60405180910390fd5b6001600160a01b038116632f54bf6e336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401602060405180830381865afa158015610138573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061015c9190610f0e565b829061017b5760405162461bcd60e51b81526004016100db9190610f2b565b005b600080fd5b34801561018e57600080fd5b506101a261019d366004610f96565b610313565b6040519081526020015b60405180910390f35b3480156101c157600080fd5b506101a26101d0366004610fc2565b60046020526000908152604090205481565b3480156101ee57600080fd5b506102026101fd366004610f96565b6104d2565b60405190151581526020016101ac565b34801561021e57600080fd5b5061020261022d366004610fdb565b6105e3565b6101a2610240366004611005565b610722565b34801561025157600080fd5b5061026561026036600461108a565b610971565b6040516001600160a01b0390911681526020016101ac565b34801561028957600080fd5b506102026102983660046110ac565b6109a9565b3480156102a957600080fd5b506102026102b83660046110c7565b610ac7565b3480156102c957600080fd5b50600054610265906001600160a01b031681565b3480156102e957600080fd5b506102656102f8366004610fc2565b6002602052600090815260409020546001600160a01b031681565b60408051808201909152601781527f53747261746567793a204e6f74205065726d69747465640000000000000000006020820152600080549091906001600160a01b0316806103745760405162461bcd60e51b81526004016100db90610ec6565b6001600160a01b038116632f54bf6e336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401602060405180830381865afa1580156103c8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103ec9190610f0e565b829061040b5760405162461bcd60e51b81526004016100db9190610f2b565b506001600160a01b03841660009081526001602090815260408083208884529091528120805491905592508261046e5760405162461bcd60e51b81526020600482015260086024820152674e6f20636c61696d60c01b60448201526064016100db565b303160000361049357604051638817231760e01b8152303160048201526024016100db565b6040516001600160a01b0385169084156108fc029085906000818181858888f193505050501580156104c9573d6000803e3d6000fd5b50505092915050565b600060405180606001604052806022815260200161122b602291396000546001600160a01b0316806105165760405162461bcd60e51b81526004016100db90610ec6565b6001600160a01b038116632f54bf6e336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401602060405180830381865afa15801561056a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061058e9190610f0e565b82906105ad5760405162461bcd60e51b81526004016100db9190610f2b565b50600085815260026020526040902080546001600160a01b0386166001600160a01b031990911617905560019250505092915050565b60408051808201909152601f81527f5374726174656779202d2061646455703a204e6f74207065726d6974746564006020820152600080549091906001600160a01b0316806106445760405162461bcd60e51b81526004016100db90610ec6565b6001600160a01b038116632f54bf6e336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401602060405180830381865afa158015610698573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106bc9190610f0e565b82906106db5760405162461bcd60e51b81526004016100db9190610f2b565b5060008481526003602090815260408220805460018181018355918452919092200180546001600160a01b0388166001600160a01b03199091161790559250505092915050565b6000604051806060016040528060228152602001611209602291396000546001600160a01b0316806107665760405162461bcd60e51b81526004016100db90610ec6565b6001600160a01b038116632f54bf6e336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401602060405180830381865afa1580156107ba573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107de9190610f0e565b82906107fd5760405162461bcd60e51b81526004016100db9190610f2b565b506000888152600260205260409020546001600160a01b0316600185600181111561082a5761082a611103565b036108d65760008b8d1161083e578c610848565b6108488c8e61112f565b9050610855898383610cc1565b8b156108d05760405163a9059cbb60e01b81526001600160a01b038981166004830152602482018e905283169063a9059cbb906044016020604051808303816000875af11580156108aa573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108ce9190610f0e565b505b50610961565b6001600160a01b03881660009081526001602090815260408083208c8452909152812080548e9290610909908490611142565b9091555050891561093857600089815260046020526040812080548c9290610932908490611142565b90915550505b851561096157600089815260026020526040902054610961908a906001600160a01b0316610d5a565b50999a9950505050505050505050565b6003602052816000526040600020818154811061098d57600080fd5b6000918252602090912001546001600160a01b03169150829050565b60408051808201909152601881527f4f6e6c794f776e65723a204e6f74207065726d697474656400000000000000006020820152600080549091906001600160a01b031680610a0a5760405162461bcd60e51b81526004016100db90610ec6565b6001600160a01b038116632f54bf6e336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401602060405180830381865afa158015610a5e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a829190610f0e565b8290610aa15760405162461bcd60e51b81526004016100db9190610f2b565b50600080546001600160a01b0319166001600160a01b0386161790555060019392505050565b60006040518060600160405280602681526020016111e3602691396000546001600160a01b031680610b0b5760405162461bcd60e51b81526004016100db90610ec6565b6001600160a01b038116632f54bf6e336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401602060405180830381865afa158015610b5f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b839190610f0e565b8290610ba25760405162461bcd60e51b81526004016100db9190610f2b565b50600086815260036020908152604080832080548251818502810185019093528083529192909190830182828015610c0357602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610be5575b50505050509050600080600090505b8251811015610c5d57866001600160a01b0316838281518110610c3757610c37611155565b60200260200101516001600160a01b031603610c5557809150600195505b600101610c12565b508415610cb6576000888152600360205260409020805488919083908110610c8757610c87611155565b9060005260206000200160006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b505050509392505050565b816001600160a01b031663095ea7b384610cdb8587610e39565b610ce59085611142565b6040516001600160e01b031960e085901b1681526001600160a01b03909216600483015260248201526044016020604051808303816000875af1158015610d30573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d549190610f0e565b50505050565b600082815260046020908152604080832054600383528184208054835181860281018601909452808452919493909190830182828015610dc357602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610da5575b50505060008781526004602052604081205550508051909150808311610deb57610deb61116b565b6000610df78483610eb4565b905060005b82811015610e3057610e28848281518110610e1957610e19611155565b60200260200101518784610cc1565b600101610dfc565b50505050505050565b604051636eb1769f60e11b81523060048201526001600160a01b0382811660248301526000919084169063dd62ed3e90604401602060405180830381865afa158015610e89573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ead9190611181565b9392505050565b6000610ead828461119a565b92915050565b6020808252601a908201527f4f6e6c794f776e65723a204d616e61676572206e6f7420736574000000000000604082015260600190565b8015158114610f0b57600080fd5b50565b600060208284031215610f2057600080fd5b8151610ead81610efd565b60006020808352835180602085015260005b81811015610f5957858101830151858201604001528201610f3d565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b0381168114610f9157600080fd5b919050565b60008060408385031215610fa957600080fd5b82359150610fb960208401610f7a565b90509250929050565b600060208284031215610fd457600080fd5b5035919050565b60008060408385031215610fee57600080fd5b610ff783610f7a565b946020939093013593505050565b600080600080600080600080610100898b03121561102257600080fd5b8835975060208901359650604089013595506060890135945061104760808a01610f7a565b935061105560a08a01610f7a565b925060c089013561106581610efd565b915060e08901356002811061107957600080fd5b809150509295985092959890939650565b6000806040838503121561109d57600080fd5b50508035926020909101359150565b6000602082840312156110be57600080fd5b610ead82610f7a565b6000806000606084860312156110dc57600080fd5b833592506110ec60208501610f7a565b91506110fa60408501610f7a565b90509250925092565b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052601160045260246000fd5b81810381811115610ec057610ec0611119565b80820180821115610ec057610ec0611119565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052600160045260246000fd5b60006020828403121561119357600080fd5b5051919050565b6000826111b757634e487b7160e01b600052601260045260246000fd5b50049056fe53747261746567793a204e6f74207265636569766564202d204e6f74207065726d69747465645374726174656779202d207377617050726f76696465723a204e6f74207065726d69747465645374726174656779202d20736574436c61696d3a204e6f74207065726d69747465645374726174656779202d206d617041737365743a204e6f74207065726d6974746564a2646970667358221220ffd5821b2e34288b3491d179e04409f455413b94040f579afdd81bb5ec2d13b664736f6c63430008180033";

type StrategyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: StrategyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Strategy__factory extends ContractFactory {
  constructor(...args: StrategyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _ownershipManager: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_ownershipManager, overrides || {});
  }
  override deploy(
    _ownershipManager: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_ownershipManager, overrides || {}) as Promise<
      Strategy & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Strategy__factory {
    return super.connect(runner) as Strategy__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): StrategyInterface {
    return new Interface(_abi) as StrategyInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Strategy {
    return new Contract(address, _abi, runner) as unknown as Strategy;
  }
}
