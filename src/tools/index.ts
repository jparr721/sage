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

export async function listFiles(path?: string): Promise<string> {
  try {
    return Bun.$`ls -al ${path ?? "."}`.text();
  } catch (e) {
    return `Failed to run listFiles on path ${path} with error ${e}`;
  }
}

export async function bash(command: string): Promise<string> {
  try {
    return Bun.$`sh -c ${command}`.text();
  } catch (e) {
    return `Failed to run bash command ${command} with error ${e}`;
  }
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
];

export default tools;
