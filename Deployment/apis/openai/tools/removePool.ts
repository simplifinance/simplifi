import { getClients } from "@/apis/viemClient";
import { Address, CommonToolArg, ToolConfigProperties} from "@/interfaces";
import { handleTransaction } from "@/utilities";
import { parseEther } from "viem";

export const removePool = ({wagmiConfig, callback} : CommonToolArg) : ToolConfigProperties<RemovePoolParam> => {
    const client = getClients().getPublicClient();

    return {
        // definition: {
        //     "name": "removePool",
        //     "description": "Cancel the operation of a FlexPool. For a permissionless pool, it should only be done if the quorum is 1. For a permissioned pool, the total liquidity/currentPool must equal to the unit contribution. Only the creator is allowed to remove a pool",
        //     "strict": true,
        //     "parameters": {
        //         "type": "object",
        //         "required": [
        //             "unitLiquidity"
        //         ],
        //         "properties": {
        //             "unitLiquidity": {
        //             "type": "string",
        //             "description": "Amount provided by each participant as liquidity or contribution."
        //             }
        //         },
        //         "additionalProperties": false
        //     },
        //     type: "function",
        //     function: {
        //         name: "removePool",
        //         description: "Cancel the operation of a FlexPool. For a permissionless pool, it should only be done if the quorum is 1. For a permissioned pool, the total liquidity/currentPool must equal to the unit contribution. Only the creator is allowed to remove a pool",
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
                    txnType: 'REMOVE',
                    unit: parseEther(unitLiquidity),
                },
                client
            });
        }
    }
}

export interface RemovePoolParam {
    unitLiquidity: string;
}