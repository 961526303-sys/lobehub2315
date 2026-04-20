'use client';

import { memo, type PropsWithChildren, useEffect } from 'react';

import { useFetchWorkspaces } from '@/hooks/useFetchWorkspaces';
import { useWorkspaceStore } from '@/store/workspace';

const WorkspaceContextProvider = memo<PropsWithChildren>(({ children }) => {
  const restoreActiveWorkspace = useWorkspaceStore((s) => s.restoreActiveWorkspace);

  useEffect(() => {
    restoreActiveWorkspace();
  }, [restoreActiveWorkspace]);

  useFetchWorkspaces();

  return <>{children}</>;
});

WorkspaceContextProvider.displayName = 'WorkspaceContextProvider';

export default WorkspaceContextProvider;
