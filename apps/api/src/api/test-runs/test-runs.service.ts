import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TestResult, LogLevel } from '../../lib/types';

@Injectable()
export class TestRunsService {
  constructor(private prisma: PrismaService) {}

  findAll(workspaceId: string) {
    return this.prisma.testRun.findMany({ where: { workspaceId }, include: { workflowTarget: true, triggeredByUser: true }, orderBy: { startedAt: 'desc' } });
  }

  async create(data: any, workspaceId: string, userId: string) {
    const target = await this.prisma.workflowTarget.findFirst({ where: { id: data.workflowTargetId, workspaceId } });
    if (!target) throw new NotFoundException('Workflow target not found');

    const testRun = await this.prisma.testRun.create({
      data: {
        workspaceId,
        workflowTargetId: target.id,
        triggeredByUserId: userId,
        type: data.type || 'PING',
        status: 'RUNNING',
      }
    });

    setTimeout(async () => {
      const success = Math.random() > 0.3;
      await this.prisma.testRun.update({
        where: { id: testRun.id },
        data: {
          status: 'COMPLETED',
          result: success ? TestResult.SUCCESS : TestResult.FAILED,
          finishedAt: new Date(),
          durationMs: Math.floor(Math.random() * 500) + 50,
        }
      });

      await this.prisma.logEvent.create({
        data: {
          workspaceId,
          workflowTargetId: target.id,
          testRunId: testRun.id,
          level: success ? LogLevel.INFO : LogLevel.ERROR,
          message: success ? 'Test run completed successfully' : 'Test run failed due to simulated error',
        }
      });
    }, 2000);

    return testRun;
  }
}
