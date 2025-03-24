import getCollateralQuote  from "@/apis/read/getCollateralQuote";
import { getClients } from "@/apis/viemClient";
import { Address, ToolConfigProperties } from "@/interfaces";
import { parseEther } from "viem";

export const get_CollateralQuote = () : ToolConfigProperties<GetCollateralQuoteArgs> => {
    const client = getClients().getPublicClient();
    return {
        // definition: {
        //     "name": "getCollateralQuote",
        //     "description": "Get the required amount of collateral (in native coin) a contributor will deposit to access the liquidity of a pool or getFinance",
        //     "strict": true,
        //     "parameters": {
        //     "type": "object",
        //     "required": [
        //         "unitLiquidity"
        //     ],
        //     "properties": {
        //         "unitLiquidity": {
        //         "type": "string",
        //         "description": "The unit contribution of the pool e.g 1 = $1, 5 = $5, 100 = $100 e.t.c"
        //         }
        //     },
        //         "additionalProperties": false
        //     },
        //     type: "function",
        //     function: {
        //         name: "getCollateralQuote",
        //         description: "Get the required amount of collateral (in native coin) a contributor will deposit to access the liquidity of a pool or getFinance",
        //         additionalProperties: false
        //     }
        // },
        handler: async({unitLiquidity}) => {
            return await getCollateralQuote({
                client,
                unit: parseEther(unitLiquidity)
            });
        }
    }
}

interface GetCollateralQuoteArgs {
    unitLiquidity: string;
}
