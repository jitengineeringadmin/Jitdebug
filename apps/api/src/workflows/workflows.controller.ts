import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
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
  create(@Body() data: any, @Request() req: any) {
    return this.workflowsService.create(req.user.workspaceId, data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.workflowsService.update(req.user.workspaceId, id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.workflowsService.remove(req.user.workspaceId, id);
  }
}
