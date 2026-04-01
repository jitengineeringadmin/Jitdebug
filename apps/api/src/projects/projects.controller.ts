import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@jit-debug/shared';

@Controller('projects')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  create(@Request() req, @Body() createProjectDto: any) {
    return this.projectsService.create(req.user.workspaceId, createProjectDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.projectsService.findAll(req.user.workspaceId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.projectsService.findOne(req.user.workspaceId, id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  update(@Request() req, @Param('id') id: string, @Body() updateProjectDto: any) {
    return this.projectsService.update(req.user.workspaceId, id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Request() req, @Param('id') id: string) {
    return this.projectsService.remove(req.user.workspaceId, id);
  }

  @Post(':id/sync')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  sync(@Request() req, @Param('id') id: string) {
    return this.projectsService.syncProject(req.user.workspaceId, id);
  }
}
