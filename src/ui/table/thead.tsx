'use client'

import { useSearchParams } from '@/lib/hooks/useSearchParams'
import Icon from '@/ui/icon'
import { cx } from '@/lib/utils'
import { TableClientColumn, TableModel } from '@/ui/table/type'
import { TABLE_PARAMS } from '@/ui/table/const'

export default function Thead<Data, Model extends TableModel>({
  renderColumns,
  paramsPrefix,
}: {
  renderColumns: TableClientColumn<Data, Model>[]
  paramsPrefix: string
}) {
  const searchParams = useSearchParams()

  const paramsSort = searchParams.get(paramsPrefix + TABLE_PARAMS.SORT)?.split('>')
  const columnDefaultSort = renderColumns.find(({ defaultSort }) => defaultSort)

  const sort = paramsSort ?? [columnDefaultSort?.name, columnDefaultSort?.defaultSort]

  const handleSort = (column: string, value: 'asc' | 'desc' = 'asc') => {
    searchParams.update((params) => {
      const sortValue = params.get(paramsPrefix + TABLE_PARAMS.SORT)

      if (!sortValue) {
        params.set(paramsPrefix + TABLE_PARAMS.SORT, `${column}>${value}`)

        return
      }

      const [currentColumn, order] = sortValue.split('>')

      if (currentColumn !== column) {
        params.set(paramsPrefix + TABLE_PARAMS.SORT, `${column}>${value}`)

        return
      }

      if (order === 'asc') {
        params.set(paramsPrefix + TABLE_PARAMS.SORT, `${column}>desc`)

        return
      }

      params.delete(paramsPrefix + TABLE_PARAMS.SORT)
    })
  }

  return (
    <thead>
      <tr className="*:first:last:rounded-tl-lg *:last:last:rounded-tr-lg">
        {renderColumns.map(({ name, label, sortable }) => (
          <th
            key={name}
            className={cx(
              'border-y text-nowrap border-neutral-200 bg-white p-1 text-left text-xs font-semibold first:border-l last:border-r first:rounded-tl-md last:rounded-tr-md',
              {
                'w-9': name === 'actions',
              },
            )}
          >
            {name !== 'actions' &&
              (sortable ? (
                <button
                  onClick={() => handleSort(name)}
                  className="flex items-center gap-x-3 rounded px-3 py-1.5 hover:bg-neutral-100"
                >
                  {label}
                  <div className="-space-y-1.5 text-neutral-600">
                    <Icon
                      icon="chevronUp"
                      className={cx(
                        'm-0 block size-3.5 p-0',
                        sort?.[0] === name && sort?.[1] === 'asc' && 'text-orange-500',
                      )}
                    />
                    <Icon
                      icon="chevronDown"
                      className={cx(
                        'm-0 block size-3.5 p-0',
                        sort?.[0] === name && sort?.[1] === 'desc' && 'text-orange-500',
                      )}
                    />
                  </div>
                </button>
              ) : (
                <p className="px-3 py-1.5">{label}</p>
              ))}
          </th>
        ))}
      </tr>
    </thead>
  )
}
