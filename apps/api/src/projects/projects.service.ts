import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProjectProvider, SyncStatus } from '@jit-debug/shared';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(workspaceId: string) {
    return this.prisma.project.findMany({
      where: { workspaceId },
      include: { connections: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(workspaceId: string, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, workspaceId },
      include: { connections: true },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async create(workspaceId: string, data: any) {
    return this.prisma.project.create({
      data: {
        workspaceId,
        name: data.name,
        slug: data.slug,
        description: data.description,
        repositoryOwner: data.repositoryOwner,
        repositoryName: data.repositoryName,
        provider: data.provider || ProjectProvider.GITHUB,
        defaultBranch: data.defaultBranch || 'main',
        connections: {
          create: {
            provider: data.provider || ProjectProvider.GITHUB,
            repositoryOwner: data.repositoryOwner,
            repositoryName: data.repositoryName,
            defaultBranch: data.defaultBranch || 'main',
            syncStatus: SyncStatus.PENDING,
          }
        }
      },
      include: { connections: true }
    });
  }

  async update(workspaceId: string, id: string, data: any) {
    await this.findOne(workspaceId, id); // ensure exists and belongs to workspace
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async remove(workspaceId: string, id: string) {
    await this.findOne(workspaceId, id);
    return this.prisma.project.delete({
      where: { id },
    });
  }

  async handlePushEvent(projectId: string, payload: any) {
    // In a real scenario, this would trigger a sync or analysis
    console.log(`Received push event for project ${projectId}`, payload.ref);
    
    // Update last synced
    await this.prisma.projectRepositoryConnection.updateMany({
      where: { projectId },
      data: { 
        lastSyncedAt: new Date(),
        syncStatus: SyncStatus.SUCCESS
      }
    });
  }

  async handlePullRequestEvent(projectId: string, payload: any) {
    console.log(`Received PR event for project ${projectId}`, payload.action);
    // Trigger PR analysis
  }

  async syncProject(workspaceId: string, id: string) {
    const project = await this.findOne(workspaceId, id);
    
    // Simulate a sync process
    await this.prisma.projectRepositoryConnection.updateMany({
      where: { projectId: project.id },
      data: { syncStatus: SyncStatus.IN_PROGRESS }
    });

    // Simulate delay
    setTimeout(async () => {
      const success = Math.random() > 0.2; // 80% success rate
      await this.prisma.projectRepositoryConnection.updateMany({
        where: { projectId: project.id },
        data: { 
          syncStatus: success ? SyncStatus.SUCCESS : SyncStatus.FAILED,
          lastSyncedAt: new Date(),
          syncMessage: success ? 'Synced successfully' : 'Failed to connect to repository'
        }
      });
    }, 2000);

    return { message: 'Sync started' };
  }
}
