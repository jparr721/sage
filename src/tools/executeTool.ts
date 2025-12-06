import { bash, listFiles, readFile } from "./index";

type ToolArgs = Record<string, unknown>;

const toolMap: Record<string, (args: ToolArgs) => Promise<string>> = {
  readFile: (args) => readFile(args.filename as string),
  listFiles: (args) => listFiles(args.path as string | undefined),
  bash: (args) => bash(args.command as string),
};

export async function executeTool(name: string, args: ToolArgs): Promise<string> {
  const tool = toolMap[name];

  if (!tool) {
    return `Unknown tool: ${name}`;
  }

  return tool(args);
}
