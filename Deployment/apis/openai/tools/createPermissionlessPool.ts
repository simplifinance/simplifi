import { getClients } from "@/apis/viemClient";
import { Address, CommonToolArg, ToolConfigProperties } from "@/interfaces";
import { parseEther } from "viem";
import { handleTransaction } from "@/utilities";
import { deployPredictedSafe } from "@/apis/safe/deployPredictedSafe";
import { getKitWithPredictedSafe } from "@/apis/safe/getKitWithPredictedSafe";
import { THRESHOLD } from "@/constants";
import { randomBytes } from "crypto";

export const createPermissionlessPool = ({wagmiConfig, account, callback} : CommonToolArg) : ToolConfigProperties<CreatePermissionLessPoolParams> => {
    const client = getClients();
    const publicClient = client.getPublicClient();
    const walletClient = client.getWalletClient();
    const owners = Array.from([String(publicClient.account) as Address, account]);
    const querySafe = async(): Promise<Address> => {
        const kit = await getKitWithPredictedSafe(
            {
                owners,
                threshold: THRESHOLD,
            },
            randomBytes(96).toString(),
            client.getWalletClient()
                
        );
        return (await deployPredictedSafe(kit, client.getWalletClient())).safe as Address;
    }

    return {
        // definition: {
        //     "name": "createPermissionlessPool",
        //     "description": "Set up a new permissionless liquidity pool for a specific amount. The unit contribution must not be in existence.",
        //     "strict": true,
        //     "parameters": {
        //     "type": "object",
        //     "required": [
        //         "unitLiquidity",
        //         "collateralCoverageIndex",
        //         "quorum",
        //         "interestRate",
        //         "duration"
        //     ],
        //     "properties": {
        //         "unitLiquidity": {
        //             "type": "number",
        //             "description": "Amount provided by each participant as liquidity or contribution."
        //         },
        //         "collateralCoverageIndex": {
        //             "type": "string",
        //             "description": "Collateral factor/coverage is usually determined by the operator of FlexPool at the time of creation. This is the percentage of loan that is secured by discounting the value of Celo."
        //         },
        //         "quorum": {
        //             "type": "number",
        //             "description": "The maximum number of users that can participate in a flexpool. Generally, the minimum number of participants in any FlexPool is 2 while the maximum is 255."
        //         },
        //         "interestRate": {
        //             "type": "string",
        //             "description": "The rate of interest to charge on each contributor that gets finance. Select between 1 and 300. 1 = 0.01%."
        //         },
        //         "duration": {
        //             "type": "number",
        //             "description": "How long a user should utilize the borrowed fund before they can pay back."
        //         }
        //     },
        //         "additionalProperties": false
        //     },
        //     type: "function",
        //     function: {
        //         name: "createPermissionlessPool",
        //         description: "Set up a new permissionless liquidity pool for a specific amount. The unit contribution must not be in existence.",
        //         additionalProperties: false
        //     }
        // },
        handler: async({unitLiquidity, interestRate, quorum, durationInHour, collateralCoverageIndex}) => {
           await handleTransaction({
                callback,
                otherParam: {
                    client: publicClient,
                    wagmiConfig,
                    account,
                    txnType: 'CREATE',
                    unit: parseEther(unitLiquidity),
                },
                client: walletClient,
                router: 'Permissionless',
                createPermissionlessPoolParam: {
                    account,
                    colCoverage: collateralCoverageIndex,
                    client: walletClient,
                    quorum,
                    durationInHours: durationInHour,
                    intRate: interestRate,
                    unitLiquidity: parseEther(unitLiquidity),
                    wagmiConfig,
                    callback,
                    querySafe
                }
            });
        }
    }
}

export interface CreatePermissionLessPoolParams {
    interestRate: number;
    quorum: number;
    durationInHour: number;
    collateralCoverageIndex: number;
    unitLiquidity: string;
}
