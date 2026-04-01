import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WorkflowsService {
  constructor(private prisma: PrismaService) {}

  findAll(workspaceId: string) {
    return this.prisma.workflowTarget.findMany({ where: { workspaceId } });
  }

  findOne(id: string, workspaceId: string) {
    return this.prisma.workflowTarget.findFirst({ where: { id, workspaceId } });
  }

  create(data: any, workspaceId: string) {
    return this.prisma.workflowTarget.create({ data: { ...data, workspaceId } });
  }

  update(id: string, data: any, workspaceId: string) {
    return this.prisma.workflowTarget.update({ where: { id }, data });
  }

  remove(id: string, workspaceId: string) {
    return this.prisma.workflowTarget.update({ where: { id }, data: { status: 'ARCHIVED', archivedAt: new Date() } });
  }
}
