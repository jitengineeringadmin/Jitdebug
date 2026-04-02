"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { Card, CardContent } from "@/src/components/ui";

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/audit").then((res) => {
      setLogs(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Audit Trail</h2>
        <p className="text-zinc-400">Security and administrative activity logs</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Entity</th>
                <th className="px-6 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-zinc-500">Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No audit logs found.</td></tr>
              ) : (
                logs.map((l) => (
                  <tr key={l.id} className="border-b border-zinc-800 hover:bg-zinc-800/20">
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(l.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 text-white">{l.user?.name || 'System'}</td>
                    <td className="px-6 py-4">
                      <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs font-mono">
                        {l.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">{l.entityType}</td>
                    <td className="px-6 py-4 text-xs text-zinc-500 truncate max-w-[200px]">{l.details || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
