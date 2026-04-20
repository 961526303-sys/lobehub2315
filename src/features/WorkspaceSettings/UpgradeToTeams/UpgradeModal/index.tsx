'use client';

import { createModal, type ModalInstance } from '@lobehub/ui/base-ui';
import { t } from 'i18next';

import UpgradeContent from './UpgradeContent';

export const openUpgradeToTeamModal = (): ModalInstance =>
  createModal({
    content: <UpgradeContent />,
    footer: null,
    maskClosable: true,
    styles: {
      content: { padding: 0 },
    },
    title: t('workspace.upgrade.modal.title', { ns: 'setting' }),
    width: 'min(90vw, 480px)',
  });
