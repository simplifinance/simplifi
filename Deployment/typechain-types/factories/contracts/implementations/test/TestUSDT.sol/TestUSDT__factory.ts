/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../../common";
import type {
  TestUSDT,
  TestUSDTInterface,
} from "../../../../../contracts/implementations/test/TestUSDT.sol/TestUSDT";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
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
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "tos",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mintBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
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
    inputs: [],
    name: "symbol",
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
    inputs: [],
    name: "totalSupply",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
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
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506040518060400160405280600981526020017f54455354206355534400000000000000000000000000000000000000000000008152506040518060400160405280600581526020017f5443555344000000000000000000000000000000000000000000000000000000815250816003908161008c9190610174565b5060046100998282610174565b505050610233565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600181811c908216806100e457607f821691505b60208210810361011d577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b601f82111561016f576000816000526020600020601f850160051c8101602086101561014c5750805b601f850160051c820191505b8181101561016b57828155600101610158565b5050505b505050565b81516001600160401b0381111561018d5761018d6100a1565b6101a18161019b84546100d0565b84610123565b602080601f8311600181146101d657600084156101be5750858301515b600019600386901b1c1916600185901b17855561016b565b600085815260208120601f198616915b82811015610205578886015182559484019460019091019084016101e6565b50858210156102235787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6108db806102426000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80636a627842116100715780636a6278421461012357806370a082311461013857806395d89b4114610161578063a9059cbb14610169578063b6afc4dc1461017c578063dd62ed3e1461018f57600080fd5b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100ef57806323b872dd14610101578063313ce56714610114575b600080fd5b6100b66101c8565b6040516100c3919061062d565b60405180910390f35b6100df6100da366004610698565b61025a565b60405190151581526020016100c3565b6002545b6040519081526020016100c3565b6100df61010f3660046106c2565b610274565b604051601281526020016100c3565b6101366101313660046106fe565b610298565b005b6100f36101463660046106fe565b6001600160a01b031660009081526020819052604090205490565b6100b66102b0565b6100df610177366004610698565b6102bf565b61013661018a366004610736565b6102cd565b6100f361019d366004610801565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6060600380546101d790610834565b80601f016020809104026020016040519081016040528092919081815260200182805461020390610834565b80156102505780601f1061022557610100808354040283529160200191610250565b820191906000526020600020905b81548152906001019060200180831161023357829003601f168201915b5050505050905090565b600033610268818585610309565b60019150505b92915050565b600033610282858285610316565b61028d858585610399565b506001949350505050565b683635c9adc5dea000006102ac82826103f8565b5050565b6060600480546101d790610834565b600033610268818585610399565b60005b8251811015610304576102fc8382815181106102ee576102ee61086e565b6020026020010151836103f8565b6001016102d0565b505050565b610304838383600161042e565b6001600160a01b038381166000908152600160209081526040808320938616835292905220546000198114610393578181101561038457604051637dc7a0d960e11b81526001600160a01b038416600482015260248101829052604481018390526064015b60405180910390fd5b6103938484848403600061042e565b50505050565b6001600160a01b0383166103c357604051634b637e8f60e11b81526000600482015260240161037b565b6001600160a01b0382166103ed5760405163ec442f0560e01b81526000600482015260240161037b565b610304838383610503565b6001600160a01b0382166104225760405163ec442f0560e01b81526000600482015260240161037b565b6102ac60008383610503565b6001600160a01b0384166104585760405163e602df0560e01b81526000600482015260240161037b565b6001600160a01b03831661048257604051634a1406b160e11b81526000600482015260240161037b565b6001600160a01b038085166000908152600160209081526040808320938716835292905220829055801561039357826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516104f591815260200190565b60405180910390a350505050565b6001600160a01b03831661052e5780600260008282546105239190610884565b909155506105a09050565b6001600160a01b038316600090815260208190526040902054818110156105815760405163391434e360e21b81526001600160a01b0385166004820152602481018290526044810183905260640161037b565b6001600160a01b03841660009081526020819052604090209082900390555b6001600160a01b0382166105bc576002805482900390556105db565b6001600160a01b03821660009081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161062091815260200190565b60405180910390a3505050565b60006020808352835180602085015260005b8181101561065b5785810183015185820160400152820161063f565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b038116811461069357600080fd5b919050565b600080604083850312156106ab57600080fd5b6106b48361067c565b946020939093013593505050565b6000806000606084860312156106d757600080fd5b6106e08461067c565b92506106ee6020850161067c565b9150604084013590509250925092565b60006020828403121561071057600080fd5b6107198261067c565b9392505050565b634e487b7160e01b600052604160045260246000fd5b6000806040838503121561074957600080fd5b823567ffffffffffffffff8082111561076157600080fd5b818501915085601f83011261077557600080fd5b813560208282111561078957610789610720565b8160051b604051601f19603f830116810181811086821117156107ae576107ae610720565b6040529283528183019350848101820192898411156107cc57600080fd5b948201945b838610156107f1576107e28661067c565b855294820194938201936107d1565b9997909101359750505050505050565b6000806040838503121561081457600080fd5b61081d8361067c565b915061082b6020840161067c565b90509250929050565b600181811c9082168061084857607f821691505b60208210810361086857634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052603260045260246000fd5b8082018082111561026e57634e487b7160e01b600052601160045260246000fdfea2646970667358221220f57ec8e972820f949221da06f9d64b8f05577ff8468612c02b4b9de69b8c27e764736f6c63430008180033";

type TestUSDTConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestUSDTConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestUSDT__factory extends ContractFactory {
  constructor(...args: TestUSDTConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      TestUSDT & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): TestUSDT__factory {
    return super.connect(runner) as TestUSDT__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestUSDTInterface {
    return new Interface(_abi) as TestUSDTInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): TestUSDT {
    return new Contract(address, _abi, runner) as unknown as TestUSDT;
  }
}
