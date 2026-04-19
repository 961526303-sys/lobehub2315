'use client';

import { Flexbox } from '@lobehub/ui';
import { memo } from 'react';

import { useWorkspaceStore, workspaceSelectors } from '@/store/workspace';

import WorkspaceItem from './WorkspaceItem';

interface WorkspaceSwitcherContentProps {
  onClose?: () => void;
}

const WorkspaceSwitcherContent = memo<WorkspaceSwitcherContentProps>(({ onClose }) => {
  const workspaces = useWorkspaceStore(workspaceSelectors.workspaces);
  const activeId = useWorkspaceStore(workspaceSelectors.activeWorkspaceId);
  const switchWorkspace = useWorkspaceStore((s) => s.switchWorkspace);

  const handleSwitch = (id: string) => {
    switchWorkspace(id);
    onClose?.();
  };

  return (
    <Flexbox gap={4} padding={4} style={{ maxHeight: 400, minWidth: 220, overflow: 'auto' }}>
      {workspaces.map((workspace) => (
        <WorkspaceItem
          avatar={workspace.avatar}
          isActive={workspace.id === activeId}
          key={workspace.id}
          name={workspace.name}
          type={workspace.type as 'personal' | 'team'}
          onClick={() => handleSwitch(workspace.id)}
        />
      ))}
    </Flexbox>
  );
});

WorkspaceSwitcherContent.displayName = 'WorkspaceSwitcherContent';

export default WorkspaceSwitcherContent;
