import { Box, Static } from "ink";
import type { Message as Msg } from "ollama";
import { Message } from "./Message";

interface Props {
  messages: Msg[];
}

export function MessageList({ messages }: Props) {
  return (
    <Box flexDirection="column" flexGrow={1}>
      <Static items={messages}>{(msg, i) => <Message key={i} message={msg} />}</Static>
    </Box>
  );
}
