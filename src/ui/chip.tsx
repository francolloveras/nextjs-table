import { cx } from '@/lib/utils'

export default function Chip({
  className,
  children,
  ...rest
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cx('rounded px-4 py-0.5 border border-neutral-900 text-xs bg-neutral-900 text-neutral-100 w-fit', [
        className,
      ])}
    >
      {children}
    </div>
  )
}
