import { Box, Static } from "ink";
import type { SageMessage } from "../types/index.ts";
import { Message } from "./Message";

interface Props {
  messages: SageMessage[];
}

export function MessageList({ messages }: Props) {
  return (
    <Box flexDirection="column" flexGrow={1}>
      <Static items={messages}>{(msg) => <Message key={msg.id} message={msg} />}</Static>
    </Box>
  );
}
