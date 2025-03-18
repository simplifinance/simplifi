import { getClients } from "@/apis/viemClient";
import { Address, CommonToolArg, ToolConfigProperties} from "@/interfaces";
import { handleTransaction } from "@/utilities";
import { parseEther } from "viem";

export const liquidate = ({wagmiConfig, callback} : CommonToolArg) : ToolConfigProperties<LiquidateParam> => {
    const client = getClients().getPublicClient();

    return {
        // definition: {
        //     "name": "liquidate",
        //     "description": "This action removes a contributor from a pool if they default to paying back the borrowed fund within the set duration, liquidate their position, and their collateral balances is fully transfered to the liquidator",
        //     "strict": true,
        //     "parameters": {
        //         "type": "object",
        //         "required": [
        //             "unitLiquidity"
        //         ],
        //         "properties": {
        //             "unitLiquidity": {
        //                 "type": "string",
        //                 "description": "Amount provided by each participant as liquidity or contribution."
        //             }
        //         },
        //         "additionalProperties": false
        //     },
        //     type: "function",
        //     function: {
        //         name: "liquidate",
        //         description: "This action removes a contributor from a pool if they default to paying back the borrowed fund within the set duration, liquidate their position, and their collateral balances is fully transfered to the liquidator",
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
                    txnType: 'LIQUIDATE',
                    unit: parseEther(unitLiquidity),
                },
                client
            });
        }
    }
}

export interface LiquidateParam {
    unitLiquidity: string;
}