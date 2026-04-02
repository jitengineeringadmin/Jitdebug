import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IncidentStatus, IncidentSeverity } from '@jit-debug/shared';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  findAll(workspaceId: string) {
    return this.prisma.incident.findMany({ where: { workspaceId }, include: { workflowTarget: true, reporter: true, assignee: true }, orderBy: { openedAt: 'desc' } });
  }

  async findOne(id: string, workspaceId: string) {
    const incident = await this.prisma.incident.findFirst({ where: { id, workspaceId }, include: { notes: { include: { author: true } }, workflowTarget: true, reporter: true, assignee: true } });
    if (!incident) throw new NotFoundException('Incident not found');
    return incident;
  }

  async create(data: any, workspaceId: string, reporterId: string) {
    const target = await this.prisma.workflowTarget.findFirst({ where: { id: data.workflowTargetId, workspaceId } });
    if (!target) throw new NotFoundException('Workflow target not found');
    return this.prisma.incident.create({ data: { ...data, workspaceId, reporterId, status: IncidentStatus.OPEN } });
  }

  async update(id: string, data: any, workspaceId: string) {
    const incident = await this.findOne(id, workspaceId);
    return this.prisma.incident.update({ where: { id: incident.id }, data });
  }

  async addNote(incidentId: string, content: string, authorId: string, workspaceId: string) {
    const incident = await this.findOne(incidentId, workspaceId);
    return this.prisma.incidentNote.create({ data: { incidentId: incident.id, content, authorId } });
  }
}
