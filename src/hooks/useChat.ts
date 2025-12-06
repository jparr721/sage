import type { Message } from "ollama";
import { useCallback, useState } from "react";
import { useConversation } from "../context/ConversationContext";
import { chat } from "../queries/chat";
import { saveConversation } from "../utils/storage";

export function useChat() {
  const { conversation, setConversation } = useConversation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messages = conversation.messages;

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        role: "user",
        content,
      };

      setConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        updatedAt: Date.now(),
        title: prev.messages.length === 0 ? content.slice(0, 50) : prev.title,
      }));

      setIsLoading(true);
      setError(null);

      try {
        const apiMessages = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        await chat(apiMessages, (updatedMessages) => {
          setConversation((prev) => {
            const newConv = { ...prev, messages: updatedMessages, updatedAt: Date.now() };
            saveConversation(newConv);
            return newConv;
          });
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to get response");
      } finally {
        setIsLoading(false);
      }
    },
    [messages, setConversation],
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    conversationId: conversation.id,
  };
}
