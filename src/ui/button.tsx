'use client'

import Icon, { type IconName } from '@/ui/icon'
import { cx } from '@/lib/utils'

export default function Button({ variant = 'default', className, icon, children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      type={rest.type ?? 'button'}
      className={cx(
        'flex cursor-pointer items-center text-sm w-full gap-x-2 text-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed outline-none outline-2 -outline-offset-2 focus-visible:outline-orange-500',
        {
          'h-9.5 rounded-md bg-orange-500 justify-center px-4 py-2 font-medium text-white hover:bg-orange-600':
            variant === 'default',
          'rounded px-2 py-1.5 hover:bg-neutral-200 hover:text-neutral-1000': variant === 'transparent',
          'rounded-md justify-center px-4 py-2 font-medium border border-neutral-200 text-neutral-900 hover:bg-neutral-200 hover:text-neutral-1000':
            variant === 'outline',
        },
        [className],
      )}
    >
      {icon && (typeof icon === 'string' ? <Icon icon={icon} className="mb-0" /> : <Icon {...icon} />)}
      {children}
    </button>
  )
}

export type ButtonVariants = 'default' | 'transparent' | 'outline' | 'none'

export type ButtonProps = {
  variant?: ButtonVariants
  icon?:
    | IconName
    | {
        icon: IconName
        className?: string
        strokeWidth?: number
      }
  children?: React.ReactNode
} & Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'content'>
