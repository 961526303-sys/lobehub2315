'use client';

import { Flexbox, Text } from '@lobehub/ui';
import { Divider } from 'antd';
import { createStaticStyles } from 'antd-style';
import { memo } from 'react';

import WorkspaceItem from '@/features/WorkspaceSwitcher/WorkspaceItem';
import { useUserStore } from '@/store/user';
import { userProfileSelectors } from '@/store/user/selectors';
import { useWorkspaceStore, workspaceSelectors } from '@/store/workspace';

const styles = createStaticStyles(({ css, cssVar }) => ({
  email: css`
    padding-inline: 12px;
    font-size: 12px;
    color: ${cssVar.colorTextDescription};
  `,
  list: css`
    overflow: auto;
    max-height: 240px;
  `,
}));

interface WorkspaceSectionProps {
  onSwitch?: () => void;
}

const WorkspaceSection = memo<WorkspaceSectionProps>(({ onSwitch }) => {
  const email = useUserStore(userProfileSelectors.email);
  const userAvatar = useUserStore(userProfileSelectors.userAvatar);
  const displayUserName = useUserStore(userProfileSelectors.displayUserName);
  const workspaces = useWorkspaceStore(workspaceSelectors.workspaces);
  const activeId = useWorkspaceStore(workspaceSelectors.activeWorkspaceId);
  const switchWorkspace = useWorkspaceStore((s) => s.switchWorkspace);

  if (workspaces.length === 0) return null;

  const handleSwitch = (id: string) => {
    if (id !== activeId) switchWorkspace(id);
    onSwitch?.();
  };

  return (
    <>
      <Divider style={{ margin: '4px 0' }} />
      <Flexbox gap={4} padding={4}>
        {email && (
          <Text ellipsis className={styles.email}>
            {email}
          </Text>
        )}
        <Flexbox className={styles.list} gap={2}>
          {workspaces.map((workspace) => {
            const isPersonal = workspace.type === 'personal';
            const avatar = workspace.avatar || (isPersonal ? userAvatar : null);
            const name = isPersonal ? displayUserName || workspace.name : workspace.name;
            return (
              <WorkspaceItem
                avatar={avatar}
                isActive={workspace.id === activeId}
                key={workspace.id}
                name={name}
                type={workspace.type as 'personal' | 'team'}
                onClick={() => handleSwitch(workspace.id)}
              />
            );
          })}
        </Flexbox>
      </Flexbox>
    </>
  );
});

WorkspaceSection.displayName = 'WorkspaceSection';

export default WorkspaceSection;
