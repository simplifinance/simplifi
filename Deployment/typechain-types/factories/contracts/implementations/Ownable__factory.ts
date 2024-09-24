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
import type { NonPayableOverrides } from "../../../common";
import type {
  Ownable,
  OwnableInterface,
} from "../../../contracts/implementations/Ownable";

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
        name: "newOwner",
        type: "address",
      },
    ],
    name: "addNewOwner",
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
        name: "ownerId",
        type: "uint256",
      },
    ],
    name: "getOwner",
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
        name: "target",
        type: "address",
      },
    ],
    name: "isOwner",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "owners",
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
    name: "ownersCount",
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
        name: "target",
        type: "address",
      },
    ],
    name: "removeOwner",
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
    name: "renounceOwnerShip",
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
  "0x608060405234801561001057600080fd5b5061001c336001610021565b610192565b6001600160a01b0382166100bb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602d60248201527f53696d706c696669204f776e61626c653a20277461726765742720706172616d60448201527f6574657220697320656d70747900000000000000000000000000000000000000606482015260840160405180910390fd5b806100f6576001600160a01b0382166000908152600160205260408120805460ff19169055805481806100ed83610162565b9190505561012d565b6001600160a01b03821660009081526001602081905260408220805460ff191682179055815490918061012883610179565b919050555b50505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008161017157610171610133565b506000190190565b60006001820161018b5761018b610133565b5060010190565b61047f806101a16000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c80632f54bf6e1161005b5780632f54bf6e146100fe578063b94885461461012a578063c41a360a14610141578063f8b14a3b1461016a57600080fd5b8063025e7c2714610082578063114d8be1146100c8578063173825d9146100eb575b600080fd5b6100ab610090366004610383565b6002602052600090815260409020546001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b6100db6100d636600461039c565b610172565b60405190151581526020016100bf565b6100db6100f936600461039c565b6101bc565b6100db61010c36600461039c565b6001600160a01b031660009081526001602052604090205460ff1690565b61013360005481565b6040519081526020016100bf565b6100ab61014f366004610383565b6000908152600260205260409020546001600160a01b031690565b6100db6101fe565b3360009081526001602052604081205460ff166101aa5760405162461bcd60e51b81526004016101a1906103cc565b60405180910390fd5b60016101b6838261029f565b92915050565b3360009081526001602052604081205460ff166101eb5760405162461bcd60e51b81526004016101a1906103cc565b6101f682600061029f565b506001919050565b3360009081526001602052604081205460ff1661022d5760405162461bcd60e51b81526004016101a1906103cc565b60016000541161028e5760405162461bcd60e51b815260206004820152602660248201527f4174206c656173742032206f776e65727320697320726571756972656420746f604482015265206c6561766560d01b60648201526084016101a1565b61029933600061029f565b50600190565b6001600160a01b03821661030b5760405162461bcd60e51b815260206004820152602d60248201527f53696d706c696669204f776e61626c653a20277461726765742720706172616d60448201526c6574657220697320656d70747960981b60648201526084016101a1565b80610346576001600160a01b0382166000908152600160205260408120805460ff191690558054818061033d83610419565b9190505561037d565b6001600160a01b03821660009081526001602081905260408220805460ff191682179055815490918061037883610430565b919050555b50505050565b60006020828403121561039557600080fd5b5035919050565b6000602082840312156103ae57600080fd5b81356001600160a01b03811681146103c557600080fd5b9392505050565b6020808252601d908201527f4f6f70212043616c6c6572206973206e6f74207265636f676e697a6564000000604082015260600190565b634e487b7160e01b600052601160045260246000fd5b60008161042857610428610403565b506000190190565b60006001820161044257610442610403565b506001019056fea26469706673582212204c63c0704392d78b815cc90b950ff1a9d54abedbce9c8dc29dacf630bc63b55264736f6c63430008180033";

type OwnableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: OwnableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Ownable__factory extends ContractFactory {
  constructor(...args: OwnableConstructorParams) {
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
      Ownable & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Ownable__factory {
    return super.connect(runner) as Ownable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OwnableInterface {
    return new Interface(_abi) as OwnableInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Ownable {
    return new Contract(address, _abi, runner) as unknown as Ownable;
  }
}
