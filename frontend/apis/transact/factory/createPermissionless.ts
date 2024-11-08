import type { CreatePermissionLessPoolParams } from "@/interfaces";
import { getFactoryAddress } from "../../contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../waitForConfirmation";
import { getTokenAddress } from "../../getAddress";
import { formatError } from "../formatError";

const tokenAddr = getTokenAddress();

export const createPermissionlessLiquidityPool = async(param: CreatePermissionLessPoolParams) => {
  // console.log("Param: ", param)
  const { config, account, quorum, unitLiquidity, intRate, callback, durationInHours, colCoverage } = param;
  const address = getFactoryAddress();
  if(config) {
    callback?.({message: "Creating Liquidity Pool",txDone: false});
    try {
      const { request } = await simulateContract(config, {
        address,
        account,
        abi: createPermissionlessLiquidityPoolAbi,
        functionName: "createPermissionlessPool",
        args: [intRate, quorum, durationInHours, colCoverage, unitLiquidity, tokenAddr],
      });
      const hash = await writeContract(config, request );
      await waitForConfirmation({config, hash, fetch: true, setTrxnDone: true, callback: callback!});
    } catch (error: any) {
      callback?.({message: formatError(error), txDone: true});
    }
  }

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

  
