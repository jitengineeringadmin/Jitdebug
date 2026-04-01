import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { WebhooksController } from './webhooks.controller';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ProjectsController, WebhooksController],
  providers: [ProjectsService, PrismaService],
})
export class ProjectsModule {}
