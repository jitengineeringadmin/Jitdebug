"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/src/components/ui";

export default function Workflows() {
  const [workflows, setWorkflows] = useState<any[]>([]);

  useEffect(() => {
    api.get("/workflows").then((res) => setWorkflows(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Workflow Targets</h2>
          <p className="text-zinc-400">Manage your debug targets and integrations</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Add Target</Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">System</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workflows.map((w) => (
                <tr key={w.id} className="border-b border-zinc-800 hover:bg-zinc-800/20">
                  <td className="px-6 py-4 font-medium text-white">{w.name}</td>
                  <td className="px-6 py-4">{w.type}</td>
                  <td className="px-6 py-4">{w.sourceSystem}</td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full text-xs">
                      {w.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs h-8">Edit</Button>
                  </td>
                </tr>
              ))}
              {workflows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No workflows found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
