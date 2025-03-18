import getCurrentDebt  from "@/apis/read/getCurrentDebt";
import { getClients } from "@/apis/viemClient";
import { Address, ToolConfigProperties } from "@/interfaces";
import { parseEther } from "viem";

interface GetCurrentDebtArgs {
    unitLiquidity: string;
}

export const getMyCurrentDebt = () : ToolConfigProperties<GetCurrentDebtArgs> => {
    const client = getClients().getWalletClient();

    return {
        handler: async({unitLiquidity}) => {
            return await getCurrentDebt({
                account: client.account.address,
                unit: parseEther(unitLiquidity),
                client: client
            }); 
        }
    }
}
