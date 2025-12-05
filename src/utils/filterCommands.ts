import type { Command } from "../commands";

export const filterCommands = (commands: readonly Command[], query: string): Command[] => {
  const normalizedQuery = query.toLowerCase().replace(/^\//, "");

  if (!normalizedQuery) {
    return [...commands];
  }

  return commands.filter(
    (cmd) =>
      cmd.name.toLowerCase().includes(normalizedQuery) ||
      cmd.description.toLowerCase().includes(normalizedQuery),
  );
};
