import { Address, Config } from "@/interfaces";
import { writeContract, simulateContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { getContractData  } from "../../utils/getContractData";
import getAllowance from "./getAllowance";
import BigNumber from "bignumber.js";
import { formatEther } from "viem";
import { transferFromAbi } from "@/apis/utils/abis";
import { errorMessage } from "../formatError";

export default async function withdrawLoan(args: TransferFromParam) {
  const { callback, config, account: spender, bank: owner} = args;
  const {token: address} = getContractData(config.state.chainId);
  const allowance = await getAllowance({config, account: spender, spender, owner });
  if(new BigNumber(allowance.toString()).gt(0)) {
    await simulateContract(config, {
      address,
      account: spender,
      abi: transferFromAbi,
      functionName: 'transferFrom', 
      args: [owner, spender, allowance]
    })
    .then(async({request}) => {
      callback?.({message: `Approving and withdrawal $${formatEther(allowance)} loan to wallet...`});
      const hash = await writeContract(config, request );
      await waitForConfirmation({config, hash, callback: callback!});
    }).catch((error: any) => callback?.({message: errorMessage(error)}));
            
  } else {
    callback?.({message: `${allowance} allowance found`});
  }
}

export interface TransferFromParam extends Config {
  bank: Address;
}
