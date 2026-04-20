'use client';

import { type SWRResponse } from 'swr';

import { useClientDataSWR } from '@/libs/swr';
import { workspaceService } from '@/services/workspace';
import { type StoreSetter } from '@/store/types';
import { setNamespace } from '@/utils/storeDebug';

import type { WorkspaceStore } from '../store';

export const FETCH_WORKSPACES_KEY = 'workspace/list';

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

    const state = this.#get();
    if (!state.activeWorkspaceId && workspaces.length > 0) {
      const personal = workspaces.find((w) => w.type === 'personal');
      if (personal) {
        this.switchWorkspace(personal.id);
      }
    }
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
}

export type WorkspaceAction = Pick<WorkspaceActionImpl, keyof WorkspaceActionImpl>;
