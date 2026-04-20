'use client';

import { type SWRResponse } from 'swr';

import { useClientDataSWR } from '@/libs/swr';
import type { WorkspaceRole } from '@/server/utils/workspacePermissions';
import { workspaceService } from '@/services/workspace';
import { type StoreSetter } from '@/store/types';
import { setNamespace } from '@/utils/storeDebug';

import type { WorkspaceStore } from '../store';

export const FETCH_WORKSPACES_KEY = 'workspace/list';
export const FETCH_WORKSPACE_MEMBERS_KEY = 'workspace/members';

const n = setNamespace('workspace');

const WORKSPACE_STORAGE_KEY = 'lobe-workspace-active-id';

type Setter = StoreSetter<WorkspaceStore>;

export const createWorkspaceSlice = (set: Setter, get: () => WorkspaceStore, _api?: unknown) =>
  new WorkspaceActionImpl(set, get, _api);

export class WorkspaceActionImpl {
  readonly #get: () => WorkspaceStore;
  readonly #set: Setter;

  constructor(set: Setter, get: () => WorkspaceStore, _api?: unknown) {
    void _api;
    this.#set = set;
    this.#get = get;
  }

  switchWorkspace = (id: string) => {
    this.#set({ activeWorkspaceId: id }, false, n('switchWorkspace'));

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(WORKSPACE_STORAGE_KEY, id);
    }
  };

  restoreActiveWorkspace = () => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (stored) {
      this.#set({ activeWorkspaceId: stored }, false, n('restoreActiveWorkspace'));
    }
  };

  setWorkspaces = (workspaces: WorkspaceStore['workspaces']) => {
    this.#set({ workspaces }, false, n('setWorkspaces'));

    // If no active workspace but we have workspaces, set the first one
    const state = this.#get();
    if (!state.activeWorkspaceId && workspaces.length > 0) {
      const personal = workspaces.find((w) => w.type === 'personal');
      if (personal) {
        this.switchWorkspace(personal.id);
      }
    }
  };

  setMembers = (members: WorkspaceStore['members']) => {
    this.#set({ members }, false, n('setMembers'));
  };

  setMyRole = (role: WorkspaceRole | null) => {
    this.#set({ myRole: role }, false, n('setMyRole'));
  };

  setWorkspaceLoading = (loading: boolean) => {
    this.#set({ isWorkspaceLoading: loading }, false, n('setWorkspaceLoading'));
  };

  useFetchWorkspaces = (
    isLogin: boolean | undefined,
  ): SWRResponse<WorkspaceStore['workspaces']> => {
    return useClientDataSWR<WorkspaceStore['workspaces']>(
      isLogin ? [FETCH_WORKSPACES_KEY] : null,
      () => workspaceService.list() as Promise<WorkspaceStore['workspaces']>,
      {
        fallbackData: [],
        onSuccess: (data) => {
          this.setWorkspaces(data);
        },
      },
    );
  };

  useFetchWorkspaceMembers = (
    enabled: boolean,
    workspaceId: string | null,
    currentUserId?: string,
  ): SWRResponse<WorkspaceStore['members']> => {
    return useClientDataSWR<WorkspaceStore['members']>(
      enabled && workspaceId ? [FETCH_WORKSPACE_MEMBERS_KEY, workspaceId] : null,
      () => workspaceService.listMembers() as Promise<WorkspaceStore['members']>,
      {
        fallbackData: [],
        onSuccess: (data) => {
          this.setMembers(data);
          if (currentUserId) {
            const mine = data.find((m) => m.userId === currentUserId);
            this.setMyRole((mine?.role as WorkspaceRole) ?? null);
          }
        },
      },
    );
  };
}

export type WorkspaceAction = Pick<WorkspaceActionImpl, keyof WorkspaceActionImpl>;
