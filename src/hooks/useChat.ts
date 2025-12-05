import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { chat } from '../queries/chat';
import { saveConversation } from '../utils/storage';
import { useConversation } from '../context/ConversationContext';
import type { Message } from '../types';

export function useChat() {
  const { conversation, setConversation } = useConversation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messages = conversation.messages;

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      updatedAt: Date.now(),
      title: prev.messages.length === 0 ? content.slice(0, 50) : prev.title,
    }));

    setIsLoading(true);
    setError(null);

    try {
      const apiMessages = [...messages, userMessage].map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      }));

      const response = await chat(apiMessages);
      const assistantContent = response.choices[0]?.message?.content ?? '';

      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: assistantContent,
        timestamp: Date.now(),
      };

      setConversation(prev => {
        const updated = {
          ...prev,
          messages: [...prev.messages, assistantMessage],
          updatedAt: Date.now(),
        };
        saveConversation(updated);
        return updated;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  }, [messages, setConversation]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    conversationId: conversation.id,
  };
}
