import { PrismaClient, Role, WorkflowStatus, IncidentSeverity, IncidentStatus, TestResult, LogLevel, ProjectProvider, SyncStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.auditEvent.deleteMany();
  await prisma.logEvent.deleteMany();
  await prisma.testRun.deleteMany();
  await prisma.incidentNote.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.workflowTarget.deleteMany();
  await prisma.projectRepositoryConnection.deleteMany();
  await prisma.project.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workspace.deleteMany();

  const workspace = await prisma.workspace.create({
    data: { name: 'Acme Corp Debug' }
  });

  const hash = await bcrypt.hash('password123', 10);
  
  const superAdmin = await prisma.user.create({
    data: { workspaceId: workspace.id, email: 'super@jitdebug.com', passwordHash: hash, name: 'Super Admin', role: Role.SUPER_ADMIN }
  });
  const admin = await prisma.user.create({
    data: { workspaceId: workspace.id, email: 'admin@jitdebug.com', passwordHash: hash, name: 'Admin User', role: Role.ADMIN }
  });
  const analyst = await prisma.user.create({
    data: { workspaceId: workspace.id, email: 'analyst@jitdebug.com', passwordHash: hash, name: 'Analyst User', role: Role.ANALYST }
  });

  const projects = [];
  const projectData = [
    { name: 'Core API', slug: 'core-api', description: 'Main backend services', repositoryOwner: 'acme-corp', repositoryName: 'core-api' },
    { name: 'Frontend Web', slug: 'frontend-web', description: 'Customer facing web app', repositoryOwner: 'acme-corp', repositoryName: 'frontend-web' },
    { name: 'Data Pipeline', slug: 'data-pipeline', description: 'ETL and data processing', repositoryOwner: 'acme-corp', repositoryName: 'data-pipeline' },
    { name: 'Auth Service', slug: 'auth-service', description: 'Authentication and authorization', repositoryOwner: 'acme-corp', repositoryName: 'auth-service' },
  ];

  for (const p of projectData) {
    const project = await prisma.project.create({
      data: {
        workspaceId: workspace.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        repositoryOwner: p.repositoryOwner,
        repositoryName: p.repositoryName,
        provider: ProjectProvider.GITHUB,
        status: 'ACTIVE',
      }
    });
    projects.push(project);

    await prisma.projectRepositoryConnection.create({
      data: {
        projectId: project.id,
        provider: ProjectProvider.GITHUB,
        repositoryOwner: p.repositoryOwner,
        repositoryName: p.repositoryName,
        syncStatus: SyncStatus.SUCCESS,
        lastSyncedAt: new Date(),
        webhookEnabled: true,
      }
    });
  }

  const targets = [];
  const targetData = [
    { name: 'CRM Sync', slug: 'crm-sync', type: 'WEBHOOK', sourceSystem: 'Salesforce', environment: 'Production', metadata: JSON.stringify({ endpoint: 'https://api.salesforce.com/v1/sync' }) },
    { name: 'Order Export', slug: 'order-export', type: 'CRON', sourceSystem: 'Shopify', environment: 'Production', metadata: JSON.stringify({ cron: '0 * * * *' }) },
    { name: 'Payment Gateway', slug: 'payment-gateway', type: 'API', sourceSystem: 'Stripe', environment: 'Production', metadata: JSON.stringify({ version: '2023-10-16' }) },
    { name: 'Inventory Update', slug: 'inventory-update', type: 'PIPELINE', sourceSystem: 'ERP', environment: 'Staging', metadata: JSON.stringify({ queue: 'inventory-stg' }) },
    { name: 'Email Marketing', slug: 'email-marketing', type: 'WEBHOOK', sourceSystem: 'Mailchimp', environment: 'Production', metadata: JSON.stringify({ listId: 'abc123xyz' }) },
    { name: 'Data Warehouse ETL', slug: 'dwh-etl', type: 'CRON', sourceSystem: 'Snowflake', environment: 'Production', metadata: JSON.stringify({ warehouse: 'COMPUTE_WH' }) },
  ];

  for (const t of targetData) {
    targets.push(await prisma.workflowTarget.create({
      data: { workspaceId: workspace.id, ...t, ownerId: admin.id, status: WorkflowStatus.ACTIVE }
    }));
  }

  const incidents = [];
  const incidentData = [
    { targetIdx: 0, title: 'Sync Timeout', severity: IncidentSeverity.HIGH, priority: 'P1', status: IncidentStatus.OPEN },
    { targetIdx: 1, title: 'Schema Mismatch', severity: IncidentSeverity.MEDIUM, priority: 'P2', status: IncidentStatus.IN_PROGRESS },
    { targetIdx: 2, title: 'Payment Webhook Failed', severity: IncidentSeverity.CRITICAL, priority: 'P0', status: IncidentStatus.OPEN },
    { targetIdx: 3, title: 'Staging DB Unreachable', severity: IncidentSeverity.LOW, priority: 'P3', status: IncidentStatus.RESOLVED },
    { targetIdx: 4, title: 'Rate Limit Exceeded', severity: IncidentSeverity.MEDIUM, priority: 'P2', status: IncidentStatus.OPEN },
    { targetIdx: 5, title: 'Data Pipeline Stalled', severity: IncidentSeverity.HIGH, priority: 'P1', status: IncidentStatus.IN_PROGRESS },
    { targetIdx: 0, title: 'Invalid Payload Format', severity: IncidentSeverity.LOW, priority: 'P3', status: IncidentStatus.CLOSED },
    { targetIdx: 2, title: 'API Key Expired', severity: IncidentSeverity.CRITICAL, priority: 'P0', status: IncidentStatus.CLOSED },
  ];

  for (const i of incidentData) {
    incidents.push(await prisma.incident.create({
      data: {
        workspaceId: workspace.id,
        workflowTargetId: targets[i.targetIdx].id,
        title: i.title,
        description: `Simulated incident for ${i.title}`,
        severity: i.severity,
        priority: i.priority,
        status: i.status,
        reporterId: analyst.id,
        assigneeId: admin.id,
      }
    }));
  }

  for (let i = 0; i < 12; i++) {
    const target = targets[i % targets.length];
    const success = Math.random() > 0.3;
    await prisma.testRun.create({
      data: {
        workspaceId: workspace.id,
        workflowTargetId: target.id,
        triggeredByUserId: analyst.id,
        type: 'DIAGNOSTIC',
        status: 'COMPLETED',
        result: success ? TestResult.SUCCESS : TestResult.FAILED,
        durationMs: Math.floor(Math.random() * 1000) + 100,
        startedAt: new Date(Date.now() - Math.random() * 10000000),
      }
    });
  }

  for (let i = 0; i < 25; i++) {
    const target = targets[i % targets.length];
    const isError = Math.random() > 0.7;
    await prisma.logEvent.create({
      data: {
        workspaceId: workspace.id,
        workflowTargetId: target.id,
        level: isError ? LogLevel.ERROR : LogLevel.INFO,
        message: isError ? 'Connection reset by peer' : 'Workflow execution completed successfully',
        timestamp: new Date(Date.now() - Math.random() * 5000000),
      }
    });
  }

  await prisma.auditEvent.create({
    data: {
      workspaceId: workspace.id,
      userId: superAdmin.id,
      action: 'WORKSPACE_CREATED',
      entityType: 'Workspace',
      entityId: workspace.id,
    }
  });

  console.log('Seed completed!');
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
