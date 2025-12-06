import { defineCommand, runMain } from "citty";
import { render } from "ink";
import { App } from "./components/App";
import { ConversationProvider } from "./context/ConversationContext";
import { deleteAllConversations } from "./utils/storage";

const main = defineCommand({
  meta: {
    name: "sage",
    description: "Terminal chat powered by local LLM",
  },
  args: {
    resume: {
      type: "boolean",
      description: "Resume a prior conversation",
      default: false,
    },
    prune: {
      type: "boolean",
      description: "Delete all prior conversations",
      default: false,
    },
  },
  run({ args }) {
    if (args.prune) {
      return deleteAllConversations();
    }

    render(
      <ConversationProvider>
        <App resumeMode={args.resume} />
      </ConversationProvider>,
      { patchConsole: true, exitOnCtrlC: true },
    );
  },
});

runMain(main);
