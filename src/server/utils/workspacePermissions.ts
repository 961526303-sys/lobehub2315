export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'member';

const ROLE_RANK: Record<WorkspaceRole, number> = {
  admin: 3,
  editor: 2,
  member: 1,
  owner: 4,
};

/**
 * True when `role` satisfies at least the `min` role level.
 *
 * Kept in the community package so `workspaceAuth` middleware / workspace router
 * can gate on owner/admin in Personal Workspace. Cloud's override extends this
 * with team-specific permission matrices.
 */
export const hasMinRole = (role: WorkspaceRole, min: WorkspaceRole): boolean =>
  ROLE_RANK[role] >= ROLE_RANK[min];
