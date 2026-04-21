import React from "react";
import { SidebarProvider } from "@/ui/components/ui/sidebar";
import { AppSidebar } from "@/ui/components/app-sidebar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="bg-sidebar">
      <SidebarProvider>
        <AppSidebar />
        <main className="ml-2 w-full h-screen relative p-6 py-10">
          <div className="absolute top-0 left-0 right-0 h-10 titlebar" />
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}
