import OpenAI from "openai";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { Thread } from "openai/resources/beta/threads/threads";
import { CommonToolArg } from "@/interfaces";
import { buildTools } from "../tools";

export default async function handleRunToolCalls(run:Run, client: OpenAI, thread: Thread, toolArg: CommonToolArg) : Promise<Run> {
    const toolCalls = run.required_action?.submit_tool_outputs?.tool_calls;
    if(!toolCalls) return run;
    let returnObj = {
        tool_call_id: '',
        output: ''
    };
    const toolOutputs = await Promise.all(
        toolCalls.map(async(tool) => {
            const toolConfig = buildTools(toolArg)?.[tool.function.name];
            if(!toolConfig) {
                console.error(`Tool ${tool.function.name} not found`);
                return null;
            }
            console.log("tool.function.name", tool.function.name)
            console.log("tool.function.arguments", tool.function.arguments)
            try {
                const args = JSON.parse(tool.function.arguments);
                const outputs = await toolConfig.handler(args);
                returnObj = {
                    tool_call_id: tool.id,
                    output: String(outputs)
                }
            } catch (error) {
                const errorMessage = error instanceof Error? error.message : String(error);
                returnObj = {
                    tool_call_id: tool.id,
                    output: `Error: ${errorMessage}`
                }
            }
            return returnObj;
        })
    );
    const validOutputs = toolOutputs.filter(Boolean) as OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput[];
    if(validOutputs.length === 0) return run;
    console.log("Tool output: ",validOutputs);
    return client.beta.threads.runs.submitToolOutputsAndPoll(
        thread.id,
        run.id,
        { tool_outputs: validOutputs}
    );
}