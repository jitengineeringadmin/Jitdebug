const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const workspace = await prisma.workspace.create({
    data: { name: 'Acme Corp Debug' }
  });

  const hash = await bcrypt.hash('password123', 10);
  
  const superAdmin = await prisma.user.create({
    data: { workspaceId: workspace.id, email: 'super@jitdebug.com', passwordHash: hash, name: 'Super Admin', role: 'SUPER_ADMIN' }
  });
  const admin = await prisma.user.create({
    data: { workspaceId: workspace.id, email: 'admin@jitdebug.com', passwordHash: hash, name: 'Admin User', role: 'ADMIN' }
  });
  const analyst = await prisma.user.create({
    data: { workspaceId: workspace.id, email: 'analyst@jitdebug.com', passwordHash: hash, name: 'Analyst User', role: 'ANALYST' }
  });

  const target1 = await prisma.workflowTarget.create({
    data: { workspaceId: workspace.id, name: 'CRM Sync', slug: 'crm-sync', type: 'WEBHOOK', sourceSystem: 'Salesforce', environment: 'Production' }
  });
  const target2 = await prisma.workflowTarget.create({
    data: { workspaceId: workspace.id, name: 'Order Export', slug: 'order-export', type: 'CRON', sourceSystem: 'Shopify', environment: 'Production' }
  });

  await prisma.incident.create({
    data: { workspaceId: workspace.id, workflowTargetId: target1.id, title: 'Sync Timeout', description: 'Salesforce API timeout', severity: 'HIGH', priority: 'P1', reporterId: analyst.id }
  });
  await prisma.incident.create({
    data: { workspaceId: workspace.id, workflowTargetId: target2.id, title: 'Schema Mismatch', description: 'Missing fields in order payload', severity: 'MEDIUM', priority: 'P2', reporterId: admin.id }
  });

  await prisma.testRun.create({
    data: { workspaceId: workspace.id, workflowTargetId: target1.id, triggeredByUserId: analyst.id, type: 'PING', status: 'COMPLETED', result: 'SUCCESS', durationMs: 120 }
  });

  await prisma.logEvent.create({
    data: { workspaceId: workspace.id, workflowTargetId: target1.id, level: 'ERROR', message: 'Connection reset by peer' }
  });

  console.log('Seed completed!');
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
