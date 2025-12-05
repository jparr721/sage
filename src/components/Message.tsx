import { Box, Text } from "ink";
import { marked } from "marked";
import TerminalRenderer from "marked-terminal";
import type { Message as MessageType } from "../types";

marked.setOptions({
  renderer: new TerminalRenderer({
    reflowText: true,
    width: 80,
  }),
});

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";
  const roleLabel = isUser ? "You" : "Assistant";
  const roleColor = isUser ? "cyan" : "green";

  const renderedContent = marked.parse(message.content, { async: false }) as string;

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color={roleColor}>
        {roleLabel}
      </Text>
      <Box marginLeft={2}>
        <Text>{renderedContent.trim()}</Text>
      </Box>
    </Box>
  );
}
