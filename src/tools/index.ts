export async function readFile(filename: string): Promise<string> {
  try {
    const file = Bun.file(filename);
    if (!file.exists()) {
      return `File name ${filename} does not exist.`;
    }

    if ((await file.stat()).isDirectory()) {
      return `File name ${filename} is a directory, not a file.`;
    }

    return file.text();
  } catch (e) {
    return `Failed to read file name ${filename} with error ${e}`;
  }
}

export function listFiles(path?: string): string {
  const result = Bun.spawnSync(["ls", "-al", path ?? "."]);
  if (result.exitCode === 0) {
    return result.stdout.toString();
  }
  return `listFiles failed with exit code ${result.exitCode}: ${result.stderr.toString()}`;
}

export function bash(command: string): string {
  const result = Bun.spawnSync(["sh", "-c", command]);
  if (result.exitCode === 0) {
    return result.stdout.toString();
  }
  return `Command failed with exit code ${result.exitCode}: ${result.stderr.toString()}`;
}

export async function grep(
  pattern: string,
  caseSensitive: boolean,
  path?: string,
  fileType?: string,
): Promise<string> {
  if (pattern === "") {
    return "grep failed: pattern is required";
  }

  const cmd = ["rg", "--line-number", "--with-filename", "--color=never"];

  if (fileType) {
    cmd.push("--type", fileType);
  }

  if (!caseSensitive) {
    cmd.push("--ignore-case");
  }

  cmd.push(pattern);
  cmd.push(path ?? ".");

  const result = Bun.spawnSync(cmd);
  if (result.exitCode === 0) {
    return result.stdout.toString();
  }
  if (result.exitCode === 1) {
    return "No matches found.";
  }
  return `grep failed with exit code ${result.exitCode}: ${result.stderr.toString()}`;
}

const tools = [
  {
    type: "function",
    function: {
      name: "readFile",
      description:
        "Read the contents of a given relative file path. Use this when you want to see what's in a file. Do not use this with directory names.",
      parameters: {
        type: "object",
        required: ["filename"],
        properties: {
          filename: {
            type: "string",
            description: "The relative path of a file in the working directory.",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "listFiles",
      description:
        "List the files and directories at a given path. If no path is provided, lists files in the current directory.",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description:
              "Optional relative path to list files from. Defaults to the current directory if no files are provided.",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "bash",
      description: "Execute a bash command and return its output. Use this to run shell commands.",
      parameters: {
        type: "object",
        required: ["command"],
        properties: {
          command: {
            type: "string",
            description: "The bash command to execute.",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "grep",
      description: "Search for patterns using ripgrep (rg). Use this to find code patterns, log entries, or any text in any directory/codebase. You can search by pattery, file type, or directory.",
      parameters: {
        type: "object",
        required: ["pattern"],
        properties: {
          pattern: {
            type: "string",
            description: "The search pattern or regex to look for (default: current working directory).",
          },
          path: {
            type: "string",
            description: "Optional path to search in (file or directory).",
          },
          fileType: {
            type: "string",
            description: "Optional file extension to limit search to (e.g. 'go', 'js', 'log').",
          },
          caseSensitive: {
            type: "boolean",
            description: "Whether the search should be case sensitive (default: false).",
          },
        },
      },
    },
  },
];

export default tools;
