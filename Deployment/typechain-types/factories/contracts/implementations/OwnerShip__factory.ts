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
  OwnerShip,
  OwnerShipInterface,
} from "../../../contracts/implementations/OwnerShip";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
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
  {
    inputs: [
      {
        internalType: "address[]",
        name: "newOwners",
        type: "address[]",
      },
    ],
    name: "setPermission",
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
  "0x608060405234801561001057600080fd5b5061001c336001610021565b610192565b6001600160a01b0382166100bb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602f60248201527f53696d706c696669204f776e6572536869703a2027746172676574272070617260448201527f616d6574657220697320656d7074790000000000000000000000000000000000606482015260840160405180910390fd5b806100f6576001600160a01b0382166000908152600160205260408120805460ff19169055805481806100ed83610162565b9190505561012d565b6001600160a01b03821660009081526001602081905260408220805460ff191682179055815490918061012883610179565b919050555b50505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008161017157610171610133565b506000190190565b60006001820161018b5761018b610133565b5060010190565b6105aa806101a16000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063b94885461161005b578063b948854614610117578063c41a360a1461012e578063ea41c7f414610157578063f8b14a3b1461016a57600080fd5b8063025e7c2714610082578063173825d9146100c85780632f54bf6e146100eb575b600080fd5b6100ab6100903660046103b4565b6002602052600090815260409020546001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b6100db6100d63660046103e4565b610172565b60405190151581526020016100bf565b6100db6100f93660046103e4565b6001600160a01b031660009081526001602052604090205460ff1690565b61012060005481565b6040519081526020016100bf565b6100ab61013c3660046103b4565b6000908152600260205260409020546001600160a01b031690565b6100db61016536600461041c565b6101be565b6100db61022d565b3360009081526001602052604081205460ff166101aa5760405162461bcd60e51b81526004016101a1906104e1565b60405180910390fd5b6101b58260006102ce565b5060015b919050565b3360009081526001602052604081205460ff166101ed5760405162461bcd60e51b81526004016101a1906104e1565b600160005b83518110156102265761021e84828151811061021057610210610518565b6020026020010151836102ce565b6001016101f2565b5092915050565b3360009081526001602052604081205460ff1661025c5760405162461bcd60e51b81526004016101a1906104e1565b6001600054116102bd5760405162461bcd60e51b815260206004820152602660248201527f4174206c656173742032206f776e65727320697320726571756972656420746f604482015265206c6561766560d01b60648201526084016101a1565b6102c83360006102ce565b50600190565b6001600160a01b03821661033c5760405162461bcd60e51b815260206004820152602f60248201527f53696d706c696669204f776e6572536869703a2027746172676574272070617260448201526e616d6574657220697320656d70747960881b60648201526084016101a1565b80610377576001600160a01b0382166000908152600160205260408120805460ff191690558054818061036e83610544565b919050556103ae565b6001600160a01b03821660009081526001602081905260408220805460ff19168217905581549091806103a98361055b565b919050555b50505050565b6000602082840312156103c657600080fd5b5035919050565b80356001600160a01b03811681146101b957600080fd5b6000602082840312156103f657600080fd5b6103ff826103cd565b9392505050565b634e487b7160e01b600052604160045260246000fd5b6000602080838503121561042f57600080fd5b823567ffffffffffffffff8082111561044757600080fd5b818501915085601f83011261045b57600080fd5b81358181111561046d5761046d610406565b8060051b604051601f19603f8301168101818110858211171561049257610492610406565b6040529182528482019250838101850191888311156104b057600080fd5b938501935b828510156104d5576104c6856103cd565b845293850193928501926104b5565b98975050505050505050565b6020808252601d908201527f4f6f70212043616c6c6572206973206e6f74207265636f676e697a6564000000604082015260600190565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000816105535761055361052e565b506000190190565b60006001820161056d5761056d61052e565b506001019056fea26469706673582212207aecedb801ff2a46344b20b11e2d0b1e272b1c21e04b0ca75db9635dd47a677864736f6c63430008180033";

type OwnerShipConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: OwnerShipConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class OwnerShip__factory extends ContractFactory {
  constructor(...args: OwnerShipConstructorParams) {
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
      OwnerShip & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): OwnerShip__factory {
    return super.connect(runner) as OwnerShip__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OwnerShipInterface {
    return new Interface(_abi) as OwnerShipInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): OwnerShip {
    return new Contract(address, _abi, runner) as unknown as OwnerShip;
  }
}
