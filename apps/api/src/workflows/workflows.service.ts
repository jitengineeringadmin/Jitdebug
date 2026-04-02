import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { WorkflowStatus } from '@jit-debug/shared';

@Injectable()
export class WorkflowsService {
  constructor(private prisma: PrismaService) {}

  findAll(workspaceId: string) {
    return this.prisma.workflowTarget.findMany({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string) {
    const workflow = await this.prisma.workflowTarget.findFirst({ where: { id, workspaceId } });
    if (!workflow) throw new NotFoundException('Workflow not found');
    return workflow;
  }

  create(workspaceId: string, data: any) {
    return this.prisma.workflowTarget.create({
      data: { ...data, workspaceId }
    });
  }

  async update(workspaceId: string, id: string, data: any) {
    const workflow = await this.findOne(id, workspaceId);
    return this.prisma.workflowTarget.update({
      where: { id: workflow.id },
      data
    });
  }

  async remove(workspaceId: string, id: string) {
    const workflow = await this.findOne(id, workspaceId);
    return this.prisma.workflowTarget.delete({ where: { id: workflow.id } });
  }
}
