import { memo } from 'react';
import { useParams } from 'react-router-dom';

import InviteConfirmPage from '@/features/WorkspaceInvite/InviteConfirmPage';

const Page = memo(() => {
  const { token } = useParams<{ token: string }>();

  if (!token) return null;

  return <InviteConfirmPage token={token} />;
});

Page.displayName = 'InvitePage';

export default Page;
