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
  BigNumberish,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type {
  TokenDistributor,
  TokenDistributorInterface,
} from "../../../../contracts/implementations/token/TokenDistributor";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_ownershipManager",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_signers",
        type: "address[]",
      },
      {
        internalType: "uint8",
        name: "_quorum",
        type: "uint8",
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
    name: "AddressIsZero",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadySigned",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "InsufficientBalance",
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
    name: "InvalidRequestId",
    type: "error",
  },
  {
    inputs: [],
    name: "ManagerAddressIsZero",
    type: "error",
  },
  {
    inputs: [],
    name: "NotPermittedToCall",
    type: "error",
  },
  {
    inputs: [],
    name: "Pending",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "reqId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
    ],
    name: "Requested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "reqId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
    ],
    name: "Signer",
    type: "event",
  },
  {
    inputs: [],
    name: "delay",
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
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reqId",
        type: "uint256",
      },
    ],
    name: "executeTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getExecutors",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reqId",
        type: "uint256",
      },
    ],
    name: "getTransactionRequest",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "delay",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "executors",
            type: "address[]",
          },
          {
            internalType: "enum TokenDistributor.Status",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "enum TokenDistributor.Type",
            name: "txType",
            type: "uint8",
          },
        ],
        internalType: "struct TokenDistributor.Request",
        name: "req",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint16",
        name: "_delayInHours",
        type: "uint16",
      },
      {
        internalType: "uint8",
        name: "_type",
        type: "uint8",
      },
    ],
    name: "initiateTransaction",
    outputs: [],
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
    inputs: [],
    name: "quorum",
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
        internalType: "contract IERC20",
        name: "newToken",
        type: "address",
      },
    ],
    name: "setToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reqId",
        type: "uint256",
      },
    ],
    name: "signTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001a9d38038062001a9d833981016040819052620000349162000175565b600080546001600160a01b0319166001600160a01b03851617905560018055815160ff82166002558015620000a75760005b81811015620000a5576200009c84828151811062000088576200008862000270565b6020026020010151620000b160201b60201c565b60010162000066565b505b505050506200029f565b6001600160a01b03166000818152600760205260408120805460ff191660019081179091556005805491820181559091527f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db00180546001600160a01b0319169091179055565b80516001600160a01b03811681146200012f57600080fd5b919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b805160ff811681146200012f57600080fd5b6000806000606084860312156200018b57600080fd5b620001968462000117565b602085810151919450906001600160401b0380821115620001b657600080fd5b818701915087601f830112620001cb57600080fd5b815181811115620001e057620001e062000134565b8060051b604051601f19603f8301168101818110858211171562000208576200020862000134565b60405291825284820192508381018501918a8311156200022757600080fd5b938501935b828510156200025057620002408562000117565b845293850193928501926200022c565b809750505050505050620002676040850162000163565b90509250925092565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6117ee80620002af6000396000f3fe6080604052600436106100ab5760003560e01c8063ca93ed7811610064578063ca93ed78146101a0578063d0e30db0146101cd578063ee22610b146101d5578063ef09e78f146101f5578063f6a3a5e614610217578063fc0c546a1461023757600080fd5b8063144fa6d7146100b75780631703a018146100d95780635d9ec2101461010257806361737d62146101225780636a42b8f814610152578063b88a39151461016857600080fd5b366100b257005b600080fd5b3480156100c357600080fd5b506100d76100d23660046114f5565b610257565b005b3480156100e557600080fd5b506100ef60025481565b6040519081526020015b60405180910390f35b34801561010e57600080fd5b506100d761011d366004611512565b61034b565b34801561012e57600080fd5b5061014261013d3660046114f5565b61062c565b60405190151581526020016100f9565b34801561015e57600080fd5b506100ef60045481565b34801561017457600080fd5b50600054610188906001600160a01b031681565b6040516001600160a01b0390911681526020016100f9565b3480156101ac57600080fd5b506101c06101bb366004611512565b610710565b6040516100f99190611565565b6100d7610853565b3480156101e157600080fd5b506100d76101f0366004611512565b61088e565b34801561020157600080fd5b5061020a610f4b565b6040516100f9919061160e565b34801561022357600080fd5b506100d761023236600461165b565b610fad565b34801561024357600080fd5b50600954610188906001600160a01b031681565b6000546001600160a01b03168061028157604051637e70a7e360e01b815260040160405180910390fd5b6001600160a01b038116632f54bf6e336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401602060405180830381865afa1580156102d5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102f991906116bb565b610316576040516315ed864b60e21b815260040160405180910390fd5b610328826001600160a01b03166111c6565b50600980546001600160a01b0319166001600160a01b0392909216919091179055565b3360009081526007602052604090205460ff166103835760405162461bcd60e51b815260040161037a906116dd565b60405180910390fd5b80806000036103a8576040516364b4f07960e11b81526004810182905260240161037a565b33600081815260086020908152604080832086845290915290205483919060ff16156103e75760405163585eb56560e11b815260040160405180910390fd5b6000848152600660209081526040808320815160c0810183528154815260018201546001600160a01b03168185015260028201548184015260038201805484518187028101870190955280855291949293606086019390929083018282801561047957602002820191906000526020600020905b81546001600160a01b0316815260019091019060200180831161045b575b5050509183525050600482015460209091019060ff1660038111156104a0576104a061152b565b60038111156104b1576104b161152b565b81526020016004820160019054906101000a900460ff1660048111156104d9576104d961152b565b60048111156104ea576104ea61152b565b81525050905061052a81600160405180604001604052806016815260200175151c9e1b881b5d5cdd081899481a5b9a5d1a585d195960521b8152506111f0565b60608101515160025481106105745760405162461bcd60e51b815260206004820152601060248201526f5369676e65727320636f6d706c65746560801b604482015260640161037a565b60008681526006602090815260408083206003018054600180820183559185528385200180546001600160a01b03191633908117909155808552600884528285208b86529093529220805460ff19168317905560025490916105d7908490611719565b036105f9576000878152600660205260409020600401805460ff191660021790555b5050506001600160a01b0316600090815260086020908152604080832093835292905220805460ff191660011790555050565b600080546001600160a01b03168061065757604051637e70a7e360e01b815260040160405180910390fd5b6001600160a01b038116632f54bf6e336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401602060405180830381865afa1580156106ab573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106cf91906116bb565b6106ec576040516315ed864b60e21b815260040160405180910390fd5b600080546001600160a01b0319166001600160a01b03851617905550600192915050565b6107476040805160c08101825260008082526020820181905291810182905260608082015290608082019081526020016000905290565b600082815260066020908152604091829020825160c0810184528154815260018201546001600160a01b03168184015260028201548185015260038201805485518186028101860190965280865291949293606086019392908301828280156107d957602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116107bb575b5050509183525050600482015460209091019060ff1660038111156108005761080061152b565b60038111156108115761081161152b565b81526020016004820160019054906101000a900460ff1660048111156108395761083961152b565b600481111561084a5761084a61152b565b90525092915050565b6000341161088c5760405162461bcd60e51b815260040161037a906020808252600490820152633030302f60e01b604082015260600190565b565b3360009081526007602052604090205460ff166108bd5760405162461bcd60e51b815260040161037a906116dd565b80806000036108e2576040516364b4f07960e11b81526004810182905260240161037a565b6108ea61123e565b6000828152600660209081526040808320815160c0810183528154815260018201546001600160a01b03168185015260028201548184015260038201805484518187028101870190955280855291949293606086019390929083018282801561097c57602002820191906000526020600020905b81546001600160a01b0316815260019091019060200180831161095e575b5050509183525050600482015460209091019060ff1660038111156109a3576109a361152b565b60038111156109b4576109b461152b565b81526020016004820160019054906101000a900460ff1660048111156109dc576109dc61152b565b60048111156109ed576109ed61152b565b815250509050610a2d81600260405180604001604052806016815260200175151c9e1b881b5d5cdd081899481a5b9a5d1a585d195960521b8152506111f0565b60408101514267ffffffffffffffff161015610a5c576040516306df203960e41b815260040160405180910390fd5b60008381526006602052604081206004908101805460ff1916600317905560a083015190811115610a8f57610a8f61152b565b03610acd57600954610aa9906001600160a01b03166111c6565b60208101518151600954610ac8926001600160a01b0390911691611268565b610f3d565b60018160a001516004811115610ae557610ae561152b565b03610bad578051303190811015610b1257604051639266535160e01b81526004810182905260240161037a565b602082015182516040516000926001600160a01b031691908381818185875af1925050503d8060008114610b62576040519150601f19603f3d011682016040523d82523d6000602084013e610b67565b606091505b5050905080610ba65760405162461bcd60e51b815260206004820152600b60248201526a151c9e1b8819985a5b195960aa1b604482015260640161037a565b5050610f3d565b60028160a001516004811115610bc557610bc561152b565b03610d8657600083815260066020908152604091829020825160c0810184528154815260018201546001600160a01b0316818401526002820154818501526003820180548551818602810186019096528086529194929360608601939290830182828015610c5c57602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610c3e575b5050509183525050600482015460209091019060ff166003811115610c8357610c8361152b565b6003811115610c9457610c9461152b565b81526020016004820160019054906101000a900460ff166004811115610cbc57610cbc61152b565b6004811115610ccd57610ccd61152b565b90525060008481526006602052604081208181556001810180546001600160a01b031916905560028101829055919250610d0a60038301826114ae565b50600401805461ffff191690556020810151610ac8906001600160a01b03166000818152600760205260408120805460ff191660019081179091556005805491820181559091527f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db00180546001600160a01b0319169091179055565b60038160a001516004811115610d9e57610d9e61152b565b03610f1a57600083815260066020908152604091829020825160c0810184528154815260018201546001600160a01b0316818401526002820154818501526003820180548551818602810186019096528086529194929360608601939290830182828015610e3557602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610e17575b5050509183525050600482015460209091019060ff166003811115610e5c57610e5c61152b565b6003811115610e6d57610e6d61152b565b81526020016004820160019054906101000a900460ff166004811115610e9557610e9561152b565b6004811115610ea657610ea661152b565b90525060008481526006602052604081208181556001810180546001600160a01b031916905560028101829055919250610ee360038301826114ae565b50600401805461ffff191690556020810151610ac8906001600160a01b03166000908152600760205260409020805460ff19169055565b60048160a001516004811115610f3257610f3261152b565b03610f3d5780516002555b50610f4760018055565b5050565b60606005805480602002602001604051908101604052809291908181526020018280548015610fa357602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610f85575b5050505050905090565b3360009081526007602052604090205460ff16610fdc5760405162461bcd60e51b815260040161037a906116dd565b60058160ff16106110225760405162461bcd60e51b815260206004820152601060248201526f24b73b30b634b21039b2b632b1ba37b960811b604482015260640161037a565b600061102c6112bf565b905060048260ff161015611089576001600160a01b0385166110895760405162461bcd60e51b81526020600482015260166024820152752932b1b4b834b2b73a1034b9903d32b9379030b2323960511b604482015260640161037a565b6000818152600660205260409020848155600180820180546001600160a01b0319166001600160a01b0389161790556004909101805460ff1916828002179055508160ff1660048111156110df576110df61152b565b600082815260066020526040902060049081018054909161ff0019909116906101009084908111156111135761111361152b565b0217905550600081815260066020908152604080832067ffffffffffffffff42610e10890261ffff16011660028201556003018054600180820183559185528385200180546001600160a01b0319163390811790915580855260088452828520868652845293829020805460ff19169091179055805184815291820183905280517ffda9ac54069bb066debdc05afc39e260f270fcfb0ce45a42e94b6615a4514fbc9281900390910190a1505050505050565b6001600160a01b0381166111ed5760405163867915ab60e01b815260040160405180910390fd5b50565b8160038111156112025761120261152b565b836080015160038111156112185761121861152b565b1481906112385760405162461bcd60e51b815260040161037a9190611750565b50505050565b60026001540361126157604051633ee5aeb560e01b815260040160405180910390fd5b6002600155565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b1790526112ba9084906112dd565b505050565b60038054600091826112d083611783565b9190505550600354905090565b60006112f26001600160a01b03841683611372565b905080516000148061131357508080602001905181019061131391906116bb565b6112ba5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b606482015260840161037a565b606061138083836000611389565b90505b92915050565b606030318211156113af5760405163cd78605960e01b815230600482015260240161037a565b600080856001600160a01b031684866040516113cb919061179c565b60006040518083038185875af1925050503d8060008114611408576040519150601f19603f3d011682016040523d82523d6000602084013e61140d565b606091505b509150915061141d868383611429565b925050505b9392505050565b60608261143e5761143982611485565b611422565b815115801561145557506001600160a01b0384163b155b1561147e57604051639996b31560e01b81526001600160a01b038516600482015260240161037a565b5080611422565b8051156114955780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b50805460008255906000526020600020908101906111ed91905b808211156114dc57600081556001016114c8565b5090565b6001600160a01b03811681146111ed57600080fd5b60006020828403121561150757600080fd5b8135611422816114e0565b60006020828403121561152457600080fd5b5035919050565b634e487b7160e01b600052602160045260246000fd5b600481106115515761155161152b565b9052565b600581106115515761155161152b565b6020808252825182820152828101516001600160a01b0390811660408085019190915284015160608085019190915284015160c06080850152805160e08501819052600093929183019184916101008701905b808410156115da578451831682529385019360019390930192908501906115b8565b50608088015194506115ef60a0880186611541565b60a0880151945061160360c0880186611555565b979650505050505050565b6020808252825182820181905260009190848201906040850190845b8181101561164f5783516001600160a01b03168352928401929184019160010161162a565b50909695505050505050565b6000806000806080858703121561167157600080fd5b843561167c816114e0565b935060208501359250604085013561ffff8116811461169a57600080fd5b9150606085013560ff811681146116b057600080fd5b939692955090935050565b6000602082840312156116cd57600080fd5b8151801515811461142257600080fd5b6020808252600c908201526b2737ba10309039b4b3b732b960a11b604082015260600190565b634e487b7160e01b600052601160045260246000fd5b8082018082111561138357611383611703565b60005b8381101561174757818101518382015260200161172f565b50506000910152565b602081526000825180602084015261176f81604085016020870161172c565b601f01601f19169190910160400192915050565b60006001820161179557611795611703565b5060010190565b600082516117ae81846020870161172c565b919091019291505056fea26469706673582212203738b7e6ce8f4af7f9cd718ba27e72fd361b64ee5b91f53323cad8facf542cae64736f6c63430008180033";

type TokenDistributorConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TokenDistributorConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TokenDistributor__factory extends ContractFactory {
  constructor(...args: TokenDistributorConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _ownershipManager: AddressLike,
    _signers: AddressLike[],
    _quorum: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _ownershipManager,
      _signers,
      _quorum,
      overrides || {}
    );
  }
  override deploy(
    _ownershipManager: AddressLike,
    _signers: AddressLike[],
    _quorum: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _ownershipManager,
      _signers,
      _quorum,
      overrides || {}
    ) as Promise<
      TokenDistributor & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): TokenDistributor__factory {
    return super.connect(runner) as TokenDistributor__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TokenDistributorInterface {
    return new Interface(_abi) as TokenDistributorInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): TokenDistributor {
    return new Contract(address, _abi, runner) as unknown as TokenDistributor;
  }
}
