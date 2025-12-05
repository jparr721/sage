import { useState } from 'react';
import { Box, Text } from 'ink';
import { MessageList } from './MessageList';
import { InputBox } from './InputBox';
import { ConversationPicker } from './ConversationPicker';
import { useChat } from '../hooks/useChat';
import { useConversation } from '../context/ConversationContext';

interface AppProps {
  resumeMode?: boolean;
}

export function App({ resumeMode = false }: AppProps) {
  const [input, setInput] = useState('');
  const [pickerDone, setPickerDone] = useState(false);
  const { conversation } = useConversation();
  const { messages, isLoading, error, sendMessage } = useChat();

  const handleSubmit = (value: string) => {
    sendMessage(value);
    setInput('');
  };

  const showPicker = resumeMode && !pickerDone && conversation.messages.length === 0;

  if (showPicker) {
    return <ConversationPicker onSelected={() => setPickerDone(true)} />;
  }

  return (
    <Box flexDirection="column" padding={1}>
      <MessageList messages={messages} />

      {isLoading && (
        <Box marginY={1}>
          <Text color="yellow">Thinking...</Text>
        </Box>
      )}

      {error && (
        <Box marginY={1}>
          <Text color="red">Error: {error}</Text>
        </Box>
      )}

      <InputBox
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={isLoading}
      />
    </Box>
  );
}
