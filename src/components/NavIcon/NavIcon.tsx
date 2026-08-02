import {
  Clapperboard,
  Bookmark,
  Eye,
  Film,
  Theater,
  Archive,
  Settings,
  LogOut,
  Calendar,
  History,
  CircleOff,
  type LucideIcon,
} from 'lucide-react'

type Props = {
  name: string
  className?: string
}

const iconMap: Record<string, LucideIcon> = {
  clapperboard: Clapperboard,
  premieres: Clapperboard,
  bookmark: Bookmark,
  watchlist: Bookmark,
  eye: Eye,
  film: Film,
  theaters: Film,
  theater: Theater,
  archive: Archive,
  archives: Archive,
  settings: Settings,
  logout: LogOut,
  exit: LogOut,
  calendar: Calendar,
  timeline: History,
}

const NavIcon = ({ name, className }: Props) => {
  const Icon = iconMap[name.toLowerCase()] || CircleOff

  return <Icon className={className} />
}

export default NavIcon

