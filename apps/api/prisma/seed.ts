import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Role, WorkflowStatus, IncidentSeverity, IncidentStatus, TestResult, LogLevel, ProjectProvider, SyncStatus } from '@jit-debug/shared';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Workspace
  const workspace = await prisma.workspace.create({
    data: { name: 'JIT Debug Main' }
  });

  // 2. Users
  const superAdmin = await prisma.user.create({
    data: {
      workspaceId: workspace.id,
      email: 'superadmin@jitdebug.com',
      name: 'Super Admin',
      passwordHash,
      role: Role.SUPER_ADMIN,
    }
  });

  const admin = await prisma.user.create({
    data: {
      workspaceId: workspace.id,
      email: 'admin@jitdebug.com',
      name: 'Admin User',
      passwordHash,
      role: Role.ADMIN,
    }
  });

  const analyst = await prisma.user.create({
    data: {
      workspaceId: workspace.id,
      email: 'analyst@jitdebug.com',
      name: 'Analyst User',
      passwordHash,
      role: Role.ANALYST,
    }
  });

  // 3. Projects
  const project1 = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      name: 'Core API',
      slug: 'core-api',
      repositoryOwner: 'jitdebug',
      repositoryName: 'core-api',
      connections: {
        create: {
          repositoryOwner: 'jitdebug',
          repositoryName: 'core-api',
          syncStatus: SyncStatus.SUCCESS,
          lastSyncedAt: new Date(),
        }
      }
    }
  });

  await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      name: 'Web Dashboard',
      slug: 'web-dashboard',
      repositoryOwner: 'jitdebug',
      repositoryName: 'web-dashboard',
      connections: {
        create: {
          repositoryOwner: 'jitdebug',
          repositoryName: 'web-dashboard',
          syncStatus: SyncStatus.SUCCESS,
        }
      }
    }
  });

  // 4. Workflows
  const workflow1 = await prisma.workflowTarget.create({
    data: {
      workspaceId: workspace.id,
      name: 'User Signup Flow',
      slug: 'user-signup',
      type: 'WEBHOOK',
      sourceSystem: 'AuthService',
      environment: 'Production',
      status: WorkflowStatus.ACTIVE,
    }
  });

  // 5. Incidents
  const incident1 = await prisma.incident.create({
    data: {
      workspaceId: workspace.id,
      workflowTargetId: workflow1.id,
      title: 'Signup Timeout',
      description: 'Users reporting timeouts during signup',
      severity: IncidentSeverity.HIGH,
      priority: 'P1',
      status: IncidentStatus.OPEN,
      reporterId: admin.id,
    }
  });

  // 6. Test Runs
  await prisma.testRun.create({
    data: {
      workspaceId: workspace.id,
      workflowTargetId: workflow1.id,
      triggeredByUserId: analyst.id,
      type: 'DIAGNOSTIC',
      status: 'COMPLETED',
      result: TestResult.SUCCESS,
    }
  });

  // 7. Logs
  await prisma.logEvent.create({
    data: {
      workspaceId: workspace.id,
      workflowTargetId: workflow1.id,
      level: LogLevel.INFO,
      message: 'Signup flow initiated',
    }
  });

  // 8. Audit Logs
  await prisma.auditLog.create({
    data: {
      workspaceId: workspace.id,
      userId: superAdmin.id,
      action: 'LOGIN',
      entityType: 'USER',
      entityId: superAdmin.id,
    }
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
