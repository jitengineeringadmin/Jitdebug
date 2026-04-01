"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { Card, CardContent, Button, Modal, Input } from "@/src/components/ui";

export default function Workflows() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "", type: "WEBHOOK", sourceSystem: "", environment: "Production", metadata: "{}" });

  const fetchWorkflows = () => {
    setLoading(true);
    api.get("/workflows").then((res) => {
      setWorkflows(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/workflows", formData);
    setIsModalOpen(false);
    fetchWorkflows();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Workflow Targets</h2>
          <p className="text-zinc-400">Manage your debug targets and integrations</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">Add Target</Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">System</th>
                <th className="px-6 py-3">Metadata</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-zinc-500">Loading...</td></tr>
              ) : workflows.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No workflows found.</td></tr>
              ) : (
                workflows.map((w) => {
                  let meta = {};
                  try { meta = JSON.parse(w.metadata || '{}'); } catch (e) {}
                  return (
                  <tr key={w.id} className="border-b border-zinc-800 hover:bg-zinc-800/20">
                    <td className="px-6 py-4 font-medium text-white">{w.name}</td>
                    <td className="px-6 py-4">{w.type}</td>
                    <td className="px-6 py-4">{w.sourceSystem}</td>
                    <td className="px-6 py-4">
                      <pre className="text-[10px] bg-zinc-950 p-1 rounded border border-zinc-800 text-zinc-300 max-w-[150px] overflow-x-auto">
                        {JSON.stringify(meta, null, 2)}
                      </pre>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full text-xs">
                        {w.status}
                      </span>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Workflow Target">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400">Name</label>
            <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-zinc-950 border-zinc-800 text-white" />
          </div>
          <div>
            <label className="text-sm text-zinc-400">Slug</label>
            <Input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="bg-zinc-950 border-zinc-800 text-white" />
          </div>
          <div>
            <label className="text-sm text-zinc-400">Source System</label>
            <Input required value={formData.sourceSystem} onChange={e => setFormData({...formData, sourceSystem: e.target.value})} className="bg-zinc-950 border-zinc-800 text-white" />
          </div>
          <div>
            <label className="text-sm text-zinc-400">Metadata (JSON)</label>
            <Input required value={formData.metadata} onChange={e => setFormData({...formData, metadata: e.target.value})} className="bg-zinc-950 border-zinc-800 text-white font-mono text-xs" />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-zinc-800 hover:bg-zinc-700 text-white">Cancel</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
