import OpenAI from "openai";
import type { ChatCompletion } from "openai/resources";
import tools from "../tools";

export async function chat(
  messages: OpenAI.ChatCompletionMessageParam[] = [],
): Promise<ChatCompletion> {
  const client = new OpenAI({
    apiKey: "ollama",
    baseURL: "http://127.0.0.1:11434/v1/",
  });

  const completion = await client.chat.completions.create({
    model: "gpt-oss:20b",
    messages,
    tools,
  });

  return completion;
}
