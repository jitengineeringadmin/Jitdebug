import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(workspaceId: string) {
    const [incidents, workflows, testRuns] = await Promise.all([
      this.prisma.incident.count({ where: { workspaceId, status: 'OPEN' } }),
      this.prisma.workflowTarget.count({ where: { workspaceId, status: 'ACTIVE' } }),
      this.prisma.testRun.count({ where: { workspaceId } }),
    ]);

    return {
      activeIncidents: incidents,
      activeWorkflows: workflows,
      totalTestRuns: testRuns,
    };
  }
}
