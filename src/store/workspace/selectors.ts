import type { WorkspaceStore } from './store';

export const workspaceSelectors = {
  activeWorkspace: (s: WorkspaceStore) =>
    s.workspaces.find((w) => w.id === s.activeWorkspaceId) ?? null,

  activeWorkspaceId: (s: WorkspaceStore) => s.activeWorkspaceId,

  isLoading: (s: WorkspaceStore) => s.isWorkspaceLoading,

  isPersonalWorkspace: (s: WorkspaceStore) => {
    const active = s.workspaces.find((w) => w.id === s.activeWorkspaceId);
    return active?.type === 'personal';
  },

  isTeamWorkspace: (s: WorkspaceStore) => {
    const active = s.workspaces.find((w) => w.id === s.activeWorkspaceId);
    return active?.type === 'team';
  },

  workspaces: (s: WorkspaceStore) => s.workspaces,
};
