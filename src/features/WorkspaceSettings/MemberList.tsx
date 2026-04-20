'use client';

import { Avatar, Block, Button, Flexbox, Icon, Tag, Text } from '@lobehub/ui';
import { confirmModal } from '@lobehub/ui/base-ui';
import { App, Dropdown } from 'antd';
import { MoreHorizontal } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';

import InviteModal from '@/features/WorkspaceInvite/InviteModal';
import { useFetchWorkspaceMembers } from '@/hooks/useFetchWorkspaceMembers';
import { type WorkspaceMemberRole, workspaceService } from '@/services/workspace';
import { useUserStore } from '@/store/user';
import { userProfileSelectors } from '@/store/user/selectors';
import {
  FETCH_WORKSPACE_MEMBERS_KEY,
  useWorkspaceStore,
  workspaceSelectors,
} from '@/store/workspace';

const roleColorMap: Record<string, string> = {
  admin: 'blue',
  editor: 'green',
  member: 'default',
  owner: 'gold',
};

const MemberList = memo(() => {
  const { t } = useTranslation('setting');
  const { message } = App.useApp();

  useFetchWorkspaceMembers();

  const currentUserId = useUserStore(userProfileSelectors.userId);
  const members = useWorkspaceStore((s) => s.members);
  const activeWorkspaceId = useWorkspaceStore(workspaceSelectors.activeWorkspaceId);
  const isAdmin = useWorkspaceStore(workspaceSelectors.isAdmin);
  const isOwner = useWorkspaceStore(workspaceSelectors.isOwner);

  const [inviteOpen, setInviteOpen] = useState(false);

  const refresh = () => mutate([FETCH_WORKSPACE_MEMBERS_KEY, activeWorkspaceId]);

  const handleChangeRole = async (userId: string, role: WorkspaceMemberRole) => {
    try {
      await workspaceService.updateMemberRole(userId, role);
      await refresh();
    } catch (error) {
      message.error((error as Error).message || 'Failed to update role');
    }
  };

  const handleRemove = (userId: string) => {
    confirmModal({
      cancelText: t('cancel', { defaultValue: 'Cancel', ns: 'common' }),
      content: t('workspace.member.removeConfirm.content'),
      okText: t('workspace.member.remove'),
      onOk: async () => {
        try {
          await workspaceService.removeMember(userId);
          await refresh();
        } catch (error) {
          message.error((error as Error).message || 'Failed to remove member');
        }
      },
      title: t('workspace.member.removeConfirm.title'),
    });
  };

  return (
    <>
      <Block padding={16} variant="outlined">
        <Flexbox gap={12}>
          <Flexbox horizontal align="center" justify="space-between">
            <Text strong>{t('workspace.general.title')}</Text>
            {isAdmin && (
              <Button type="primary" onClick={() => setInviteOpen(true)}>
                {t('workspace.member.invite')}
              </Button>
            )}
          </Flexbox>

          {members.length === 0 ? (
            <Flexbox align="center" justify="center" padding={24} style={{ opacity: 0.5 }}>
              No members
            </Flexbox>
          ) : (
            <Flexbox gap={4}>
              {members.map((member) => {
                const isSelf = member.userId === currentUserId;
                const isTargetOwner = member.role === 'owner';
                const canManage = isAdmin && !isSelf && !isTargetOwner;

                const roleMenuItems = (
                  isOwner ? (['admin', 'editor', 'member'] as WorkspaceMemberRole[]) : []
                ).map((r) => ({
                  disabled: member.role === r,
                  key: r,
                  label: t(`workspace.member.roles.${r}`),
                  onClick: () => handleChangeRole(member.userId, r),
                }));

                const menuItems = [
                  ...roleMenuItems,
                  ...(roleMenuItems.length > 0 && canManage ? [{ type: 'divider' as const }] : []),
                  ...(canManage
                    ? [
                        {
                          danger: true,
                          key: 'remove',
                          label: t('workspace.member.remove'),
                          onClick: () => handleRemove(member.userId),
                        },
                      ]
                    : []),
                ];

                return (
                  <Flexbox
                    horizontal
                    align="center"
                    gap={12}
                    key={`${member.workspaceId}-${member.userId}`}
                    padding={'8px 4px'}
                  >
                    <Avatar avatar={'👤'} size={32} />
                    <Flexbox flex={1} style={{ fontSize: 14, overflow: 'hidden' }}>
                      <Text ellipsis>{member.userId}</Text>
                    </Flexbox>
                    <Tag color={roleColorMap[member.role] || 'default'}>
                      {t(`workspace.member.roles.${member.role}`)}
                    </Tag>
                    {menuItems.length > 0 && (
                      <Dropdown
                        menu={{ items: menuItems }}
                        placement="bottomRight"
                        trigger={['click']}
                      >
                        <Button icon={<Icon icon={MoreHorizontal} />} size="small" type="text" />
                      </Dropdown>
                    )}
                  </Flexbox>
                );
              })}
            </Flexbox>
          )}
        </Flexbox>
      </Block>

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </>
  );
});

MemberList.displayName = 'MemberList';

export default MemberList;
