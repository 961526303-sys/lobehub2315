'use client';

import { Flexbox, Icon, Text } from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import { type LucideIcon } from 'lucide-react';
import { memo } from 'react';

const styles = createStaticStyles(({ css, cssVar }) => ({
  iconBox: css`
    flex-shrink: 0;

    width: 36px;
    height: 36px;
    padding: 8px;
    border-radius: 8px;

    background: ${cssVar.colorFillTertiary};
  `,
}));

interface FeatureCardProps {
  desc: string;
  icon: LucideIcon;
  title: string;
}

const FeatureCard = memo<FeatureCardProps>(({ icon, title, desc }) => {
  return (
    <Flexbox horizontal align="flex-start" gap={12}>
      <Flexbox align="center" className={styles.iconBox} justify="center">
        <Icon icon={icon} size={20} />
      </Flexbox>
      <Flexbox flex={1} gap={2}>
        <Text strong>{title}</Text>
        <Text type="secondary">{desc}</Text>
      </Flexbox>
    </Flexbox>
  );
});

FeatureCard.displayName = 'FeatureCard';

export default FeatureCard;
