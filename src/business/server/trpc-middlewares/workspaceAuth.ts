import { authedProcedure } from '@/libs/trpc/lambda';
import { trpc } from '@/libs/trpc/lambda/init';

export type WorkspaceRole = 'admin' | 'editor' | 'member' | 'owner';

export const cloudWorkspaceAuth = trpc.middleware(async (opts) => opts.next());

export const lobeWorkspaceAuth = trpc.middleware(async (opts) => opts.next());

export const requireWorkspaceRole = (_minRole: WorkspaceRole) =>
  trpc.middleware(async (opts) => opts.next());

export const wsProcedure = authedProcedure;

export const wsAdminProcedure = authedProcedure;

export const wsOwnerProcedure = authedProcedure;
