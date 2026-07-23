import { AppSidebar } from '@/components/AppSidebar/AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <main className="flex h-screen w-[calc(100svw-var(--sidebar-width-icon))] flex-1">
          <Outlet />
        </main>
      </SidebarProvider>
  )
}

export default MainLayout
