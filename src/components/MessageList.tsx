import { Box, Static } from 'ink';
import { Message } from './Message';
import type { Message as MessageType } from '../types';

interface Props {
  messages: MessageType[];
}

export function MessageList({ messages }: Props) {
  return (
    <Box flexDirection="column" flexGrow={1}>
      <Static items={messages}>
        {(msg) => <Message key={msg.id} message={msg} />}
      </Static>
    </Box>
  );
}
