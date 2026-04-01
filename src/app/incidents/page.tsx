"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { Card, CardContent, Button } from "@/src/components/ui";

export default function Incidents() {
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    api.get("/incidents").then((res) => setIncidents(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Incidents</h2>
          <p className="text-zinc-400">Track and resolve issues</p>
        </div>
        <Button className="bg-rose-600 hover:bg-rose-700 text-white">Report Incident</Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Target</th>
                <th className="px-6 py-3">Severity</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((i) => (
                <tr key={i.id} className="border-b border-zinc-800 hover:bg-zinc-800/20">
                  <td className="px-6 py-4 font-medium text-white">{i.title}</td>
                  <td className="px-6 py-4">{i.workflowTarget?.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${i.severity === 'HIGH' || i.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {i.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">{i.status}</td>
                  <td className="px-6 py-4 text-right">
                    <Button className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs h-8">View</Button>
                  </td>
                </tr>
              ))}
              {incidents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No incidents found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
