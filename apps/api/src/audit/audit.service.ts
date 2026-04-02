import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  findAll(workspaceId: string) {
    return this.prisma.auditLog.findMany({
      where: { workspaceId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async log(workspaceId: string, userId: string, action: string, entityType: string, entityId?: string, details?: any) {
    return this.prisma.auditLog.create({
      data: {
        workspaceId,
        userId,
        action,
        entityType,
        entityId,
        details: details ? JSON.stringify(details) : null,
      }
    });
  }
}
