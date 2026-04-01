import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@jit-debug/shared';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.workflowsService.findAll(req.user.workspaceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.workflowsService.findOne(id, req.user.workspaceId);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  create(@Body() data: any, @Request() req: any) {
    return this.workflowsService.create(data, req.user.workspaceId);
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  update(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.workflowsService.update(id, data, req.user.workspaceId);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.workflowsService.remove(id, req.user.workspaceId);
  }
}
