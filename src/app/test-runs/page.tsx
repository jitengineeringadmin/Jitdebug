"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { Card, CardContent, Button } from "@/src/components/ui";

export default function TestRuns() {
  const [testRuns, setTestRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTestRuns = () => {
    api.get("/test-runs").then((res) => setTestRuns(res.data));
  };

  useEffect(() => {
    fetchTestRuns();
  }, []);

  const runTest = async () => {
    setLoading(true);
    try {
      // Get first workflow target to run test against
      const workflows = await api.get("/workflows");
      if (workflows.data.length > 0) {
        await api.post("/test-runs", { workflowTargetId: workflows.data[0].id, type: "DIAGNOSTIC" });
        setTimeout(fetchTestRuns, 2500); // Wait for async test to complete
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Test Runs</h2>
          <p className="text-zinc-400">Diagnostic executions and results</p>
        </div>
        <Button onClick={runTest} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          {loading ? "Running..." : "Run Diagnostic Test"}
        </Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-3">Target</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Result</th>
                <th className="px-6 py-3">Started</th>
              </tr>
            </thead>
            <tbody>
              {testRuns.map((t) => (
                <tr key={t.id} className="border-b border-zinc-800 hover:bg-zinc-800/20">
                  <td className="px-6 py-4 font-medium text-white">{t.workflowTarget?.name}</td>
                  <td className="px-6 py-4">{t.type}</td>
                  <td className="px-6 py-4">{t.status}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${t.result === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' : t.result === 'FAILED' ? 'bg-rose-500/10 text-rose-500' : 'bg-zinc-800 text-zinc-400'}`}>
                      {t.result || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(t.startedAt).toLocaleString()}</td>
                </tr>
              ))}
              {testRuns.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No test runs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
