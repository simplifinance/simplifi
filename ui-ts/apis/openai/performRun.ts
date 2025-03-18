import { MessageContent } from "openai/resources/beta/threads/messages";
import createRun from "./createRun"
import handleRunToolCalls from "./helperTool/handleRunToolCall";
import OpenAi from 'openai';
import { CommonToolArg,} from "@/interfaces";
import { openAIConfig } from "./helperTool/client";
import { createThread } from "./helperTool/createThread";

export default async function performRun({userPrompt, toolArg} : PerformRunProp) {
    let errorMessage = '';
    let returnObj : MessageContent = {
        type: 'text',
        text: {
            value: 'No response from assistant',
            annotations: []
        }
    };

    let client = new OpenAi({
        apiKey: openAIConfig.apiKey,
        dangerouslyAllowBrowser: true
    });

    // const assistant = await createAssistant(client);
    const assistantId = process.env.NEXT_PUBLIC_ASSISTANT_ID;
    await client.beta.assistants.update(assistantId, {tools: assistant})
    let thread = await createThread(client, userPrompt)
    let run = await createRun({assistantId: assistantId, threadId: thread.id, client,});
    console.log("Run started:", run);
    while (run.status === "in_progress" || run.status === 'queued') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        run = await client.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // If the run requires any function call, then we can to make use of the tool
    // && run.required_action?.type === 'submit_tool_outputs'
    while (run.status === 'requires_action' ) {
        console.log("Yes action");
        run = await handleRunToolCalls(run, client, thread, toolArg);
    }
    console.log("No action");

    switch (run.status) {
        case 'failed':
            errorMessage = `Oops! I encountered an error: ${run.last_error?.message || 'Error unknown'}`;
            console.log("Run failed: ", run.last_error);
            
            // Return error message to user in the same thread
            await client.beta.threads.messages.create(thread.id, {
                role: 'assistant',
                content: errorMessage
            });
            returnObj.text.value = errorMessage;
            break;
    
        default:
            // Return error message to user in the same thread
            await client.beta.threads.messages.create(thread.id, {
                role: 'assistant',
                content: "I can't find anything"
            });
           
            break;

    }
    // console.log("Run end");
    const messages = await client.beta.threads.messages.list(thread.id);
    const messagesFromAssistant = messages.data.find(message => message.role === 'assistant');
    // console.log("messagesFromAssistant", messagesFromAssistant?.content[0]);
    returnObj.text = messagesFromAssistant?.content[0];
    // console.log("returnObj", returnObj);

    return {
        assistantMsg: returnObj,
        run
    };
}

interface PerformRunProp {
    userPrompt: string;
    assistantId?: string;
    toolArg: CommonToolArg
}