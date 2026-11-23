'use client'

import { useEffect } from 'react'

import { useSearchParams } from '@/lib/hooks/useSearchParams'
import Button from '@/ui/button'
import SelectInput from '@/ui/select-input'
import { getPageSize } from '@/ui/table/utils'
import { TABLE_PARAMS } from '@/ui/table/const'
import { cx } from '@/lib/utils'

export default function TableFooter({
  id,
  dataCount,
  totalCount,
  paramsPrefix,
  defaultPageSize,
  hiddenPageSizeSelector,
}: {
  id: string
  dataCount: number
  totalCount: number
  paramsPrefix: string
  defaultPageSize?: number
  hiddenPageSizeSelector?: boolean
}) {
  const searchParams = useSearchParams()

  const page = Number(searchParams.get(paramsPrefix + TABLE_PARAMS.PAGE)) || 1
  const pageSize = getPageSize(searchParams.get(paramsPrefix + TABLE_PARAMS.PAGE_SIZE), defaultPageSize)

  const startIndex = (page - 1) * pageSize + 1
  const endIndex = Math.min(startIndex + pageSize - 1, dataCount)
  const totalPages = Math.ceil(dataCount / pageSize)

  const handlePage = (page: number) => {
    searchParams.set(paramsPrefix + TABLE_PARAMS.PAGE, page.toString())
  }

  const handlePageSize = (pageSize: string) => {
    searchParams.set(paramsPrefix + TABLE_PARAMS.PAGE, '1')
    searchParams.set(paramsPrefix + TABLE_PARAMS.PAGE_SIZE, pageSize)
  }

  const visiblePages = 3
  const pageRanges = []

  if (totalPages <= visiblePages) {
    pageRanges.push(...Array.from({ length: totalPages }, (_, index) => index + 1))
  } else {
    const start = Math.max(1, page - Math.floor(visiblePages / 2))
    const end = Math.min(totalPages, start + visiblePages - 1)

    if (start > 1) {
      pageRanges.push(1)
    }

    for (let i = start; i <= end; i++) {
      pageRanges.push(i)
    }

    if (end < totalPages) {
      pageRanges.push(totalPages)
    }
  }

  useEffect(() => {
    if (page > 1 && dataCount <= (page - 1) * pageSize) {
      searchParams.set(paramsPrefix + TABLE_PARAMS.PAGE, '1')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataCount, page, pageSize])

  return (
    <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
      <p className="text-sm text-neutral-900">
        Showing <strong className="font-medium">{startIndex}</strong> to{' '}
        <strong className="font-medium">{endIndex}</strong> of <strong className="font-medium">{dataCount}</strong>
        {dataCount !== totalCount && ` (filtered from ${totalCount})`}
        {'.'}
      </p>
      <div className="flex gap-x-2">
        {dataCount > 5 && !hiddenPageSizeSelector && (
          <SelectInput
            key={pageSize}
            name={`${id}-page-size`}
            defaultValue={pageSize.toString()}
            onChange={handlePageSize}
            options={['5', '10', '15', '20', '30', '50', '100']}
            modalPlacement="top"
            wrapperClassName="w-20"
            buttonClassName="py-1.5 h-8.5"
            arrowClassName="top-2"
            disableSupportingText
          />
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-x-1">
            <Button
              variant="outline"
              icon="chevronLeft"
              className="aspect-square h-8.5 bg-white p-1.5"
              onClick={() => handlePage(page - 1)}
              disabled={page === 1}
            />
            {pageRanges.map((range, index) => (
              <Button
                key={index}
                variant="outline"
                className={cx('bg-white p-1.5 h-8.5 hidden sm:block aspect-square', {
                  'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:text-white': page === range,
                })}
                onClick={() => handlePage(typeof range === 'number' ? range : page)}
                disabled={typeof range !== 'number'}
              >
                {range}
              </Button>
            ))}
            <Button
              variant="outline"
              icon="chevronRight"
              className="aspect-square h-8.5 bg-white p-1.5"
              onClick={() => handlePage(page + 1)}
              disabled={page === totalPages}
            />
          </div>
        )}
      </div>
    </div>
  )
}
