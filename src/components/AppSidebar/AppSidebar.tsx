import { useLocation, useNavigate } from 'react-router-dom'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { MAIN_PAGES, FOOTER_PAGES, type PageItem } from '@/pages/pages'

import NavIcon from '../NavIcon/NavIcon'
import ProfileIcon from '../ProfileIcon/ProfileIcon'

// TODO: do ogarnięcia
export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isItemActive = (item: PageItem) => {
    if (
      item.link === '/timeline' &&
      (location.pathname === '/' || location.pathname === '/timeline')
    ) {
      return true
    }
    return location.pathname === item.link
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-[#1f1f23] bg-[#0a0a0a]">
      <SidebarHeader className="flex h-14 flex-row items-center px-4">
        <SidebarTrigger className="size-8 shrink-0 text-[#737373] hover:bg-[#1a1a1e] hover:text-white [&_svg]:size-4!" />
      </SidebarHeader>

      {/* Main Navigation - single compact geometry for both states, so icons can't move.
          Icon x = outer px-2 + group p-2 + button px-2 in both states by construction.
          Labels only fade (opacity), never unmount, so no layout recalc on toggle. */}
      <SidebarContent className="justify-between px-2 py-1">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {MAIN_PAGES.map(page => {
              const active = isItemActive(page)
              return (
                <SidebarMenuItem key={page.title}>
                  <SidebarMenuButton
                    isActive={active}
                    tooltip={page.title}
                    onPress={() => navigate(page.link)}
                    className={`h-8 w-full justify-start gap-2 overflow-hidden rounded-lg px-2 whitespace-nowrap transition-[width,background-color,color] duration-200 ease-linear ${
                      active
                        ? 'text-primary [&_svg]:text-primary'
                        : 'text-muted-foreground hover:bg-[#161619] hover:text-white [&_svg]:text-[#737373] hover:[&_svg]:text-white'
                    }`}
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center">
                      <NavIcon
                        name={page.icon}
                        className="size-4 shrink-0 transition-colors duration-150"
                      />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-left text-sm font-medium tracking-wide transition-opacity duration-200 group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0">
                      {page.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu className="gap-1.5">
            {FOOTER_PAGES.map(page => {
              const active = isItemActive(page)
              return (
                <SidebarMenuItem key={page.title}>
                  <SidebarMenuButton
                    isActive={active}
                    tooltip={page.title}
                    onPress={() => navigate(page.link)}
                    className={`h-8 w-full justify-start gap-2 overflow-hidden rounded-lg px-2 whitespace-nowrap transition-[width,background-color,color] duration-200 ease-linear ${
                      active
                        ? 'text-primary [&_svg]:text-primary'
                        : 'text-muted-foreground hover:bg-[#161619] hover:text-white [&_svg]:text-[#737373] hover:[&_svg]:text-white'
                    }`}
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center">
                      {page.title === 'Account' ? (
                        <ProfileIcon />
                      ) : (
                        <NavIcon
                          name={page.icon}
                          className="size-4 shrink-0 transition-colors duration-150"
                        />
                      )}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-left text-sm font-medium tracking-wide transition-opacity duration-200 group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0">
                      {page.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
