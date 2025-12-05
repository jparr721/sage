export interface Command {
  name: string;
  description: string;
  execute: () => void;
}

const commands: Command[] = [];

export const getCommands = (): readonly Command[] => [...commands];

export const registerCommand = (command: Command): void => {
  commands.push(command);
};
