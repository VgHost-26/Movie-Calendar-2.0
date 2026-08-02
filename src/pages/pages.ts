export type PageItem = {
  title: string
  link: string
  icon: string
}

export const MAIN_PAGES: PageItem[] = [
  {
    title: 'Calendar',
    link: '/calendar',
    icon: 'calendar',
  },
  {
    title: 'Timeline',
    link: '/timeline',
    icon: 'film',
  },
]

export const FOOTER_PAGES: PageItem[] = [
  {
    title: 'Settings',
    link: '/settings',
    icon: 'settings',
  },
  {
    title: 'Account',
    link: '/account',
    icon: 'account',
  },
]

export const PAGES = [...MAIN_PAGES, ...FOOTER_PAGES]
