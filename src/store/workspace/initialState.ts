'use client';

import type { WorkspaceItem } from '@lobechat/database/schemas';

export interface WorkspaceState {
  activeWorkspaceId: string | null;
  isWorkspaceLoading: boolean;
  workspaces: (WorkspaceItem & { role?: string })[];
}

export const initialWorkspaceState: WorkspaceState = {
  activeWorkspaceId: null,
  isWorkspaceLoading: false,
  workspaces: [],
};
