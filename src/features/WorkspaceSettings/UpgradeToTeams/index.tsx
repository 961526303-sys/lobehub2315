'use client';

import { OFFICIAL_SITE } from '@lobechat/const';
import { Block, Button, Flexbox, Text } from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import { BarChart3, ShieldCheck, Users, Zap } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import FeatureCard from './FeatureCard';
import { openUpgradeToTeamModal } from './UpgradeModal';

const styles = createStaticStyles(({ css }) => ({
  enterpriseBanner: css`
    padding-block: 16px;
    padding-inline: 20px;
  `,
  featuresCard: css`
    padding: 24px;
  `,
  grid: css`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  `,
}));

const UpgradeToTeams = memo(() => {
  const { t } = useTranslation('setting');

  const features = [
    {
      desc: t('workspace.upgrade.features.teamManagement.desc'),
      icon: Users,
      title: t('workspace.upgrade.features.teamManagement.title'),
    },
    {
      desc: t('workspace.upgrade.features.usageAnalytics.desc'),
      icon: BarChart3,
      title: t('workspace.upgrade.features.usageAnalytics.title'),
    },
    {
      desc: t('workspace.upgrade.features.adminControls.desc'),
      icon: ShieldCheck,
      title: t('workspace.upgrade.features.adminControls.title'),
    },
    {
      desc: t('workspace.upgrade.features.rulesCommands.desc'),
      icon: Zap,
      title: t('workspace.upgrade.features.rulesCommands.title'),
    },
  ];

  return (
    <Flexbox gap={16}>
      <Flexbox gap={4}>
        <Text as="h3" style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
          {t('workspace.upgrade.title')}
        </Text>
        <Text type="secondary">{t('workspace.upgrade.subtitle')}</Text>
      </Flexbox>

      <Block className={styles.featuresCard} variant="outlined">
        <Flexbox gap={24}>
          <div className={styles.grid}>
            {features.map((f) => (
              <FeatureCard desc={f.desc} icon={f.icon} key={f.title} title={f.title} />
            ))}
          </div>
          <Flexbox horizontal>
            <Button type="primary" onClick={() => openUpgradeToTeamModal()}>
              {t('workspace.upgrade.createTeam')}
            </Button>
          </Flexbox>
        </Flexbox>
      </Block>

      <Block className={styles.enterpriseBanner} variant="outlined">
        <Flexbox horizontal align="center" gap={12} justify="space-between">
          <Flexbox flex={1} gap={2}>
            <Text strong>{t('workspace.upgrade.enterprise.title')}</Text>
            <Text type="secondary">{t('workspace.upgrade.enterprise.desc')}</Text>
          </Flexbox>
          <Button
            href={`${OFFICIAL_SITE}/contact`}
            rel="noopener noreferrer"
            target="_blank"
            type="default"
          >
            {t('workspace.upgrade.enterprise.cta')}
          </Button>
        </Flexbox>
      </Block>
    </Flexbox>
  );
});

UpgradeToTeams.displayName = 'UpgradeToTeams';

export default UpgradeToTeams;
