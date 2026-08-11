import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

import { AppSidebar } from '@/components/AppSidebar/AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

const MainLayout = () => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <main className="flex h-screen w-[calc(100svw-var(--sidebar-width-icon))] flex-1">
          <Outlet />
          <Toaster />
        </main>
      </SidebarProvider>
    </QueryClientProvider>
  )
}

export default MainLayout
