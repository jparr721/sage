# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run index.ts           # Run the application
bun run index.ts --resume  # Resume a prior conversation
just run                   # Alternative using justfile
bun test                   # Run tests
bun test <file>            # Run a specific test file
```

## Architecture

Sage is a terminal-based chat application using React rendered to the CLI via Ink. It connects to a local Ollama instance for LLM inference.

### Project Structure

```
index.ts                      # Entry point, imports src/sage.tsx
src/
├── sage.tsx                  # CLI entry with citty, renders App with ConversationProvider
├── components/
│   ├── App.tsx               # Main app component, orchestrates UI
│   ├── ConversationPicker.tsx # Resume conversation selector (ink-select-input)
│   ├── InputBox.tsx          # Text input with ink-text-input
│   ├── Message.tsx           # Single message with markdown rendering
│   └── MessageList.tsx       # Static list of messages
├── context/
│   └── ConversationContext.tsx # React context for conversation state
├── hooks/
│   └── useChat.ts            # Chat actions, API calls, persistence
├── queries/
│   └── chat.ts               # Ollama SDK client (127.0.0.1:11434)
├── types/
│   └── index.ts              # Message, Conversation, ConversationMeta types
└── utils/
    └── storage.ts            # Conversation persistence (~/.sage/conversations/)
```

### Data Flow

1. `sage.tsx` parses CLI args via citty, wraps App in `ConversationProvider`
2. User types in `InputBox` → `App.handleSubmit` → `useChat.sendMessage`
3. `useChat` updates conversation via context, calls `chat()` API
4. Response from Ollama added as assistant message
5. Conversation auto-saved to `~/.sage/conversations/{id}.json`
6. `--resume` flag shows `ConversationPicker` to load prior conversations

### Key Dependencies

- **Ink** - React renderer for interactive CLI apps
- **citty** - CLI argument parsing
- **Ollama SDK** - Native Ollama API (model: `ministral-3:3b`)
- **ink-select-input** - Conversation picker UI
- **marked + marked-terminal** - Markdown rendering in terminal
- **uuid** - Conversation/message IDs

## Code Style

### Coding
You should always make sure you carefully review other sources of the same code. This ensures that we are not re-inventing anything. You should focus on changes that are repeatable and concise, choosing clarity above all else.

### Functional Programming

- **One function per file** - Each exported function should live in its own file. Name the file after the function.
- **Immutability** - Never mutate data. Use spread operators, `map`, `filter`, `reduce`. Return new objects/arrays.
- **Pure functions** - Prefer pure functions with no side effects. Isolate side effects (I/O, state) at the edges.
- **No classes** - Use plain functions and closures. React components are the exception.
- **Composition over inheritance** - Build complex behavior by composing small functions.

```ts
// Good: Pure, immutable
const addMessage = (messages: Message[], newMsg: Message): Message[] =>
  [...messages, newMsg];

// Bad: Mutating
const addMessage = (messages: Message[], newMsg: Message) => {
  messages.push(newMsg); // Don't do this
  return messages;
};
```

## Bun Conventions

Default to Bun instead of Node.js:
- `bun <file>` instead of `node` or `ts-node`
- `bun test` instead of jest/vitest
- `bun install` instead of npm/yarn/pnpm
- Bun auto-loads `.env` - don't use dotenv

**Prefer Bun APIs:**
- `Bun.serve()` over express
- `bun:sqlite` over better-sqlite3
- `Bun.file` over node:fs readFile/writeFile
- `Bun.$\`cmd\`` over execa
- `Bun.Glob` for file pattern matching
- `Bun.write` for file writes

**Testing:**
```ts
import { test, expect } from "bun:test";

test("example", () => {
  expect(1).toBe(1);
});
```
