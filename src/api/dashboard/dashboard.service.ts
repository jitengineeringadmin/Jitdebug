import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(workspaceId: string) {
    const [workflows, openIncidents, recentTestRuns, recentLogs] = await Promise.all([
      this.prisma.workflowTarget.count({ where: { workspaceId, status: 'ACTIVE' } }),
      this.prisma.incident.count({ where: { workspaceId, status: 'OPEN' } }),
      this.prisma.testRun.findMany({ where: { workspaceId }, orderBy: { startedAt: 'desc' }, take: 5, include: { workflowTarget: true } }),
      this.prisma.logEvent.findMany({ where: { workspaceId }, orderBy: { timestamp: 'desc' }, take: 5 }),
    ]);

    return { workflows, openIncidents, recentTestRuns, recentLogs };
  }
}
