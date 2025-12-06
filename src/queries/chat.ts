import type { Message } from "ollama";
import ollama from "ollama";
import tools from "../tools";
import { executeTool } from "../tools/executeTool";

export async function chat(
  messages: Message[],
  onUpdate: (messages: Message[]) => void
): Promise<void> {
  const conversationMessages: Message[] = [...messages];

  while (true) {
    const response = await ollama.chat({
      model: "qwen3",
      messages: conversationMessages,
      tools,
      think: false,
      keep_alive: -1,
    });
    const { message } = response;
    const { tool_calls: toolCalls } = message;

    conversationMessages.push(message);
    onUpdate([...conversationMessages]);

    if (toolCalls && toolCalls.length > 0) {
      for (const call of toolCalls) {
        const result = await executeTool(call.function.name, call.function.arguments);
        conversationMessages.push({
          role: "tool",
          content: String(result),
          tool_name: call.function.name,
        });
        onUpdate([...conversationMessages]);
      }
    } else {
      break;
    }
  }
}
