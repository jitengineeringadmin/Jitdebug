import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(workspaceId: string) {
    const [workflows, incidents, testRuns, logs, projects, recentIncidents, recentTestRuns] = await Promise.all([
      this.prisma.workflowTarget.count({ where: { workspaceId, status: 'ACTIVE' } }),
      this.prisma.incident.count({ where: { workspaceId, status: 'OPEN' } }),
      this.prisma.testRun.count({ where: { workspaceId } }),
      this.prisma.logEvent.count({ where: { workspaceId } }),
      this.prisma.project.count({ where: { workspaceId, isActive: true } }),
      this.prisma.incident.findMany({
        where: { workspaceId },
        orderBy: { openedAt: 'desc' },
        take: 5,
        include: { workflowTarget: true }
      }),
      this.prisma.testRun.findMany({
        where: { workspaceId },
        orderBy: { startedAt: 'desc' },
        take: 5,
        include: { workflowTarget: true }
      })
    ]);

    return {
      workflows,
      incidents,
      testRuns,
      logs,
      projects,
      recentIncidents,
      recentTestRuns
    };
  }
}
