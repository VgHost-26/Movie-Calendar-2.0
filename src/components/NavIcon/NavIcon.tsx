import { CalendarIcon, CircleOffIcon, TimelineIcon, type LucideIcon } from 'lucide-react'

type Props = {
  name: string
}

const iconMap: Record<string, LucideIcon> = {
  calendar: CalendarIcon,
  timeline: TimelineIcon,
}

const NavIcon = ({ name }: Props) => {
  const Icon = iconMap[name]

  if (!Icon) return <CircleOffIcon />
  return <Icon />
}

export default NavIcon
