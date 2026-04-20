import { useUserStore } from '@/store/user';
import { authSelectors } from '@/store/user/slices/auth/selectors';
import { useWorkspaceStore } from '@/store/workspace';

export const useFetchWorkspaces = () => {
  const isLogin = useUserStore(authSelectors.isLogin);
  const useFetchWorkspaces = useWorkspaceStore((s) => s.useFetchWorkspaces);

  useFetchWorkspaces(isLogin);
};
