import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { WorkflowStatus } from '../../lib/types';

@Injectable()
export class WorkflowsService {
  constructor(private prisma: PrismaService) {}

  findAll(workspaceId: string) {
    return this.prisma.workflowTarget.findMany({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string) {
    const target = await this.prisma.workflowTarget.findFirst({ where: { id, workspaceId } });
    if (!target) throw new NotFoundException('Workflow target not found');
    return target;
  }

  create(data: any, workspaceId: string) {
    return this.prisma.workflowTarget.create({ data: { ...data, workspaceId, status: WorkflowStatus.ACTIVE } });
  }

  async update(id: string, data: any, workspaceId: string) {
    const target = await this.findOne(id, workspaceId);
    return this.prisma.workflowTarget.update({ where: { id: target.id }, data });
  }

  async remove(id: string, workspaceId: string) {
    const target = await this.findOne(id, workspaceId);
    return this.prisma.workflowTarget.update({ where: { id: target.id }, data: { status: WorkflowStatus.ARCHIVED, archivedAt: new Date() } });
  }
}
