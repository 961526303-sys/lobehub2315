import * as dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const env = process.env.NODE_ENV || 'development';
dotenvExpand.expand(dotenv.config());
dotenvExpand.expand(dotenv.config({ override: true, path: `.env.${env}` }));
dotenvExpand.expand(dotenv.config({ override: true, path: `.env.${env}.local` }));

const run = async () => {
  const { serverDB } = await import('../../packages/database/src/server');
  const { runWorkspaceInitMigration } =
    await import('../../packages/database/src/migrations/workspace-init');

  await runWorkspaceInitMigration(serverDB);
  process.exit(0);
};

if (!process.env.DATABASE_URL) {
  console.log('🟢 DATABASE_URL not set, skip.');
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ workspace init failed:', err);
  process.exit(1);
});
