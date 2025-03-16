"use client";

import { useState, useEffect } from "react";
import { MoonIcon, SunIcon, MenuIcon, XIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(to right,  #232526, #414345)" }}
      
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 w-full border-b backdrop-blur-md flex items-center justify-between px-4 h-16"
        style={{ background: "rgba(30, 60, 114, 0.9)", color: "white" }}
      >
        <Button
          variant="ghost"
          className="p-2 text-white"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </Button>
        <div className="flex-1 text-center text-lg font-semibold">Dashboard</div>
        <Button
          variant="ghost"
          size="icon"
          className="p-2 text-white"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </Button>
      </header>

      {/* Layout */}
      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 overflow-auto" style={{ background: "rgba(255, 255, 255, 0.1)", color: "white" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
