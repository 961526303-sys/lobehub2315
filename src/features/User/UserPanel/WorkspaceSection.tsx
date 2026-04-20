'use client';

import { Avatar, Flexbox, Icon, Text } from '@lobehub/ui';
import { type ItemType } from 'antd/es/menu/interface';
import { createStaticStyles } from 'antd-style';
import { Check, Plus } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Menu from '@/components/Menu';
import { createWorkspaceModal } from '@/features/CreateWorkspaceModal';
import { useUserStore } from '@/store/user';
import { userProfileSelectors } from '@/store/user/selectors';
import { useWorkspaceStore, workspaceSelectors } from '@/store/workspace';

const styles = createStaticStyles(({ css, cssVar }) => ({
  divider: css`
    height: 1px;
    margin-block: 4px;
    background: ${cssVar.colorFillTertiary};
  `,
  email: css`
    padding-inline: 12px;
    font-size: 12px;
    color: ${cssVar.colorTextDescription};
  `,
}));

interface WorkspaceSectionProps {
  onSwitch?: () => void;
}

const WorkspaceSection = memo<WorkspaceSectionProps>(({ onSwitch }) => {
  const { t } = useTranslation('setting');
  const email = useUserStore(userProfileSelectors.email);
  const userAvatar = useUserStore(userProfileSelectors.userAvatar);
  const displayUserName = useUserStore(userProfileSelectors.displayUserName);
  const workspaces = useWorkspaceStore(workspaceSelectors.workspaces);
  const activeId = useWorkspaceStore(workspaceSelectors.activeWorkspaceId);
  const switchWorkspace = useWorkspaceStore((s) => s.switchWorkspace);

  const items = useMemo<ItemType[]>(() => {
    const workspaceItems: ItemType[] = workspaces.map((workspace) => {
      const isPersonal = workspace.type === 'personal';
      const avatar = workspace.avatar || (isPersonal ? userAvatar : null);
      const name = isPersonal ? displayUserName || workspace.name : workspace.name;
      const isActive = workspace.id === activeId;

      return {
        extra: isActive ? <Icon icon={Check} size={16} /> : undefined,
        key: workspace.id,
        label: (
          <Flexbox horizontal align="center" gap={8}>
            <Avatar avatar={avatar || (isPersonal ? '👤' : '👥')} shape="square" size={20} />
            <span>{name}</span>
          </Flexbox>
        ),
        onClick: () => {
          if (!isActive) switchWorkspace(workspace.id);
          onSwitch?.();
        },
      };
    });

    workspaceItems.push({
      icon: <Icon icon={Plus} />,
      key: 'new-workspace',
      label: t('workspace.newWorkspace'),
      onClick: () => {
        onSwitch?.();
        createWorkspaceModal();
      },
    });

    return workspaceItems;
  }, [workspaces, activeId, userAvatar, displayUserName, switchWorkspace, onSwitch, t]);

  if (workspaces.length === 0) return null;

  return (
    <>
      <div className={styles.divider} />
      {email && (
        <Text ellipsis className={styles.email}>
          {email}
        </Text>
      )}
      <Menu items={items} />
    </>
  );
});

WorkspaceSection.displayName = 'WorkspaceSection';

export default WorkspaceSection;
