import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  findAll(workspaceId: string) {
    return this.prisma.incident.findMany({ where: { workspaceId }, include: { workflowTarget: true, reporter: true, assignee: true } });
  }

  findOne(id: string, workspaceId: string) {
    return this.prisma.incident.findFirst({ where: { id, workspaceId }, include: { notes: { include: { author: true } }, workflowTarget: true, reporter: true, assignee: true } });
  }

  create(data: any, workspaceId: string, reporterId: string) {
    return this.prisma.incident.create({ data: { ...data, workspaceId, reporterId } });
  }

  update(id: string, data: any, workspaceId: string) {
    return this.prisma.incident.update({ where: { id }, data });
  }

  addNote(incidentId: string, content: string, authorId: string) {
    return this.prisma.incidentNote.create({ data: { incidentId, content, authorId } });
  }
}
