import { Box, Text } from "ink";
import { marked } from "marked";
import TerminalRenderer from "marked-terminal";
import type { Message as MessageType, ToolCall, ToolResult } from "../types";

marked.setOptions({
  renderer: new TerminalRenderer({
    reflowText: true,
    width: 80,
  }),
});

interface MessageProps {
  message: MessageType;
}

function ToolCallDisplay({ toolCall }: { toolCall: ToolCall }) {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="yellow" paddingX={1} marginY={1}>
      <Text bold color="yellow">
        {toolCall.name}
      </Text>
      <Text dimColor>{toolCall.arguments}</Text>
    </Box>
  );
}

function ToolResultDisplay({ result }: { result: ToolResult }) {
  const preview = result.result.length > 200 ? `${result.result.slice(0, 200)}...` : result.result;

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor="gray"
      paddingX={1}
      marginBottom={1}
    >
      <Text dimColor italic>
        {result.name} result:
      </Text>
      <Text dimColor>{preview}</Text>
    </Box>
  );
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const roleLabel = isUser ? "You" : "Assistant";
  const roleColor = isUser ? "cyan" : "green";

  const renderedContent = marked.parse(message.content, {
    async: false,
  }) as string;

  const toolCalls = message.toolCalls ?? [];
  const toolResults = message.toolResults ?? [];

  if (isSystem) return;

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color={roleColor}>
        {roleLabel}
      </Text>

      {toolCalls.length > 0 && (
        <Box flexDirection="column" marginLeft={2}>
          {toolCalls.map((tc, i) => (
            <Box key={tc.id} flexDirection="column">
              <ToolCallDisplay toolCall={tc} />
              {toolResults[i] && <ToolResultDisplay result={toolResults[i]} />}
            </Box>
          ))}
        </Box>
      )}

      {message.content && (
        <Box marginLeft={2}>
          <Text>{renderedContent.trim()}</Text>
        </Box>
      )}
    </Box>
  );
}
