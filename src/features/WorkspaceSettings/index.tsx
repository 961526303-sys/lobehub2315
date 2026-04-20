'use client';

import { Flexbox } from '@lobehub/ui';
import { memo } from 'react';

import GeneralSettings from './GeneralSettings';

const WorkspaceSettings = memo(() => {
  return (
    <Flexbox gap={24}>
      <GeneralSettings />
    </Flexbox>
  );
});

WorkspaceSettings.displayName = 'WorkspaceSettings';

export default WorkspaceSettings;
