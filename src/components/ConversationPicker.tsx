import { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import { listConversations, loadConversation } from '../utils/storage';
import { useConversation } from '../context/ConversationContext';
import type { ConversationMeta } from '../types';

interface PickerProps {
  onSelected: () => void;
}

export function ConversationPicker({ onSelected }: PickerProps) {
  const { setConversation } = useConversation();
  const [conversations, setConversations] = useState<ConversationMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listConversations()
      .then(setConversations)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (item: { value: string }) => {
    const loaded = await loadConversation(item.value);
    if (loaded) {
      setConversation(loaded);
      onSelected();
    }
  };

  if (loading) {
    return (
      <Box padding={1}>
        <Text color="yellow">Loading conversations...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box padding={1}>
        <Text color="red">Error: {error}</Text>
      </Box>
    );
  }

  if (conversations.length === 0) {
    return (
      <Box padding={1}>
        <Text dimColor>No saved conversations found.</Text>
      </Box>
    );
  }

  const items = conversations.map(conv => ({
    label: `${conv.title} (${new Date(conv.updatedAt).toLocaleDateString()})`,
    value: conv.id,
  }));

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="magenta">Sage</Text>
        <Text dimColor> — Select a conversation</Text>
      </Box>

      <SelectInput items={items} onSelect={handleSelect} />

      <Box marginTop={1}>
        <Text dimColor>↑/↓ to navigate, Enter to select</Text>
      </Box>
    </Box>
  );
}
