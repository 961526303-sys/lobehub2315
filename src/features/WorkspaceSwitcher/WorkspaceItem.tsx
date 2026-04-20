'use client';

import { Avatar, Flexbox, Icon } from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import { Check } from 'lucide-react';
import { memo } from 'react';

const styles = createStaticStyles(({ css, cssVar }) => ({
  item: css`
    cursor: pointer;
    border-radius: 6px;
    transition: background-color 0.2s;

    &:hover {
      background: ${cssVar.colorFillTertiary};
    }
  `,
  name: css`
    overflow: hidden;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
}));

interface WorkspaceItemProps {
  avatar?: string | null;
  isActive: boolean;
  name: string;
  onClick: () => void;
  type: 'personal' | 'team';
}

const WorkspaceItem = memo<WorkspaceItemProps>(({ avatar, name, type, isActive, onClick }) => {
  return (
    <Flexbox
      horizontal
      align="center"
      className={styles.item}
      gap={8}
      padding={'8px 12px'}
      onClick={onClick}
    >
      <Avatar avatar={avatar || (type === 'personal' ? '👤' : '👥')} shape="square" size={28} />
      <Flexbox className={styles.name} flex={1}>
        {name}
      </Flexbox>
      {isActive && <Icon icon={Check} size={16} />}
    </Flexbox>
  );
});

WorkspaceItem.displayName = 'WorkspaceItem';

export default WorkspaceItem;
