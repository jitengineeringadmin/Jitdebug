"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { Card, CardContent, Button, Modal, Input } from "@/src/components/ui";
import { ProjectProvider } from "@jit-debug/shared";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "", description: "", repositoryOwner: "", repositoryName: "", provider: ProjectProvider.GITHUB });

  const fetchProjects = () => {
    setLoading(true);
    api.get("/projects").then((res) => {
      setProjects(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/projects", formData);
    setIsModalOpen(false);
    fetchProjects();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          <p className="text-zinc-400">Manage your connected repositories and sync status</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">Add Project</Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Repository</th>
                <th className="px-6 py-3">Provider</th>
                <th className="px-6 py-3">Sync Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-500">Loading...</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No projects found.</td></tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id} className="border-b border-zinc-800 hover:bg-zinc-800/20">
                    <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                    <td className="px-6 py-4">{p.repositoryOwner}/{p.repositoryName}</td>
                    <td className="px-6 py-4">{p.provider}</td>
                    <td className="px-6 py-4">
                      {p.connections?.[0]?.syncStatus === 'SUCCESS' ? (
                        <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full text-xs">SUCCESS</span>
                      ) : p.connections?.[0]?.syncStatus === 'FAILED' ? (
                        <span className="bg-rose-500/10 text-rose-500 px-2 py-1 rounded-full text-xs">FAILED</span>
                      ) : (
                        <span className="bg-zinc-500/10 text-zinc-500 px-2 py-1 rounded-full text-xs">{p.connections?.[0]?.syncStatus || 'PENDING'}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Project">
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
            <label className="text-sm text-zinc-400">Description</label>
            <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-zinc-950 border-zinc-800 text-white" />
          </div>
          <div>
            <label className="text-sm text-zinc-400">Repository Owner</label>
            <Input required value={formData.repositoryOwner} onChange={e => setFormData({...formData, repositoryOwner: e.target.value})} className="bg-zinc-950 border-zinc-800 text-white" />
          </div>
          <div>
            <label className="text-sm text-zinc-400">Repository Name</label>
            <Input required value={formData.repositoryName} onChange={e => setFormData({...formData, repositoryName: e.target.value})} className="bg-zinc-950 border-zinc-800 text-white" />
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
