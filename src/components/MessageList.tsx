import { Box, Static } from "ink";
import type { Message as MessageType } from "../types";
import { Message } from "./Message";

interface Props {
  messages: MessageType[];
}

export function MessageList({ messages }: Props) {
  return (
    <Box flexDirection="column" flexGrow={1}>
      <Static items={messages}>{(msg) => <Message key={msg.id} message={msg} />}</Static>
    </Box>
  );
}
