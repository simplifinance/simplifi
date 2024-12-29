import type { CreatePermissionLessPoolParams } from "@/interfaces";
import { getFactoryAddress } from "../../contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../waitForConfirmation";
import { getTokenAddress } from "../../getAddress";

const tokenAddr = getTokenAddress();

export const createPermissionlessLiquidityPool = async(param: CreatePermissionLessPoolParams) => {
  const { config, account, quorum, unitLiquidity, intRate, callback, durationInHours, colCoverage } = param;
  const address = getFactoryAddress();
  callback?.({message: "Creating Permissionless FlexPool"});
  const { request } = await simulateContract(config, {
    address,
    account,
    abi: createPermissionlessLiquidityPoolAbi,
    functionName: "createPermissionlessPool",
    args: [intRate, quorum, durationInHours, colCoverage, unitLiquidity, tokenAddr],
  });
  const hash = await writeContract(config, request );
  return await waitForConfirmation({config, hash, fetch: true, callback: callback!});
}

const createPermissionlessLiquidityPoolAbi = [
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

  
