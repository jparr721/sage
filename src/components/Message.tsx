import { Box, Text } from "ink";
import { marked } from "marked";
import TerminalRenderer from "marked-terminal";
import type { Message as MessageType, ToolCall } from "ollama";

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
        {toolCall.function.name}
      </Text>
      <Text dimColor>{JSON.stringify(toolCall.function.arguments)}</Text>
    </Box>
  );
}

function ToolResultDisplay({ result }: { result: MessageType }) {
  const preview =
    result.content.length > 200 ? `${result.content.slice(0, 200)}...` : result.content;

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor="gray"
      paddingX={1}
      marginBottom={1}
    >
      <Text dimColor italic>
        Tool {result.tool_name} result:
      </Text>
      <Text dimColor>{preview}</Text>
    </Box>
  );
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const isTool = message.role === "tool";
  const roleLabel = isUser ? "You" : "Assistant";
  const roleColor = isUser ? "cyan" : "green";

  const renderedContent = marked.parse(message.content, {
    async: false,
  }) as string;

  const toolCalls = message.tool_calls ?? [];

  if (isSystem) return;

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color={roleColor}>
        {roleLabel}
      </Text>

      {isTool && (
        <Box flexDirection="column" marginLeft={2}>
          {toolCalls.map((tc, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Doesn't matter
            <Box key={i} flexDirection="column">
              <ToolCallDisplay toolCall={tc} />
              <ToolResultDisplay result={message} />
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
