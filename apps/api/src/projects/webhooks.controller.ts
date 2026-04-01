import { Controller, Post, Body, Headers, Param, HttpCode } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('webhooks/projects')
export class WebhooksController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post(':projectId/github')
  @HttpCode(200)
  async handleGithubWebhook(
    @Param('projectId') projectId: string,
    @Headers('x-github-event') event: string,
    @Body() payload: any
  ) {
    if (event === 'push') {
      await this.projectsService.handlePushEvent(projectId, payload);
    } else if (event === 'pull_request') {
      await this.projectsService.handlePullRequestEvent(projectId, payload);
    }
    
    return { received: true };
  }
}
