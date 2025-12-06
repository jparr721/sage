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

    if (toolCalls) {
      // This is a tool call message, so quickly extract the relevant details for use later.
      // We mark this as a tool here instead of assistant since it just stores the function
      // calls and no other content (I think).
      conversationMessages.push({ ...message, role: 'tool' });
      for (const call of toolCalls) {
        const result = await executeTool(call.function.name, call.function.arguments);
        conversationMessages.push({
          role: "tool",
          content: String(result),
          tool_name: call.function.name,
        });
      }
    } else {
      // This is a non tool-call message (the content for those is empty), so append.
      conversationMessages.push(message);
      break;
    }
  }

  return conversationMessages;
}
