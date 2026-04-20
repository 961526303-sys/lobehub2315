import { lambdaClient } from '@/libs/trpc/client';

export type WorkspaceMemberRole = 'admin' | 'editor' | 'member';

class WorkspaceService {
  list = async () => {
    return lambdaClient.workspace.list.query();
  };

  getById = async () => {
    return lambdaClient.workspace.getById.query();
  };

  create = async (input: { avatar?: string; description?: string; name: string }) => {
    return lambdaClient.workspace.create.mutate(input);
  };

  update = async (input: {
    avatar?: string;
    description?: string;
    name?: string;
    slug?: string;
  }) => {
    return lambdaClient.workspace.update.mutate(input);
  };

  delete = async (id: string) => {
    return lambdaClient.workspace.delete.mutate({ id });
  };

  upgradeToTeam = async (input: { name?: string } = {}) => {
    return lambdaClient.workspace.upgradeToTeam.mutate(input);
  };

  listMembers = async () => {
    return lambdaClient.workspaceMember.list.query();
  };

  invite = async (input: { email?: string; role?: WorkspaceMemberRole }) => {
    return lambdaClient.workspaceMember.invite.mutate(input);
  };

  removeMember = async (userId: string) => {
    return lambdaClient.workspaceMember.remove.mutate({ userId });
  };

  updateMemberRole = async (userId: string, role: WorkspaceMemberRole) => {
    return lambdaClient.workspaceMember.updateRole.mutate({ role, userId });
  };
}

export const workspaceService = new WorkspaceService();
