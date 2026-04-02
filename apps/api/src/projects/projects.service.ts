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
}
