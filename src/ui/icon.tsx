import { cx } from '@/lib/utils'
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  CircleAlert,
  CornerDownRight,
  Ellipsis,
  Eye,
  EyeOff,
  Info,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

export default function Icon({
  icon,
  strokeWidth,
  className,
}: {
  icon: IconName
  strokeWidth?: number
  className?: string
}) {
  const IconComponent = iconMap[icon]

  if (!IconComponent) {
    throw new Error(`[UI]: Icon "${icon}" not found.`)
  }

  return <IconComponent strokeWidth={strokeWidth} className={cx('size-4', [className])} />
}

export type IconName = keyof typeof iconMap

const iconMap = {
  check: Check,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronsLeft: ChevronsLeft,
  chevronsRight: ChevronsRight,
  chevronUp: ChevronUp,
  circleAlert: CircleAlert,
  cornerDownRight: CornerDownRight,
  ellipsis: Ellipsis,
  eye: Eye,
  eyeOff: EyeOff,
  info: Info,
  plus: Plus,
  search: Search,
  slidersHorizontal: SlidersHorizontal,
  x: X,
}
