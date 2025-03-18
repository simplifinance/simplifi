import { getClients } from "@/apis/viemClient";
import { Address, CommonToolArg, ToolConfigProperties} from "@/interfaces";
import { handleTransaction } from "@/utilities";
import { parseEther } from "viem";

export const payback = ({wagmiConfig, callback} : CommonToolArg) : ToolConfigProperties<PaybackParam> => {
    const client = getClients().getPublicClient();

    return {
        // definition: {
        //     "name": "payback",
        //     "description": "Pay back the borrowed liquidity to the Safe so others can have access to it",
        //     "strict": true,
        //     "parameters": {
        //       "type": "object",
        //       "required": [
        //         "unitLiquidity"
        //       ],
        //       "properties": {
        //         "unitLiquidity": {
        //           "type": "string",
        //           "description": "Amount provided by each participant as liquidity or contribution."
        //         }
        //       },
        //       "additionalProperties": false
        //     },
        //     type: "function",
        //     function: {
        //         name: "payback",
        //         description: "Pay back the borrowed liquidity to the Safe so others can have access to it",
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

export interface PaybackParam {
    unitLiquidity: string;
}

