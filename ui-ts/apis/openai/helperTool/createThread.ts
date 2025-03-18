import { Thread } from "openai/resources/beta/threads/threads.mjs";
import OpenAi from 'openai';

export async function createThread(client: OpenAi, userPrompt: string) : Promise<Thread> {
    const thread = await client.beta.threads.create({
        messages: [
            {
                role: 'user',
                content: userPrompt
            }
        ],
    });
    return thread;
}