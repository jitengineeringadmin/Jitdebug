import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IncidentStatus, IncidentSeverity } from '@jit-debug/shared';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class IncidentsService {
  private ai: GoogleGenAI;

  constructor(private prisma: PrismaService) {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }

  findAll(workspaceId: string) {
    return this.prisma.incident.findMany({ where: { workspaceId }, include: { workflowTarget: true, reporter: true, assignee: true, notes: { include: { author: true }, orderBy: { createdAt: 'desc' } } }, orderBy: { openedAt: 'desc' } });
  }

  async findOne(id: string, workspaceId: string) {
    const incident = await this.prisma.incident.findFirst({ where: { id, workspaceId }, include: { notes: { include: { author: true } }, workflowTarget: true, reporter: true, assignee: true } });
    if (!incident) throw new NotFoundException('Incident not found');
    return incident;
  }

  async create(data: any, workspaceId: string, reporterId: string) {
    const target = await this.prisma.workflowTarget.findFirst({ where: { id: data.workflowTargetId, workspaceId } });
    if (!target) throw new NotFoundException('Workflow target not found');
    return this.prisma.incident.create({ data: { ...data, workspaceId, reporterId, status: IncidentStatus.OPEN } });
  }

  async update(id: string, data: any, workspaceId: string) {
    const incident = await this.findOne(id, workspaceId);
    return this.prisma.incident.update({ where: { id: incident.id }, data });
  }

  async addNote(incidentId: string, content: string, authorId: string, workspaceId: string) {
    const incident = await this.findOne(incidentId, workspaceId);
    return this.prisma.incidentNote.create({ data: { incidentId: incident.id, content, authorId } });
  }

  async analyze(incidentId: string, workspaceId: string, authorId: string) {
    const incident = await this.findOne(incidentId, workspaceId);
    
    // Fetch recent logs for the target
    const logs = await this.prisma.logEvent.findMany({
      where: { workflowTargetId: incident.workflowTargetId },
      orderBy: { timestamp: 'desc' },
      take: 20
    });

    const prompt = `
      Analyze the following incident and provide a root cause analysis and suggested remediation steps.
      
      Incident Title: ${incident.title}
      Description: ${incident.description}
      Severity: ${incident.severity}
      Target: ${incident.workflowTarget?.name} (${incident.workflowTarget?.sourceSystem})
      
      Recent Logs:
      ${logs.map(l => `[${l.level}] ${l.message}`).join('\n')}
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
      });

      const analysis = response.text;
      
      // Add the analysis as a note
      await this.addNote(incidentId, `**AI Analysis (JIT Agent)**\n\n${analysis}`, authorId, workspaceId);
      
      return { success: true, analysis };
    } catch (error) {
      console.error('AI Analysis failed:', error);
      throw new Error('Failed to generate AI analysis');
    }
  }
}
