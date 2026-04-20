import { lambdaClient } from '@/libs/trpc/client';

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
}

export const workspaceService = new WorkspaceService();
