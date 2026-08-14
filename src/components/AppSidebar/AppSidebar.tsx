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
import useAuth from '@/hooks/useAuth'
import { MAIN_PAGES, FOOTER_PAGES, type PageItem } from '@/pages/pages'

import NavIcon from '../NavIcon/NavIcon'
import ProfileIcon from '../ProfileIcon/ProfileIcon'

// TODO: do ogarnięcia
export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const isItemActive = (item: PageItem) => {
    if (
      item.link === '/calendar' &&
      (location.pathname === '/' || location.pathname === '/calendar')
    ) {
      return true
    }
    return location.pathname === item.link
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-[#1f1f23] bg-[#0a0a0a]">
      {/* Brand Header */}
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
        <SidebarTrigger className="text-[#737373] hover:bg-[#1a1a1e] hover:text-white" />
        {/* 
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <h2 className="font-heading text-[1.2rem] leading-none font-extrabold tracking-wider text-white uppercase">
              MOVIE CALENDAR
            </h2>
            <span className="mt-1 text-[10px] font-medium tracking-[0.2em] text-[#737373] uppercase">
              CINEMATIC CALENDAR
            </span>
          </div> 
        </div>
          */}
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="justify-between px-2 py-1">
        <SidebarGroup>
          <SidebarMenu className="gap-1.5">
            {MAIN_PAGES.map((page) => {
              const active = isItemActive(page)
              return (
                <SidebarMenuItem key={page.title}>
                  <SidebarMenuButton
                    isActive={active}
                    tooltip={page.title}
                    onPress={() => navigate(page.link)}
                    className={`transition-colors duration-150 ${active
                      ? 'text-primary [&_svg]:text-primary'
                      : 'text-muted-foreground hover:bg-[#161619] hover:text-white [&_svg]:text-[#737373] hover:[&_svg]:text-white'
                      } group-data-[collapsible=icon]:size-11 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!`}
                  >
                    <NavIcon
                      name={page.icon}
                      className="size-5 shrink-0 transition-colors duration-150"
                    />
                    <span className="text-sm font-medium tracking-wide group-data-[collapsible=icon]:hidden">
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
            {FOOTER_PAGES.map((page) => {
              const active = isItemActive(page)
              return (
                <SidebarMenuItem key={page.title}>
                  <SidebarMenuButton
                    isActive={active}
                    tooltip={page.title}
                    onPress={() => navigate(page.link)}
                    className={`h-11 rounded-lg px-3.5 transition-colors duration-150 ${active
                      ? 'text-primary [&_svg]:text-primary'
                      : 'text-muted-foreground hover:bg-[#161619] hover:text-white [&_svg]:text-[#737373] hover:[&_svg]:text-white'
                      } group-data-[collapsible=icon]:size-11 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!`}
                  >
                    {page.title === 'Account' ? (
                      <ProfileIcon />
                    ) : (
                      <NavIcon
                        name={page.icon}
                        className="size-5 shrink-0 transition-all duration-150"
                      />
                    )}
                    <span className="text-sm font-medium tracking-wide group-data-[collapsible=icon]:hidden">
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
