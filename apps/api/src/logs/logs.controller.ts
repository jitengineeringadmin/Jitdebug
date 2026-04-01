import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { LogsService } from './logs.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.logsService.findAll(req.user.workspaceId);
  }
}
