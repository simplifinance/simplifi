import { Address, CommonToolArg, ToolConfigProperties, } from "@/interfaces";
import { getMyCurrentDebt } from "./getMyCurrentDebt";
import { getCurrentDebtOf } from "./getCurrentDebtOf";
import { createPermissionlessPool } from "./createPermissionlessPool";
import { createPermissionedPool } from "./createPermissionedPool";
import { addUserToPool } from "./addUserToPool";
import { get_CollateralQuote } from "./getCollateralQuote";
import { getFinance } from "./getFinance";
import { payback } from "./payback";
import { liquidate } from "./liquidate";
import { removePool } from "./removePool";
import { AssistantTool } from "openai/resources/beta/assistants.mjs";

export function buildTools(toolArg : CommonToolArg) : Record<string, ToolConfigProperties>  {
    return {
        "getMyCurrentDebt": getMyCurrentDebt(),
        "getCurrentDebtOf": getCurrentDebtOf(toolArg.wagmiConfig.getClient()?.account?.address as Address),
        "getCollateralQuote": get_CollateralQuote(),
        "createPermissionlessPool": createPermissionlessPool(toolArg),
        "createPermissionedPool": createPermissionedPool(toolArg),
        "addUserToPool": addUserToPool(toolArg),
        "getFinance": getFinance(toolArg),
        "payback": payback(toolArg),
        "liquidate": liquidate(toolArg),
        "removePool": removePool(toolArg)
    }
}

