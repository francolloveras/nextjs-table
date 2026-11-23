import TableHeader from '@/ui/table/table-header'
import Thead from '@/ui/table/thead'
import TableFooter from '@/ui/table/table-footer'
import { TABLE_PARAMS } from '@/ui/table/const'

import { TableColumn, TableFilterConditions, TableModel } from '@/ui/table/type'
import { PageSearchParams } from '@/lib/type'

export default function Table<Data, Model extends TableModel>({
  id,
  columns,
  data,
  dataCount,
  totalCount,
  searchParams,
  buttons,
  options,
}: {
  id: string
  columns: TableColumn<Data, Model>[]
  data: Data[]
  dataCount: number
  totalCount: number
  searchParams: Awaited<PageSearchParams>
  buttons?: React.ReactNode
  options?: {
    emptyMessage?: string
    pageSize?: number
    hiddenPageSizeSelector?: boolean
    paramsPrefix?: string
  }
}) {
  const paramsPrefix = options?.paramsPrefix ? `${options.paramsPrefix}-` : ''

  const rawHidden = searchParams[paramsPrefix + TABLE_PARAMS.HIDE_COLUMNS]?.toString()
  const urlHidden = (rawHidden ?? '').split('>').filter(Boolean)
  const userInteracted = rawHidden !== undefined

  const hiddenColumns = userInteracted
    ? urlHidden
    : columns.filter(({ defaultHidden }) => defaultHidden).map(({ name }) => name)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const clientColumns = columns.map(({ onSearch, onSort, onFilter, render, ...rest }) => ({
    ...rest,
    sortable: !!onSort,
    searchable: !!onSearch,
    filterConditions: onFilter ? (Object.keys(onFilter('')) as TableFilterConditions[]) : undefined,
  }))

  const renderColumns = columns.filter(({ name }) => !hiddenColumns.includes(name))
  const renderClientColumns = clientColumns.filter(({ name }) => !hiddenColumns.includes(name))

  return (
    <div className="flex flex-col gap-y-4">
      <TableHeader
        id={id}
        columns={clientColumns}
        hiddenColumns={hiddenColumns}
        paramsPrefix={paramsPrefix}
        buttons={buttons}
      />
      <div className="overflow-auto">
        <table className="w-full border-separate border-spacing-0">
          <Thead renderColumns={renderClientColumns} paramsPrefix={paramsPrefix} />
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={index}
                  className="h-10 bg-white text-neutral-900 hover:bg-neutral-100 *:first:last:rounded-bl-md *:last:last:rounded-br-md"
                >
                  {renderColumns.map(({ name, render }) => (
                    <td
                      key={name}
                      className="text-nowrap border-b border-neutral-200 px-4 py-1 text-sm/6 first:border-l last:border-r"
                    >
                      {render ? render(row) : (row[name as keyof Data] as string | number)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="h-10 bg-white text-center text-neutral-900 *:first:last:rounded-bl-md *:last:last:rounded-br-md">
                <td
                  colSpan={99}
                  className="border-b border-neutral-200 px-4 py-1 text-sm/6 first:border-l last:border-r"
                >
                  {options?.emptyMessage ?? 'No data to display.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <TableFooter
        id={id}
        dataCount={dataCount}
        totalCount={totalCount}
        paramsPrefix={paramsPrefix}
        defaultPageSize={options?.pageSize}
        hiddenPageSizeSelector={options?.hiddenPageSizeSelector}
      />
    </div>
  )
}
