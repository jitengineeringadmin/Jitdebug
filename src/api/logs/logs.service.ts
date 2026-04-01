import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  findAll(workspaceId: string) {
    return this.prisma.logEvent.findMany({
      where: { workspaceId },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
  }
}
