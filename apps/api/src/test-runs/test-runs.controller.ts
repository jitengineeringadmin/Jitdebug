import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TestRunsService } from './test-runs.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('test-runs')
export class TestRunsController {
  constructor(private readonly testRunsService: TestRunsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.testRunsService.findAll(req.user.workspaceId);
  }

  @Post()
  create(@Body() data: any, @Request() req: any) {
    return this.testRunsService.create(data, req.user.workspaceId, req.user.userId);
  }
}
