import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

import { useGetUserSettings } from '@/api/apiFirebase'
import { AppSidebar } from '@/components/AppSidebar/AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useSettingsStore } from '@/stores/settingsStore'

const MainLayout = () => {
  const { data: userSettings } = useGetUserSettings()
  const setSettings = useSettingsStore(state => state.setSettings)

  // useEffect(() => {
  //   if (user) {
  //     queryClient.prefetchQuery({
  //       // eslint-disable-next-line react-hooks/rules-of-hooks
  //       ...useGetUserSettings(),
  //       queryKey: ['userSettings'],
  //     })
  //   }
  // }, [user])

  useEffect(() => {
    if (userSettings) {
      setSettings(userSettings)
    }
  }, [userSettings, setSettings])

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <main className="flex h-screen w-[calc(100svw-var(--sidebar-width-icon))] flex-1">
        <Outlet />
        <Toaster />
      </main>
    </SidebarProvider>
  )
}

export default MainLayout
