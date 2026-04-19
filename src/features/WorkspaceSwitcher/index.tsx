'use client';

import { Avatar, Flexbox, Icon } from '@lobehub/ui';
import { Popover } from 'antd';
import { ChevronsUpDown } from 'lucide-react';
import { memo, type PropsWithChildren, Suspense, useState } from 'react';

import { useWorkspaceStore, workspaceSelectors } from '@/store/workspace';

import WorkspaceSwitcherContent from './WorkspaceSwitcherContent';

const WorkspaceSwitcher = memo<PropsWithChildren>(({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      arrow={false}
      open={open}
      placement="bottomLeft"
      trigger="click"
      content={
        <Suspense>
          <WorkspaceSwitcherContent onClose={() => setOpen(false)} />
        </Suspense>
      }
      onOpenChange={setOpen}
    >
      {children}
    </Popover>
  );
});

WorkspaceSwitcher.displayName = 'WorkspaceSwitcher';

export default WorkspaceSwitcher;

/**
 * Workspace trigger button — shows the active workspace avatar + name.
 * Wrap this with <WorkspaceSwitcher> to get the full dropdown.
 */
export const WorkspaceTrigger = memo(() => {
  const activeWorkspace = useWorkspaceStore(workspaceSelectors.activeWorkspace);

  const name = activeWorkspace?.name ?? 'Personal';
  const avatar = activeWorkspace?.avatar;
  const type = (activeWorkspace?.type ?? 'personal') as 'personal' | 'team';

  return (
    <Flexbox horizontal align="center" gap={8} style={{ cursor: 'pointer', padding: '4px 8px' }}>
      <Avatar avatar={avatar || (type === 'personal' ? '👤' : '👥')} shape="square" size={24} />
      <span
        style={{ fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {name}
      </span>
      <Icon icon={ChevronsUpDown} size={14} style={{ opacity: 0.5 }} />
    </Flexbox>
  );
});

WorkspaceTrigger.displayName = 'WorkspaceTrigger';
