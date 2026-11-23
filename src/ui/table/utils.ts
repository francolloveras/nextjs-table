import merge from 'lodash.merge'
import { TABLE_FILTERS_CONDITIONS, TABLE_MAX_PAGE_SIZE, TABLE_PARAMS } from '@/ui/table/const'
import { TableClientColumn, TableColumn, TableFilterConditions, TableModel } from '@/ui/table/type'

export function isTableFilterCondition(value: string): value is TableFilterConditions {
  return Object.values(TABLE_FILTERS_CONDITIONS).includes(value as TableFilterConditions)
}

export function getTableParams(params: Record<string, string | string[] | undefined>, prefix?: string) {
  const paramsPrefix = prefix ? `${prefix}-` : ''

  const page = Number(params[paramsPrefix + TABLE_PARAMS.PAGE]) || 1
  const pageSize = getPageSize(params[paramsPrefix + TABLE_PARAMS.PAGE_SIZE])
  const search = params[paramsPrefix + TABLE_PARAMS.SEARCH]?.toString()
  const filters = params[paramsPrefix + TABLE_PARAMS.FILTER]?.toString()

  return {
    paramsPrefix,
    page,
    pageSize,
    search,
    filters,
  }
}

export function getPrismaTableQuery<Data, Model extends TableModel>({
  columns,
  params,
  options,
}: {
  columns: TableColumn<Data, Model>[]
  params: Record<string, string | string[] | undefined>
  options?: { paramsPrefix?: string }
}) {
  const { paramsPrefix, page, pageSize, search, filters } = getTableParams(params, options?.paramsPrefix)

  let orderBy = {}
  let where = {}

  const columnDefaultSort = columns.find(({ defaultSort }) => defaultSort)

  // Column defaultSort logic: this load the default sort in initial query.
  if (columnDefaultSort) {
    orderBy = {
      [columnDefaultSort.name]: columnDefaultSort.defaultSort,
    }
  }

  const [sortKey, sortValue] = params[paramsPrefix + TABLE_PARAMS.SORT]?.toString().split('>') ?? [null, null]

  // Column onSort logic: this handle every user sort change.
  if (sortKey && (sortValue === 'asc' || sortValue === 'desc')) {
    const column = columns.find(({ name }) => name === sortKey)

    orderBy = column ? (column.onSort ? { ...(column.onSort(sortValue) ?? {}) } : { [sortKey]: sortValue }) : {}
  }

  if (search) {
    where = {
      OR: columns.map(({ onSearch }) => (onSearch ? { ...onSearch(search) } : {})),
    }
  }

  const columnsDefaultFilters = columns.filter(({ defaultFilter }) => defaultFilter)

  // Column filter logic: this load default filters in initial query.
  if (columnsDefaultFilters) {
    for (const columns of columnsDefaultFilters) {
      if (columns.defaultFilter?.query) {
        where = merge(where, columns.defaultFilter.query)
      }
    }
  }

  // Column filters logic: this handle every user filter change.
  if (filters) {
    for (const filter of filters.split('~')) {
      const [name, condition, value] = filter.split('>')

      const column = columns.find((column) => column.name === name)

      if (
        column &&
        column.onFilter &&
        isTableFilterCondition(condition) &&
        (value ?? (condition === TABLE_FILTERS_CONDITIONS.EMPTY || condition === TABLE_FILTERS_CONDITIONS.NOT_EMPTY))
      ) {
        where = merge(where, column.onFilter(value ?? '')[condition])
      }
    }
  }

  return {
    take: pageSize,
    skip: (page - 1) * pageSize,
    where,
    orderBy,
  }
}

export function getPageSize(value: string | string[] | undefined | null, fallback: number = 10) {
  const pageSize = Number(value)

  if (!Number.isInteger(pageSize) || pageSize <= 0) {
    return fallback
  }

  return Math.min(pageSize, TABLE_MAX_PAGE_SIZE)
}

export function getFilters<Data, Model extends TableModel>(
  paramsFilters: string | null,
  fallback: TableClientColumn<Data, Model>[],
) {
  if (!paramsFilters) {
    const defaultFilters = fallback.map(({ name, defaultFilter }) => ({
      name,
      condition: defaultFilter?.ui.condition,
      value: defaultFilter?.ui.value,
    }))

    return defaultFilters ?? []
  }

  return paramsFilters.split('~').map((filter) => {
    const [name, condition, value] = filter.split('>')

    return {
      name,
      ...(isTableFilterCondition(condition) && {
        condition,
        value,
      }),
    }
  })
}
