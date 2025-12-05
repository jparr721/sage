import { Box, Text } from "ink";
import { getCommands } from "../commands";
import { filterCommands } from "../utils/filterCommands";

interface CommandPickerProps {
  filter: string;
  selectedIndex: number;
}

export function CommandPicker({ filter, selectedIndex }: CommandPickerProps) {
  const commands = getCommands();
  const filtered = filterCommands(commands, filter);

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="magenta" paddingX={1}>
      <Box marginBottom={1}>
        <Text bold color="magenta">
          Commands
        </Text>
      </Box>

      {filtered.length === 0 ? (
        <Box>
          <Text dimColor>No matching commands</Text>
        </Box>
      ) : (
        filtered.map((cmd, index) => (
          <Box key={cmd.name}>
            <Text color="gray">{index === selectedIndex ? " ▸ " : "   "}</Text>
            <Text bold inverse={index === selectedIndex} color="cyan">
              /{cmd.name}
            </Text>
            <Text dimColor>
              {"  "}
              {cmd.description}
            </Text>
          </Box>
        ))
      )}

      <Box
        marginTop={1}
        borderStyle="single"
        borderTop
        borderBottom={false}
        borderLeft={false}
        borderRight={false}
        borderColor="gray"
      >
        <Text dimColor>↑↓ navigate ⏎ select esc cancel</Text>
      </Box>
    </Box>
  );
}
