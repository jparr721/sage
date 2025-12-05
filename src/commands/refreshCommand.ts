import { registerCommand } from "./index";

export const refreshCommand = {
  name: "refresh",
  description: "Refresh the system state",
  execute: () => {},
};

registerCommand(refreshCommand);
