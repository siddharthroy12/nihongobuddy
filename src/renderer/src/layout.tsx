import { SidebarProvider } from '@renderer/components/ui/sidebar'
import { AppSidebar } from '@renderer/components/app-sidebar'
import { Outlet, useLocation } from 'react-router'
import { TooltipProvider } from '@renderer/components/ui/tooltip'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <TooltipProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </TooltipProvider>
    </>
  )
}

export default function Layout() {
  const location = useLocation()
  if (location.pathname.includes('overlay')) {
    return (
      <Providers>
        <Outlet />
      </Providers>
    )
  }
  return (
    <div className="bg-sidebar">
      <Providers>
        <AppSidebar />
        <main className="ml-2 w-full h-screen relative p-6 py-10 overflow-scroll">
          <div className="fixed top-0 left-0 right-0 h-10 titlebar" />
          <Outlet />
        </main>
      </Providers>
    </div>
  )
}
