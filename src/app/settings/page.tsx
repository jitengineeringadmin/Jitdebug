"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@/src/components/ui";

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/me").then((res) => {
      setUser(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-zinc-500">Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-zinc-400">Manage your account and workspace</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400">Email</label>
            <Input disabled value={user?.email || ""} className="bg-zinc-950 border-zinc-800 text-zinc-500" />
          </div>
          <div>
            <label className="text-sm text-zinc-400">Role</label>
            <Input disabled value={user?.role || ""} className="bg-zinc-950 border-zinc-800 text-zinc-500" />
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Update Profile</Button>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Workspace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400">Workspace ID</label>
            <Input disabled value={user?.workspaceId || ""} className="bg-zinc-950 border-zinc-800 text-zinc-500 font-mono text-xs" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
