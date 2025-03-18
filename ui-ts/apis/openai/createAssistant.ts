import { CommonToolArg } from "@/interfaces";
import { openAIConfig as cf } from "./helperTool/client";
import { assistant_tools } from "./tools";
import type { AssistantCreateParams } from "openai/resources/beta/assistants.mjs";
import OpenAI from "openai";

export default async function createAssistant(client: OpenAI) {
    const assistantTools : AssistantCreateParams = {
        model: cf.model,
        name: 'simplifi_assistance',
        description: "A decentralized platform for short-term peer-to-peer financing with near-zero interest. At Simplifi, everything about liquidity is controlled by the users",
        instructions: `
            From the setup to the final stage of the process, you're in control.
            The following tools are available for you to interact with the protocol through the AI assitance.
            - get_current_debt_of : Get the current debt of an address participating in a Flexpool. You will need to explicitly provide the target address (provided the target address is a contribitor) and the unit of that pool e.g if the unit of the pool is $5, simply type 5.
            - get_current_debt : Get your own debt balance of a pool provided you're a contributor in that pool.
            - get_collateral_quote : Get the amount of collatersl required to get finanace in a FlexPool.
            - join_pool : Become a contributor in a pool.
            - create_permissioned_pool : Operate/Open a new permissioned pool. The operator i.e the creator is required to provide a list of participating addresses. Only the listed addresses can participate/benefit from the pool.
            - create_permissionless_pool : Operat/Open a new permissionless pool. This type of pool is public, and anyone is free to contribute.
            - get_finance : Getting finance is a method of accessing the total liquidity balances in a pool. The total contributed liquidity for a pool is unlocked from the safe and sent to the beneficiary.
            - payback_loan : Repay the liquidity borrowed from a pool.
            - remove_pool : Remove a liquidty pool from the protocol.
            - liquidate_defaulter : Liquidate a defaulter provided the grace period is over.
        `,
        tools: assistant_tools
    }
    return await client.beta.assistants.create(assistantTools);
    // tools: Object.values(buildTools(toolArg)).map(tool => tool.definition),
}