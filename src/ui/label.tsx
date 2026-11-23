import { cx } from '@/lib/utils'

export default function Label({
  name,
  isRequired,
  className,
  children,
}: {
  name: string
  isRequired?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={name}
      className={cx(
        'text-sm font-medium text-nowrap leading-none',
        {
          'after:ml-1 after:text-sm after:text-red-700 after:content-["*"]': isRequired,
        },
        [className],
      )}
    >
      {children}
    </label>
  )
}
