import { Address, Config } from "@/interfaces";
import { writeContract, simulateContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { getTokenAddress  } from "../../utils/getTokenAddress";
import getAllowance from "./getAllowance";
import BigNumber from "bignumber.js";
import { formatEther } from "viem";
import { transferFromAbi } from "@/apis/abis";

export default async function withdrawLoan(args: TransferFromParam) {
  const { callback, config, account: spender, bank: owner} = args;
  const address = getTokenAddress();
  const allowance = await getAllowance({config, account: spender, spender, owner });
  if(new BigNumber(allowance.toString()).gt(0)) {
    callback?.({message: `Approving and withdrawal $${formatEther(allowance)} loan to wallet...`});
    const {request} = await simulateContract(config, {
        address,
        account: spender,
        abi: transferFromAbi,
        functionName: 'transferFrom', 
        args: [owner, spender, allowance]
    });
    const hash = await writeContract(config, { ...request });
    await waitForConfirmation({config, hash,  callback});
  } else {
    callback?.({message: `${allowance} allowance found`});
  }
}

export interface TransferFromParam extends Config {
  bank: Address;
}
