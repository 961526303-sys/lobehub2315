'use client';

import { createModal, type ModalInstance } from '@lobehub/ui/base-ui';
import { t } from 'i18next';

import CreateWorkspaceContent from './CreateWorkspaceContent';

export const createWorkspaceModal = (): ModalInstance =>
  createModal({
    content: <CreateWorkspaceContent />,
    footer: null,
    maskClosable: true,
    styles: {
      content: { padding: 0 },
    },
    title: t('workspace.create.title', { ns: 'setting' }),
    width: 'min(90vw, 480px)',
  });
