"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { Card, CardContent } from "@/src/components/ui";

export default function Logs() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    api.get("/logs").then((res) => setLogs(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">System Logs</h2>
        <p className="text-zinc-400">Audit trail and event history</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Level</th>
                <th className="px-6 py-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-zinc-800 hover:bg-zinc-800/20">
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(l.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${l.level === 'ERROR' ? 'bg-rose-500/10 text-rose-500' : 'bg-zinc-800 text-zinc-400'}`}>
                      {l.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-zinc-300">{l.message}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">No logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
