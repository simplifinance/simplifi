import { getClients } from "@/apis/viemClient";
import { Address, CommonToolArg, ToolConfigProperties, TransactionCallback, WagmiConfig } from "@/interfaces";
import { parseEther } from "viem";
import { handleTransaction } from "@/utilities";
import { deployPredictedSafe } from "@/apis/safe/deployPredictedSafe";
import { getKitWithPredictedSafe } from "@/apis/safe/getKitWithPredictedSafe";
import { THRESHOLD } from "@/constants";
import { randomBytes } from "crypto";

export const createPermissionedPool = ({wagmiConfig, account, callback} : CommonToolArg) : ToolConfigProperties<CreatePermissionLessPoolParams> => {
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
        //     "name": "createPermissionedPool",
        //     "description": "Get the current debt of a contributor/borrower in a given pool",
        //     "strict": true,
        //     "parameters": {
        //     "type": "object",
        //     "required": [
        //         "unitLiquidity",
        //         "collateralCoverageIndex",
        //         "contributors",
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
        //             "description": "Collateral factor/coverage usually determined by the operator of FlexPool at creation time. This is the percentage of loan secured by discounting the value of Celo."
        //         },
        //         "contributors": {
        //             "type": "string",
        //             "description": "A list of friends/family/users allowed to participate in this pool. Max is 255, minimum of 2 persons."
        //         },
        //         "interestRate": {
        //             "type": "string",
        //             "description": "The rate of interest charged on each contributor receiving finance. Select between 1 and 300, where 1 = 0.01%."
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
        //         name: "createPermissionedPool",
        //         description: "Get the current debt of a contributor/borrower in a given pool",
        //         additionalProperties: false
        //     }
        // },
        handler: async({unitLiquidity, interestRate, contributors, durationInHour, collateralCoverageIndex}) => {
            await handleTransaction({
                callback,
                otherParam: {
                    client: publicClient,
                    wagmiConfig,
                    account,
                    txnType: 'CREATE',
                    unit: parseEther(unitLiquidity.toString()),
                },
                client: walletClient,
                router: 'Permissioned',
                createPermissionedPoolParam: {
                    account,
                    colCoverage: collateralCoverageIndex,
                    client: walletClient,
                    contributors: [contributors],
                    durationInHours: durationInHour,
                    intRate: interestRate,
                    unitLiquidity: parseEther(unitLiquidity.toString()),
                    wagmiConfig,
                    querySafe,
                    callback,
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
    unitLiquidity: number;
    contributors: Address;
}
