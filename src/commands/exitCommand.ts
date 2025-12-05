import { registerCommand } from "./index";

export const exitCommand = {
  name: "exit",
  description: "Exit the application",
  execute: () => process.exit(0),
};

registerCommand(exitCommand);
