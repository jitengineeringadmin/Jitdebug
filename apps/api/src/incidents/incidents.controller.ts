import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.incidentsService.findAll(req.user.workspaceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.incidentsService.findOne(id, req.user.workspaceId);
  }

  @Post()
  create(@Body() data: any, @Request() req: any) {
    return this.incidentsService.create(data, req.user.workspaceId, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.incidentsService.update(id, data, req.user.workspaceId);
  }

  @Post(':id/notes')
  addNote(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.incidentsService.addNote(id, body.content, req.user.userId, req.user.workspaceId);
  }

  @Post(':id/analyze')
  analyze(@Param('id') id: string, @Request() req: any) {
    return this.incidentsService.analyze(id, req.user.workspaceId, req.user.userId);
  }
}
