import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TestRunsService {
  constructor(private prisma: PrismaService) {}

  findAll(workspaceId: string) {
    return this.prisma.testRun.findMany({ where: { workspaceId }, include: { workflowTarget: true, triggeredByUser: true }, orderBy: { startedAt: 'desc' } });
  }

  async create(data: any, workspaceId: string, userId: string) {
    // Simulate a test run
    const testRun = await this.prisma.testRun.create({
      data: {
        workspaceId,
        workflowTargetId: data.workflowTargetId,
        triggeredByUserId: userId,
        type: data.type || 'PING',
        status: 'RUNNING',
      }
    });

    // Simulate async execution
    setTimeout(async () => {
      const success = Math.random() > 0.3;
      await this.prisma.testRun.update({
        where: { id: testRun.id },
        data: {
          status: 'COMPLETED',
          result: success ? 'SUCCESS' : 'FAILED',
          finishedAt: new Date(),
          durationMs: Math.floor(Math.random() * 500) + 50,
        }
      });

      await this.prisma.logEvent.create({
        data: {
          workspaceId,
          workflowTargetId: data.workflowTargetId,
          testRunId: testRun.id,
          level: success ? 'INFO' : 'ERROR',
          message: success ? 'Test run completed successfully' : 'Test run failed due to simulated error',
        }
      });
    }, 2000);

    return testRun;
  }
}
