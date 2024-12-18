import { CreatePermissionedPoolParams } from "@/interfaces";
import { getFactoryAddress } from "../../contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../waitForConfirmation";
import { getTokenAddress } from "../../getAddress";
import { formatError } from "../formatError";

const tokenAddr = getTokenAddress();

export const createPermissionedLiquidityPool = async(param: CreatePermissionedPoolParams) => {
  const { config, account, contributors, unitLiquidity, intRate, callback, durationInHours, colCoverage } = param;
  const address = getFactoryAddress();
  if(config) {
    try {
      callback?.({message: "Creating Liquidity Pool", txDone: false});
      const { request } = await simulateContract(config, {
        address,
        account,
        abi: createPermissionedLiquidityPoolAbi,
        functionName: "createPermissionedPool",
        args: [intRate, durationInHours, colCoverage, unitLiquidity, tokenAddr, contributors],
      });
      const hash = await writeContract(config, request );
      await waitForConfirmation({config, hash, fetch: true, setTrxnDone: true, callback: callback!});
    } catch (error: any) {
      callback?.({message: formatError(error), txDone: true});
    }
  }

}

const createPermissionedLiquidityPoolAbi = [
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "intRate",
        "type": "uint16"
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
      },
      {
        "internalType": "address[]",
        "name": "contributors",
        "type": "address[]"
      }
    ],
    "name": "createPermissionedPool",
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

  
