'use client';

import { Flexbox } from '@lobehub/ui';
import { memo } from 'react';

import { useWorkspaceStore, workspaceSelectors } from '@/store/workspace';

import GeneralSettings from './GeneralSettings';
import MemberList from './MemberList';

const WorkspaceSettings = memo(() => {
  const isTeam = useWorkspaceStore(workspaceSelectors.isTeamWorkspace);

  return (
    <Flexbox gap={24}>
      <GeneralSettings />
      {isTeam && <MemberList />}
    </Flexbox>
  );
});

WorkspaceSettings.displayName = 'WorkspaceSettings';

export default WorkspaceSettings;
