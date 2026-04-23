import { SidebarProvider } from '@renderer/components/ui/sidebar'
import { AppSidebar } from '@renderer/components/app-sidebar'
import { Outlet } from 'react-router'
import { TooltipProvider } from '@renderer/components/ui/tooltip'

export default function Layout() {
  return (
    <div className="bg-sidebar">
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="ml-2 w-full h-screen relative p-6 py-10 overflow-scroll">
            <div className="absolute top-0 left-0 right-0 h-10 titlebar" />
            <Outlet />
          </main>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  )
}
