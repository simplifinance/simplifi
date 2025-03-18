import OpenAi from 'openai';

export default async function createRun({assistantId, threadId, client}: CreateRunParam) {
    return await client.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: assistantId,
        tool_choice: 'auto',
        model: 'gpt-4o-mini'
    });
}

interface CreateRunParam {
    assistantId: string;
    client: OpenAi;
    threadId: string;
}