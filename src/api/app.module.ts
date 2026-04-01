import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { IncidentsModule } from './incidents/incidents.module';
import { TestRunsModule } from './test-runs/test-runs.module';
import { LogsModule } from './logs/logs.module';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    AuthModule,
    WorkflowsModule,
    IncidentsModule,
    TestRunsModule,
    LogsModule,
    UsersModule,
    DashboardModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
