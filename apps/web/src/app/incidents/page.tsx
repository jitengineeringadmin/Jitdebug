"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { Card, CardContent, Button, Modal, Input } from "@/src/components/ui";

export default function Incidents() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", severity: "HIGH", priority: "P1", workflowTargetId: "" });

  const fetchIncidents = () => {
    setLoading(true);
    api.get("/incidents").then((res) => {
      setIncidents(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchIncidents();
    api.get("/workflows").then((res) => setWorkflows(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/incidents", formData);
    setIsModalOpen(false);
    fetchIncidents();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Incidents</h2>
          <p className="text-zinc-400">Track and resolve issues</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-rose-600 hover:bg-rose-700 text-white">Report Incident</Button>
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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-500">Loading...</td></tr>
              ) : incidents.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No incidents found.</td></tr>
              ) : (
                incidents.map((i) => (
                  <tr key={i.id} className="border-b border-zinc-800 hover:bg-zinc-800/20">
                    <td className="px-6 py-4 font-medium text-white">{i.title}</td>
                    <td className="px-6 py-4">{i.workflowTarget?.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${i.severity === 'HIGH' || i.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {i.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">{i.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Report Incident">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400">Title</label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-zinc-950 border-zinc-800 text-white" />
          </div>
          <div>
            <label className="text-sm text-zinc-400">Description</label>
            <Input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-zinc-950 border-zinc-800 text-white" />
          </div>
          <div>
            <label className="text-sm text-zinc-400">Workflow Target</label>
            <select 
              required 
              value={formData.workflowTargetId} 
              onChange={e => setFormData({...formData, workflowTargetId: e.target.value})}
              className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select a target...</option>
              {workflows.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-zinc-800 hover:bg-zinc-700 text-white">Cancel</Button>
            <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white">Report</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
