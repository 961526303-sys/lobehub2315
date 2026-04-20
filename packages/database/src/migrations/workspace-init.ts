import { sql } from 'drizzle-orm';

import type { LobeChatDatabase } from '../type';

const RESOURCE_TABLES = [
  'agents',
  'sessions',
  'session_groups',
  'messages',
  'topics',
  'threads',
  'files',
  'documents',
  'knowledge_bases',
  'ai_providers',
  'ai_models',
  'api_keys',
];

/**
 * Phase A: Create a personal workspace for each existing user who doesn't have one yet.
 */
const createPersonalWorkspaces = async (db: LobeChatDatabase) => {
  const result = await db.execute(sql`
    INSERT INTO workspaces (id, slug, name, type, owner_id, created_at, updated_at, accessed_at)
    SELECT
      'ws_' || substr(md5(random()::text || u.id), 1, 12),
      'personal-' || u.id,
      COALESCE(u.username, 'Personal'),
      'personal',
      u.id,
      NOW(), NOW(), NOW()
    FROM users u
    WHERE NOT EXISTS (
      SELECT 1 FROM workspaces w WHERE w.owner_id = u.id AND w.type = 'personal'
    )
  `);
  console.info(`[workspace-init] Created personal workspaces: ${result.rowCount} rows`);
};

/**
 * Phase B: Add each user as owner of their personal workspace.
 */
const createOwnerMemberships = async (db: LobeChatDatabase) => {
  const result = await db.execute(sql`
    INSERT INTO workspace_members (workspace_id, user_id, role, joined_at)
    SELECT w.id, w.owner_id, 'owner', NOW()
    FROM workspaces w
    WHERE w.type = 'personal'
      AND NOT EXISTS (
        SELECT 1 FROM workspace_members wm
        WHERE wm.workspace_id = w.id AND wm.user_id = w.owner_id
      )
  `);
  console.info(`[workspace-init] Created owner memberships: ${result.rowCount} rows`);
};

/**
 * Phase C: Backfill workspace_id on resource tables in a single UPDATE.
 * One-time local migration — single statement is far faster than batched loops
 * on large tables (avoids repeated seq scans when NULL fraction is high).
 */
const backfillWorkspaceId = async (db: LobeChatDatabase, tableName: string) => {
  const result = await db.execute(
    sql.raw(`
      UPDATE ${tableName} t
      SET workspace_id = w.id
      FROM workspaces w
      WHERE t.workspace_id IS NULL
        AND t.user_id IS NOT NULL
        AND w.owner_id = t.user_id
        AND w.type = 'personal'
    `),
  );

  console.info(`[workspace-init] Backfilled ${tableName}: ${result.rowCount ?? 0} rows`);
};

/**
 * Run the workspace initialization migration.
 * This migration is idempotent and can be re-run safely.
 *
 * Steps:
 * 1. Create personal workspace for each user
 * 2. Add owner membership records
 * 3. Backfill workspace_id on all resource tables
 */
export const runWorkspaceInitMigration = async (db: LobeChatDatabase) => {
  console.info('[workspace-init] Starting workspace initialization migration...');

  // Phase A: Create personal workspaces
  await createPersonalWorkspaces(db);

  // Phase B: Create owner memberships
  await createOwnerMemberships(db);

  // Phase C: Backfill workspace_id on resource tables
  for (const tableName of RESOURCE_TABLES) {
    await backfillWorkspaceId(db, tableName);
  }

  console.info('[workspace-init] Workspace initialization migration completed.');
};
