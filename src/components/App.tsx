import { Box, Text, useInput } from "ink";
import { useEffect, useState } from "react";
import { getCommands } from "../commands";
import { useConversation } from "../context/ConversationContext";
import { useChat } from "../hooks/useChat";
import { filterCommands } from "../utils/filterCommands";
import { CommandPicker } from "./CommandPicker";
import { ConversationPicker } from "./ConversationPicker";
import { InputBox } from "./InputBox";
import { MessageList } from "./MessageList";

import "../commands/refreshCommand";
import "../commands/exitCommand";

interface AppProps {
  resumeMode?: boolean;
}

export function App({ resumeMode = false }: AppProps) {
  const [input, setInput] = useState("");
  const [pickerDone, setPickerDone] = useState(false);
  const [commandIndex, setCommandIndex] = useState(0);
  const { conversation } = useConversation();
  const { messages, isLoading, error, sendMessage } = useChat();

  const showCommandPicker = input.startsWith("/");
  const filteredCommands = showCommandPicker ? filterCommands(getCommands(), input) : [];

  useEffect(() => {
    setCommandIndex(0);
  }, [input]);

  useInput(
    (char, key) => {
      if (key.escape) {
        setInput("");
        return;
      }

      if (key.return) {
        const command = filteredCommands[commandIndex];
        if (command) {
          command.execute();
          setInput("");
        }
        return;
      }

      if (key.upArrow) {
        setCommandIndex((i) => Math.max(0, i - 1));
        return;
      }

      if (key.downArrow) {
        setCommandIndex((i) => Math.min(filteredCommands.length - 1, i + 1));
        return;
      }
    },
    { isActive: showCommandPicker },
  );

  const handleSubmit = (value: string) => {
    if (value.startsWith("/")) {
      const command = filteredCommands[commandIndex];
      if (command) {
        command.execute();
        setInput("");
      }
      return;
    }
    sendMessage(value);
    setInput("");
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

      {showCommandPicker && <CommandPicker filter={input} selectedIndex={commandIndex} />}

      <InputBox value={input} onChange={setInput} onSubmit={handleSubmit} disabled={isLoading} />
    </Box>
  );
}