export const assistant_tools : AssistantTool[] = [
    {
        type: 'function',
        function: {
            "name": "getMyCurrentDebt",
            "description": "Get the current debt of connected user or contributor. This is the same as their loan balances or the amount they borrowed from the pool. Users in this protocol are referred to as contributors.",
            "strict": true,
            "parameters": {
                "type": "object",
                "required": [
                    "unitLiquidity"
                ],
                "properties": {
                    "unitLiquidity": {
                        "type": "string",
                        "description": "The contribution of the pool e.g 1 = $1, 5 = $5, e.t.c"
                    }
                },
                "additionalProperties": false
            },
        },
    },
    {
        type: 'function',
        function: {
            "name": "getCurrentDebtOf",
            "description": "Get the current debt of an address given as argument user or contributor. This is the same as their loan balances or the amount they borrowed from the pool. Users in this protocol are referred to as contributors.  The caller must provide an address as an argument",
            "strict": true,
            "parameters": {
                "type": "object",
                "required": [
                    "target",
                    "unitLiquidity"
                ],
                "properties": {
                    "target": {
                    "type": "string",
                    "description": "The target address to get the current debt"
                    },
                    "unitLiquidity": {
                    "type": "string",
                    "description": "The contribution of the pool e.g 1 = $1, 5 = $5, e.t.c"
                    }
                },
                "additionalProperties": false
            },
        },
    },
    {
        type: 'function',
        function: {
            "name": "liquidate",
            "description": "This action removes a contributor from a pool if they default to paying back the borrowed fund within the set duration, liquidate their position, and their collateral balances is fully transfered to the liquidator",
            "strict": true,
            "parameters": {
                "type": "object",
                "required": [
                    "unitLiquidity"
                ],
                "properties": {
                    "unitLiquidity": {
                        "type": "string",
                        "description": "Amount provided by each participant as liquidity or contribution."
                    }
                },
                "additionalProperties": false
            },
        },
    },
    {
        type: 'function',
        function: 
        {
            "name": "payback",
            "description": "Pay back the borrowed liquidity to the Safe so others can have access to it",
            "strict": true,
            "parameters": {
                "type": "object",
                "required": [
                "unitLiquidity"
                ],
                "properties": {
                "unitLiquidity": {
                    "type": "string",
                    "description": "Amount provided by each participant as liquidity or contribution."
                }
                },
                "additionalProperties": false
            },
        },
    },
    {
        type: 'function',
        function: {
            "name": "removePool",
            "description": "Cancel the operation of a FlexPool. For a permissionless pool, it should only be done if the quorum is 1. For a permissioned pool, the total liquidity/currentPool must equal to the unit contribution. Only the creator is allowed to remove a pool",
            "strict": true,
            "parameters": {
                "type": "object",
                "required": [
                    "unitLiquidity"
                ],
                "properties": {
                    "unitLiquidity": {
                    "type": "string",
                    "description": "Amount provided by each participant as liquidity or contribution."
                    }
                },
                "additionalProperties": false
            },
        },
    },
    {
        type: 'function',
        function: {
            "name": "getFinance",
            "description": "Utility for accessing the liquidity privilege of a pool. It is simply a tool to get finance. The contributor/borrower have enough collateral in native token e.g Celo in order to get finance. Please use the 'getCollateralQuote' tool to preview the collateral needed.",
            "strict": true,
            "parameters": {
            "type": "object",
            "required": [
                "unitLiquidity"
            ],
            "properties": {
                    "unitLiquidity": {
                    "type": "string",
                    "description": "Utility for accessing the liquidity privilege of a pool. It is simply a tool to get finance. The contributor/borrower have enough collateral in native token e.g Celo in order to get finance. Please use the 'getCollateralQuote' tool to preview the collateral needed.",
                }
            },
                "additionalProperties": false
            },
        },
    },
    {
        type: 'function',
        function: {
            "name": "getCollateralQuote",
            "description": "Get the required amount of collateral (in native coin) a contributor will deposit to access the liquidity of a pool or getFinance",
            "strict": true,
            "parameters": {
            "type": "object",
            "required": [
                "unitLiquidity"
            ],
            "properties": {
                "unitLiquidity": {
                "type": "string",
                "description": "The unit contribution of the pool e.g 1 = $1, 5 = $5, 100 = $100 e.t.c"
                }
            },
                "additionalProperties": false
            },
        },
    },
    {
        type: 'function',
        function: {
            "name": "createPermissionlessPool",
            "description": "Set up a new permissionless liquidity pool for a specific amount. The unit contribution must not be in existence.",
            "strict": true,
            "parameters": {
            "type": "object",
            "required": [
                "unitLiquidity",
                "collateralCoverageIndex",
                "quorum",
                "interestRate",
                "duration"
            ],
            "properties": {
                "unitLiquidity": {
                    "type": "number",
                    "description": "Amount provided by each participant as liquidity or contribution."
                },
                "collateralCoverageIndex": {
                    "type": "string",
                    "description": "Collateral factor/coverage is usually determined by the operator of FlexPool at the time of creation. This is the percentage of loan that is secured by discounting the value of Celo."
                },
                "quorum": {
                    "type": "number",
                    "description": "The maximum number of users that can participate in a flexpool. Generally, the minimum number of participants in any FlexPool is 2 while the maximum is 255."
                },
                "interestRate": {
                    "type": "string",
                    "description": "The rate of interest to charge on each contributor that gets finance. Select between 1 and 300. 1 = 0.01%."
                },
                "duration": {
                    "type": "number",
                    "description": "How long a user should utilize the borrowed fund before they can pay back."
                }
            },
                "additionalProperties": false
            },
        },
    },
    {
        type: 'function',
        function: {
            "name": "createPermissionedPool",
            "description": "Get the current debt of a contributor/borrower in a given pool",
            "strict": true,
            "parameters": {
            "type": "object",
            "required": [
                "unitLiquidity",
                "collateralCoverageIndex",
                "contributors",
                "interestRate",
                "duration"
            ],
            "properties": {
                "unitLiquidity": {
                    "type": "number",
                    "description": "Amount provided by each participant as liquidity or contribution."
                },
                "collateralCoverageIndex": {
                    "type": "string",
                    "description": "Collateral factor/coverage usually determined by the operator of FlexPool at creation time. This is the percentage of loan secured by discounting the value of Celo."
                },
                "contributors": {
                    "type": "string",
                    "description": "A list of friends/family/users allowed to participate in this pool. Max is 255, minimum of 2 persons."
                },
                "interestRate": {
                    "type": "string",
                    "description": "The rate of interest charged on each contributor receiving finance. Select between 1 and 300, where 1 = 0.01%."
                },
                "duration": {
                    "type": "number",
                    "description": "How long a user should utilize the borrowed fund before they can pay back."
                }
            },
                "additionalProperties": false
            },
        },
    },
    {
        type: 'function',
        function: {
            "name": "addUserToPool",
            "description": "Become a contributor in a pool by joining the pool, and send your quota",
            "strict": true,
            "parameters": {
                "type": "object",
                "required": [
                    "unitLiquidity"
                ],
                "properties": {
                    "unitLiquidity": {
                        "type": "number",
                        "description": "Amount provided by each participant as liquidity or contribution."
                    }
                },
                "additionalProperties": false
            },
        }
    },
]