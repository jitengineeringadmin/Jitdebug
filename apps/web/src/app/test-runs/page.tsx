"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { Card, CardContent, Button, Modal } from "@/src/components/ui";

export default function TestRuns() {
  const [testRuns, setTestRuns] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState("");
  const [selectedType, setSelectedType] = useState("PING");

  const fetchTestRuns = () => {
    setLoading(true);
    api.get("/test-runs").then((res) => {
      setTestRuns(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTestRuns();
    api.get("/workflows").then((res) => setWorkflows(res.data));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (testRuns.some(t => t.status === 'RUNNING')) {
      interval = setInterval(() => {
        api.get("/test-runs").then((res) => {
          setTestRuns(res.data);
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [testRuns]);

  const handleRunTest = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/test-runs", { workflowTargetId: selectedWorkflowId, type: selectedType });
    setIsModalOpen(false);
    fetchTestRuns();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Test Runs</h2>
          <p className="text-zinc-400">Execute diagnostics and view results</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">Run Diagnostic</Button>
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
                <th className="px-6 py-3">Duration</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-zinc-500">Loading...</td></tr>
              ) : testRuns.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No test runs found.</td></tr>
              ) : (
                testRuns.map((t) => (
                  <tr key={t.id} className="border-b border-zinc-800 hover:bg-zinc-800/20">
                    <td className="px-6 py-4 font-medium text-white">{t.workflowTarget?.name}</td>
                    <td className="px-6 py-4">{t.type}</td>
                    <td className="px-6 py-4">{t.status}</td>
                    <td className="px-6 py-4">
                      {t.result === 'SUCCESS' ? (
                        <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full text-xs">SUCCESS</span>
                      ) : t.result === 'FAILED' ? (
                        <span className="bg-rose-500/10 text-rose-500 px-2 py-1 rounded-full text-xs">FAILED</span>
                      ) : (
                        <span className="bg-zinc-500/10 text-zinc-500 px-2 py-1 rounded-full text-xs">{t.result || 'PENDING'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{t.durationMs ? `${t.durationMs}ms` : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Run Diagnostic">
        <form onSubmit={handleRunTest} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400">Workflow Target</label>
            <select 
              required 
              value={selectedWorkflowId} 
              onChange={e => setSelectedWorkflowId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select a target...</option>
              {workflows.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-zinc-400">Test Type</label>
            <select 
              required 
              value={selectedType} 
              onChange={e => setSelectedType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="PING">Ping Test</option>
              <option value="API_TEST">API Test Suite</option>
              <option value="E2E_TEST">E2E Test Suite</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-zinc-800 hover:bg-zinc-700 text-white">Cancel</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Run</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
