import { and, desc, eq } from 'drizzle-orm';

import type { WorkspaceItem } from '../schemas';
import { workspaceMembers, workspaces } from '../schemas';
import type { LobeChatDatabase } from '../type';
import { idGenerator } from '../utils/idGenerator';

export class WorkspaceModel {
  private userId: string;
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase, userId: string) {
    this.userId = userId;
    this.db = db;
  }

  create = async (params: { avatar?: string; description?: string; name: string }) => {
    return this.db.transaction(async (tx) => {
      const [workspace] = await tx
        .insert(workspaces)
        .values({
          ...params,
          id: this.genId(),
          ownerId: this.userId,
          type: 'team',
        })
        .returning();

      // Auto-add creator as owner
      await tx.insert(workspaceMembers).values({
        role: 'owner',
        userId: this.userId,
        workspaceId: workspace.id,
      });

      return workspace;
    });
  };

  delete = async (id: string) => {
    // Only allow deleting team workspaces owned by the user
    return this.db
      .delete(workspaces)
      .where(
        and(
          eq(workspaces.id, id),
          eq(workspaces.ownerId, this.userId),
          eq(workspaces.type, 'team'),
        ),
      );
  };

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
      where: (ws, { inArray }) => inArray(ws.id, workspaceIds),
      orderBy: [desc(workspaces.updatedAt)],
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

  upgradeToTeam = async (id: string, params: { name?: string } = {}) => {
    const current = await this.db.query.workspaces.findFirst({
      where: eq(workspaces.id, id),
    });

    if (!current) throw new Error('Workspace not found');
    if (current.ownerId !== this.userId)
      throw new Error('Only the owner can upgrade this workspace');
    if (current.type !== 'personal') throw new Error('Only personal workspaces can be upgraded');

    const [updated] = await this.db
      .update(workspaces)
      .set({
        ...(params.name ? { name: params.name } : {}),
        type: 'team',
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, id))
      .returning();

    return updated;
  };

  private genId = () => idGenerator('workspaces');
}
