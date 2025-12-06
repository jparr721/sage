import type { Message } from "ollama";
import ollama from "ollama";
import tools from "../tools";
import { executeTool } from "../tools/executeTool";
import type { ToolCall, ToolResult } from "../types";

export interface AgentState {
  content: string;
  toolCalls: ToolCall[];
  toolResults: ToolResult[];
  done: boolean;
}

export async function chat(messages: Message[]): Promise<Message[]> {
  const conversationMessages: Message[] = [...messages];

  while (true) {
    const response = await ollama.chat({
      model: "qwen3",
      messages: conversationMessages,
      tools,
      think: false,
    });
    const { message } = response;
    const { tool_calls: toolCalls } = message;

    conversationMessages.push(message);

    if (toolCalls) {
      for (const call of toolCalls) {
        const result = await executeTool(call.function.name, call.function.arguments);
        conversationMessages.push({
          role: "tool",
          content: String(result),
          tool_name: call.function.name,
        });
      }
    } else {
      break;
    }
  }

  return conversationMessages;
}
