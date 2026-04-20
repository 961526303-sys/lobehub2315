import { lambdaClient } from '@/libs/trpc/client';

class WorkspaceService {
  list = async () => {
    return lambdaClient.workspace.list.query();
  };

  getById = async () => {
    return lambdaClient.workspace.getById.query();
  };

  update = async (input: {
    avatar?: string;
    description?: string;
    name?: string;
    slug?: string;
  }) => {
    return lambdaClient.workspace.update.mutate(input);
  };
}

export const workspaceService = new WorkspaceService();
