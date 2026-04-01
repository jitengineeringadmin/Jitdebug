"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@/src/components/ui";

export default function Settings() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get("/auth/me").then((res) => setUser(res.data));
  }, []);

  if (!user) return <div className="text-zinc-400">Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-zinc-400">Manage your profile and workspace preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400">Email</label>
              <Input disabled value={user.email} className="bg-zinc-950 border-zinc-800 text-zinc-500" />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Role</label>
              <Input disabled value={user.role} className="bg-zinc-950 border-zinc-800 text-zinc-500" />
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Update Profile</Button>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Workspace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400">Workspace ID</label>
              <Input disabled value={user.workspaceId} className="bg-zinc-950 border-zinc-800 text-zinc-500 font-mono text-xs" />
            </div>
            <Button className="bg-zinc-800 hover:bg-zinc-700 text-white">Manage Workspace</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
