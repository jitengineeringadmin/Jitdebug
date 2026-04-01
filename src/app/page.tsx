"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui";
import { Activity, AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <div className="text-zinc-400">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-zinc-400">System status and active incidents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Active Workflows</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.workflows}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Open Incidents</CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.openIncidents}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Recent Tests</CardTitle>
            <CheckCircle className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.recentTestRuns.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Recent Logs</CardTitle>
            <Clock className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.recentLogs.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Recent Test Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentTestRuns.map((run: any) => (
                <div key={run.id} className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div>
                    <p className="text-sm font-medium text-white">{run.workflowTarget?.name || 'Unknown'}</p>
                    <p className="text-xs text-zinc-400">{new Date(run.startedAt).toLocaleString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${run.result === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {run.result || run.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">System Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentLogs.map((log: any) => (
                <div key={log.id} className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div>
                    <p className="text-sm font-medium text-white">{log.message}</p>
                    <p className="text-xs text-zinc-400">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${log.level === 'ERROR' ? 'bg-rose-500/10 text-rose-500' : 'bg-zinc-500/10 text-zinc-400'}`}>
                    {log.level}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
