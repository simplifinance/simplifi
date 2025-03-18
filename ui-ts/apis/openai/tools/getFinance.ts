import { getClients } from "@/apis/viemClient";
import { Address, CommonToolArg, ToolConfigProperties } from "@/interfaces";
import { handleTransaction } from "@/utilities";
import { parseEther } from "viem";

export const getFinance = ({wagmiConfig, callback} : CommonToolArg) : ToolConfigProperties<GetFinanceParam> => {
    const client = getClients().getPublicClient();

    return {
        // definition: {
        //     "name": "getFinance",
        //     "description": "Utility for accessing the liquidity privilege of a pool. It is simply a tool to get finance. The contributor/borrower have enough collateral in native token e.g Celo in order to get finance. Please use the 'getCollateralQuote' tool to preview the collateral needed.",
        //     "strict": true,
        //     "parameters": {
        //     "type": "object",
        //     "required": [
        //         "unitLiquidity"
        //     ],
        //     "properties": {
        //             "unitLiquidity": {
        //             "type": "string",
        //             "description": "Utility for accessing the liquidity privilege of a pool. It is simply a tool to get finance. The contributor/borrower have enough collateral in native token e.g Celo in order to get finance. Please use the 'getCollateralQuote' tool to preview the collateral needed.",
        //         }
        //     },
        //         "additionalProperties": false
        //     },
        //     type: "function",
        //     function: {
        //         name: "getFinance",
        //         description: "Get the current debt of a contributor/borrower in a given pool",
        //         additionalProperties: false
        //     }
        // },
        handler: async({unitLiquidity}) => {
            await handleTransaction({
                callback,
                otherParam: {
                    client,
                    wagmiConfig,
                    account: String(client.account) as Address,
                    txnType: 'GET FINANCE',
                    unit: parseEther(unitLiquidity),
                },
                client
            });
        }
    }
}

export interface GetFinanceParam {
    unitLiquidity: string;
}
