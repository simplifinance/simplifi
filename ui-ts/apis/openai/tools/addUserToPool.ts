import { getClients } from "@/apis/viemClient";
import { CommonToolArg, ToolConfigProperties, } from "@/interfaces";
import { handleTransaction } from "@/utilities";
import { parseEther } from "viem";

export const addUserToPool = ({wagmiConfig, account, callback} : CommonToolArg) : ToolConfigProperties<CreatePermissionLessPoolParams> => {
    const client = getClients().getPublicClient();

    return {
        // definition: {
        //     "name": "addUserToPool",
        //     "description": "Become a contributor in a pool by joining the pool, and send your quota",
        //     "strict": true,
        //     "parameters": {
        //         "type": "object",
        //         "required": [
        //             "unitLiquidity"
        //         ],
        //         "properties": {
        //             "unitLiquidity": {
        //                 "type": "number",
        //                 "description": "Amount provided by each participant as liquidity or contribution."
        //             }
        //         },
        //         "additionalProperties": false
        //     },
        //     type: "function",
        //     function: {
        //         name: "addUserToPool",
        //         description: "Become a contributor in a pool by joining the pool, and send your quota",
        //         additionalProperties: false
        //     }
        // },
        handler: async({unitLiquidity}) => {
            await handleTransaction({
                callback,
                otherParam: {
                    client,
                    wagmiConfig,
                    account,
                    txnType: 'ADD LIQUIDITY',
                    unit: parseEther(unitLiquidity.toString()),
                },
                client
            });
        }
    }
}

export interface CreatePermissionLessPoolParams {
    unitLiquidity: number;
}
