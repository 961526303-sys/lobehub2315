'use client';

import { Flexbox } from '@lobehub/ui';
import { memo } from 'react';

import { useWorkspaceStore, workspaceSelectors } from '@/store/workspace';

import GeneralSettings from './GeneralSettings';
import MemberList from './MemberList';
import UpgradeToTeams from './UpgradeToTeams';

const WorkspaceSettings = memo(() => {
  const isPersonal = useWorkspaceStore(workspaceSelectors.isPersonalWorkspace);

  return (
    <Flexbox gap={24}>
      <GeneralSettings />
      {isPersonal ? <UpgradeToTeams /> : <MemberList />}
    </Flexbox>
  );
});

WorkspaceSettings.displayName = 'WorkspaceSettings';

export default WorkspaceSettings;
