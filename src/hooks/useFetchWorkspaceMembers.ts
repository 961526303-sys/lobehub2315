import { useUserStore } from '@/store/user';
import { authSelectors, userProfileSelectors } from '@/store/user/selectors';
import { useWorkspaceStore, workspaceSelectors } from '@/store/workspace';

export const useFetchWorkspaceMembers = () => {
  const isLogin = useUserStore(authSelectors.isLogin);
  const userId = useUserStore(userProfileSelectors.userId);
  const activeWorkspaceId = useWorkspaceStore(workspaceSelectors.activeWorkspaceId);
  const useFetch = useWorkspaceStore((s) => s.useFetchWorkspaceMembers);

  useFetch(!!isLogin, activeWorkspaceId, userId ?? undefined);
};
