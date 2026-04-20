import { and, desc, eq } from 'drizzle-orm';

import type { WorkspaceItem } from '../schemas';
import { workspaceMembers, workspaces } from '../schemas';
import type { LobeChatDatabase } from '../type';

export class WorkspaceModel {
  private userId: string;
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase, userId: string) {
    this.userId = userId;
    this.db = db;
  }

  findById = async (id: string) => {
    return this.db.query.workspaces.findFirst({
      where: eq(workspaces.id, id),
    });
  };

  findBySlug = async (slug: string) => {
    return this.db.query.workspaces.findFirst({
      where: eq(workspaces.slug, slug),
    });
  };

  getPersonalWorkspace = async () => {
    return this.db.query.workspaces.findFirst({
      where: and(eq(workspaces.ownerId, this.userId), eq(workspaces.type, 'personal')),
    });
  };

  getSettings = async (id: string) => {
    const workspace = await this.db.query.workspaces.findFirst({
      columns: { settings: true },
      where: eq(workspaces.id, id),
    });
    return workspace?.settings ?? {};
  };

  listUserWorkspaces = async () => {
    const memberships = await this.db.query.workspaceMembers.findMany({
      where: eq(workspaceMembers.userId, this.userId),
    });

    if (memberships.length === 0) return [];

    const workspaceIds = memberships.map((m) => m.workspaceId);

    const results = await this.db.query.workspaces.findMany({
      orderBy: [desc(workspaces.updatedAt)],
      where: (ws, { inArray }) => inArray(ws.id, workspaceIds),
    });

    return results.map((ws) => ({
      ...ws,
      role: memberships.find((m) => m.workspaceId === ws.id)?.role ?? 'member',
    }));
  };

  update = async (
    id: string,
    value: Partial<Pick<WorkspaceItem, 'avatar' | 'description' | 'name' | 'slug'>>,
  ) => {
    return this.db
      .update(workspaces)
      .set({ ...value, updatedAt: new Date() })
      .where(eq(workspaces.id, id));
  };

  updateSettings = async (id: string, settings: Record<string, any>) => {
    return this.db
      .update(workspaces)
      .set({ settings, updatedAt: new Date() })
      .where(eq(workspaces.id, id));
  };
}
