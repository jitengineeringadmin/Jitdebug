import type { Metadata } from "next";
import "./globals.css";
import { SidebarLayout } from "@/src/components/SidebarLayout";

export const metadata: Metadata = {
  title: "JIT Debug",
  description: "B2B SaaS Debugging Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}
