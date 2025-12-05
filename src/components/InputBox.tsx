import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

interface InputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export function InputBox({ value, onChange, onSubmit, disabled }: InputBoxProps) {
  const handleSubmit = (text: string) => {
    if (text.trim() && !disabled) {
      onSubmit(text);
    }
  };

  return (
    <Box borderStyle="round" borderColor="gray" paddingX={1}>
      <Text color="gray">&gt; </Text>
      <TextInput
        value={value}
        onChange={onChange}
        onSubmit={handleSubmit}
        placeholder={disabled ? 'Waiting for response.' : 'Type your message.'}
      />
    </Box>
  );
}
