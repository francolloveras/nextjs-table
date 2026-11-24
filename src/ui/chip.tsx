import { cx } from '@/lib/utils'

export default function Chip({
  className,
  children,
  ...rest
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cx('rounded-full border border-neutral-900 bg-neutral-900 px-3 py-0.5 text-xs font-medium text-neutral-100 w-fit', [
        className,
      ])}
    >
      {children}
    </div>
  )
}
