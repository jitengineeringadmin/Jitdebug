"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Activity, AlertCircle, LayoutDashboard, Settings, Users, FileText, LogOut } from "lucide-react";
import { api } from "@/src/lib/api";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (pathname === "/login") {
      setLoading(false);
      return;
    }

    api.get("/auth/me")
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [pathname, router]);

  if (!mounted) return null;
  if (pathname === "/login") return <>{children}</>;
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400">Loading...</div>;

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      router.push("/login");
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Workflows", href: "/workflows", icon: Activity },
    { name: "Incidents", href: "/incidents", icon: AlertCircle },
    { name: "Test Runs", href: "/test-runs", icon: FileText },
    { name: "Logs", href: "/logs", icon: FileText },
    { name: "Users", href: "/users", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-50">
      <div className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight text-white">JIT Debug</h1>
          <p className="text-xs text-zinc-400 mt-1">B2B SaaS Debugging</p>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <div className="mb-4 px-3">
            <p className="text-sm font-medium text-white">{user?.email}</p>
            <p className="text-xs text-zinc-500">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-2 text-sm font-medium text-zinc-400 rounded-md hover:bg-zinc-800/50 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto bg-zinc-950 p-8">
        {children}
      </main>
    </div>
  );
}
