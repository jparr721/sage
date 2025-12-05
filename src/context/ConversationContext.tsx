import { createContext, useContext, useState, type ReactNode } from 'react';
import { createNewConversation } from '../utils/storage';
import type { Conversation } from '../types';

interface ConversationContextValue {
  conversation: Conversation;
  setConversation: (conversation: Conversation | ((prev: Conversation) => Conversation)) => void;
}

const ConversationContext = createContext<ConversationContextValue | null>(null);

interface ProviderProps {
  children: ReactNode;
}

export function ConversationProvider({ children }: ProviderProps) {
  const [conversation, setConversation] = useState<Conversation>(createNewConversation);

  return (
    <ConversationContext.Provider value={{ conversation, setConversation }}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation(): ConversationContextValue {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
}
