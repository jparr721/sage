import { homedir } from 'os';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Conversation, ConversationMeta } from '../types';

const STORAGE_DIR = join(homedir(), '.sage', 'conversations');

async function ensureStorageDir(): Promise<void> {
  const dir = Bun.file(STORAGE_DIR);
  if (!(await dir.exists())) {
    await Bun.$`mkdir -p ${STORAGE_DIR}`;
  }
}

export async function saveConversation(conversation: Conversation): Promise<void> {
  await ensureStorageDir();
  const path = join(STORAGE_DIR, `${conversation.id}.json`);
  await Bun.write(path, JSON.stringify(conversation, null, 2));
}

export async function loadConversation(id: string): Promise<Conversation | null> {
  const path = join(STORAGE_DIR, `${id}.json`);
  const file = Bun.file(path);
  if (await file.exists()) {
    return await file.json();
  }
  return null;
}

export async function listConversations(): Promise<ConversationMeta[]> {
  await ensureStorageDir();
  const glob = new Bun.Glob('*.json');
  const metas: ConversationMeta[] = [];

  for await (const filename of glob.scan(STORAGE_DIR)) {
    const path = join(STORAGE_DIR, filename);
    const file = Bun.file(path);
    const conv: Conversation = await file.json();
    metas.push({
      id: conv.id,
      title: conv.title,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      messageCount: conv.messages.length,
    });
  }

  return metas.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function createNewConversation(): Conversation {
  const now = Date.now();
  return {
    id: uuidv4(),
    title: 'New conversation',
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}
