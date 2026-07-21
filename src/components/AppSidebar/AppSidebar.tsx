import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { PAGES } from '@/pages/pages'
import { useNavigate } from 'react-router-dom'
import NavIcon from '../NavIcon/NavIcon'

export function AppSidebar() {
  const navigate = useNavigate()
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {PAGES.map((page) => (
            <SidebarMenuItem key={page.title}>
              <SidebarMenuButton onPress={() => navigate(page.link)}>
                <NavIcon name={page.icon} />
                {page.title}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
