import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TestResult, LogLevel } from '@jit-debug/shared';

@Injectable()
export class TestRunsService {
  constructor(private prisma: PrismaService) {}

  findAll(workspaceId: string) {
    return this.prisma.testRun.findMany({ where: { workspaceId }, include: { workflowTarget: true, triggeredByUser: true }, orderBy: { startedAt: 'desc' } });
  }

  async create(data: any, workspaceId: string, userId: string) {
    const target = await this.prisma.workflowTarget.findFirst({ where: { id: data.workflowTargetId, workspaceId } });
    if (!target) throw new NotFoundException('Workflow target not found');

    const testType = data.type || 'PING';
    const testRun = await this.prisma.testRun.create({
      data: {
        workspaceId,
        workflowTargetId: target.id,
        triggeredByUserId: userId,
        type: testType,
        status: 'RUNNING',
      }
    });

    // Simulate complex test execution
    setTimeout(async () => {
      let success = true;
      let duration = 0;
      let logs = [];

      if (testType === 'PING') {
        success = Math.random() > 0.1;
        duration = Math.floor(Math.random() * 100) + 20;
        logs.push({ level: LogLevel.INFO, message: `Pinging ${target.name}...` });
        if (success) {
          logs.push({ level: LogLevel.INFO, message: `Received 200 OK in ${duration}ms` });
        } else {
          logs.push({ level: LogLevel.ERROR, message: `Connection timeout after ${duration}ms` });
        }
      } else if (testType === 'API_TEST') {
        success = Math.random() > 0.3;
        duration = Math.floor(Math.random() * 500) + 100;
        logs.push({ level: LogLevel.INFO, message: `Starting API test suite for ${target.name}` });
        logs.push({ level: LogLevel.DEBUG, message: `Executing GET /api/v1/health` });
        logs.push({ level: LogLevel.INFO, message: `Health check passed` });
        logs.push({ level: LogLevel.DEBUG, message: `Executing POST /api/v1/data` });
        if (success) {
          logs.push({ level: LogLevel.INFO, message: `Data created successfully` });
        } else {
          logs.push({ level: LogLevel.ERROR, message: `Failed to create data: 500 Internal Server Error` });
          logs.push({ level: LogLevel.ERROR, message: `Stack trace: Error: Database connection failed at ...` });
        }
      } else {
        // E2E_TEST
        success = Math.random() > 0.5;
        duration = Math.floor(Math.random() * 2000) + 500;
        logs.push({ level: LogLevel.INFO, message: `Initializing E2E test environment` });
        logs.push({ level: LogLevel.INFO, message: `Running Cypress suite` });
        if (success) {
          logs.push({ level: LogLevel.INFO, message: `All 42 tests passed` });
        } else {
          logs.push({ level: LogLevel.ERROR, message: `Test failed: "User login flow"` });
          logs.push({ level: LogLevel.WARN, message: `Screenshot saved to /artifacts/login-fail.png` });
        }
      }

      await this.prisma.testRun.update({
        where: { id: testRun.id },
        data: {
          status: 'COMPLETED',
          result: success ? TestResult.SUCCESS : TestResult.FAILED,
          finishedAt: new Date(),
          durationMs: duration,
        }
      });

      // Insert logs
      for (const log of logs) {
        await this.prisma.logEvent.create({
          data: {
            workspaceId,
            workflowTargetId: target.id,
            testRunId: testRun.id,
            level: log.level,
            message: log.message,
          }
        });
      }
    }, testType === 'E2E_TEST' ? 3000 : 1000);

    return testRun;
  }
}
