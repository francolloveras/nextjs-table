'use client'

import { useState } from 'react'
import { FloatingPortal } from '@floating-ui/react'
import { useDebouncedCallback } from 'use-debounce'

import { useFloating } from '@/lib/hooks/useFloating'
import { useSearchParams } from '@/lib/hooks/useSearchParams'
import Button from '@/ui/button'
import DateInput, { type DateRange } from '@/ui/date-input'
import Icon from '@/ui/icon'
import Input from '@/ui/input'
import SelectInput from '@/ui/select-input'
import { cx } from '@/lib/utils'
import { parse } from '@/lib/utils'
import { TableClientColumn, TableColumnFilter, TableFilterConditions, TableModel } from '@/ui/table/type'
import { TABLE_FILTERS_CONDITIONS, TABLE_FILTERS_CONDITIONS_LABELS, TABLE_PARAMS } from '@/ui/table/const'
import { getFilters } from '@/ui/table/utils'

export default function TableHeader<Data, Model extends TableModel>({
  id,
  columns,
  hiddenColumns,
  paramsPrefix,
  buttons,
}: {
  id: string
  columns: TableClientColumn<Data, Model>[]
  hiddenColumns: string[]
  paramsPrefix: string
  buttons?: React.ReactNode
}) {
  const searchParams = useSearchParams()
  const search = searchParams.get(paramsPrefix + TABLE_PARAMS.SEARCH) ?? ''

  const handleSearch = useDebouncedCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim()

    searchParams.update((params) => {
      params.set(paramsPrefix + TABLE_PARAMS.PAGE, '1')

      if (value.length === 0) {
        params.delete(paramsPrefix + TABLE_PARAMS.SEARCH)
      } else {
        params.set(paramsPrefix + TABLE_PARAMS.SEARCH, value)
      }
    })
  }, 300)

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-col justify-end gap-2 md:flex-row">
        <Input
          name={`${id}-search`}
          placeholder="Search..."
          defaultValue={search}
          onChange={handleSearch}
          icon="search"
          disableSupportingText
        />
        <div className="flex gap-x-2">
          {buttons}
          <TableColumns columns={columns} hiddenColumns={hiddenColumns} paramsPrefix={paramsPrefix} />
        </div>
      </div>
      <TableFilters columns={columns} paramsPrefix={paramsPrefix} />
    </div>
  )
}

function TableColumns<Data, Model extends TableModel>({
  columns,
  hiddenColumns,
  paramsPrefix,
}: {
  columns: TableClientColumn<Data, Model>[]
  hiddenColumns: string[]
  paramsPrefix: string
}) {
  const searchParams = useSearchParams()
  const { isOpen, refs, floatingStyles, getReferenceProps, getFloatingProps } = useFloating({
    placement: 'bottom-end',
  })

  const handleColumns = (column: string) => {
    const alreadyHidden = hiddenColumns.includes(column)

    const newHiddenColumns = alreadyHidden
      ? hiddenColumns.filter((name) => name !== column)
      : [...hiddenColumns, column]

    if (newHiddenColumns.length === 0) {
      return searchParams.set(paramsPrefix + TABLE_PARAMS.HIDE_COLUMNS, 'none')
    }

    searchParams.set(paramsPrefix + TABLE_PARAMS.HIDE_COLUMNS, newHiddenColumns.join('>'))
  }

  return (
    <div className="relative">
      <Button
        ref={refs.setReference}
        {...getReferenceProps()}
        variant="default"
        className="w-fit"
        icon="slidersHorizontal"
      >
        Columns
      </Button>
      {isOpen && (
        <FloatingPortal>
          <div
            // False positive in this lint rule: https://github.com/floating-ui/floating-ui/discussions/3405#discussioncomment-14657647
            // eslint-disable-next-line react-hooks/refs
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-10 rounded-md border border-neutral-200 bg-white pr-0.5 text-sm text-neutral-900 shadow-sm"
          >
            <div className="max-h-[calc(2rem*8+0.25rem)] min-w-48 overflow-y-auto p-1">
              {columns.map(({ name, label }) => {
                const isSelected = !hiddenColumns.includes(name)

                return (
                  <Button
                    key={name}
                    onClick={() => handleColumns(name)}
                    disabled={hiddenColumns.length === columns.length - 1 && !hiddenColumns.includes(name)}
                    variant="transparent"
                  >
                    <div
                      className={cx('grid size-4 place-content-center rounded border border-neutral-500', {
                        'bg-blue-600 text-white border-blue-600': isSelected,
                      })}
                    >
                      {isSelected && <Icon icon="check" strokeWidth={4} className="mb-0 mt-0.5 size-3" />}
                    </div>
                    {label}
                  </Button>
                )
              })}
            </div>
          </div>
        </FloatingPortal>
      )}
    </div>
  )
}

function TableFilters<Data, Model extends TableModel>({
  columns,
  paramsPrefix,
}: {
  columns: TableClientColumn<Data, Model>[]
  paramsPrefix: string
}) {
  const searchParams = useSearchParams()
  const { isOpen, refs, floatingStyles, getReferenceProps, getFloatingProps, closeModal } = useFloating({
    placement: 'bottom-start',
  })

  const filterableColumns = columns.filter(({ filterConditions }) => filterConditions)
  const defaultFilters = columns.filter(({ defaultFilter }) => defaultFilter)

  const [renderColumns, setRenderColumns] = useState(filterableColumns)
  const [filters, setFilters] = useState(
    getFilters(searchParams.get(paramsPrefix + TABLE_PARAMS.FILTER), defaultFilters),
  )

  const addFilter = (filter: TableColumnFilter) => {
    const newFilters = [...filters, filter]

    closeModal()
    setFilters(newFilters)
    updateUrl(newFilters)
  }

  const deleteFilter = (name: string) => {
    const newFilters = filters.filter((filter) => filter.name !== name)

    setFilters(newFilters)
    updateUrl(newFilters)
  }

  const updateFilter = (newFilter: TableColumnFilter) => {
    const newFilters = filters.map((prevFilter) => (prevFilter.name === newFilter.name ? newFilter : prevFilter))

    setFilters(newFilters)
    updateUrl(newFilters)
  }

  const clearFilters = () => {
    const newFilters: [] = []

    setFilters(newFilters)
    updateUrl(newFilters)
  }

  const updateUrl = (filters: TableColumnFilter[]) => {
    if (filters.length === 0) {
      searchParams.remove(paramsPrefix + TABLE_PARAMS.FILTER)
      return
    }

    const parsedFilters = filters.map(({ name, condition, value }) =>
      [name, condition, value].filter(Boolean).join('>'),
    )

    searchParams.update((params) => {
      params.set(paramsPrefix + TABLE_PARAMS.PAGE, '1')
      params.set(paramsPrefix + TABLE_PARAMS.FILTER, parsedFilters.join('~'))
    })
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (value.length > 0) {
      return setRenderColumns(
        filterableColumns.filter(({ label }) => {
          const parsedLabel = parse.removeAccents(label.trim().toLowerCase())
          const parsedSearch = parse.removeAccents(value.trim().toLowerCase())

          return parsedLabel.includes(parsedSearch)
        }),
      )
    }

    setRenderColumns(filterableColumns)
  }

  return (
    filterableColumns.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {filters.map((filter) => {
          const column = columns.find(({ name }) => name === filter.name)

          if (!column || !column.filterConditions) return null

          return (
            <FilterModal
              {...filter}
              key={filter.name}
              column={column}
              updateFilter={updateFilter}
              deleteFilter={deleteFilter}
            />
          )
        })}
        {filters.length !== filterableColumns.length && (
          <div className="relative">
            <Button
              ref={refs.setReference}
              {...getReferenceProps()}
              variant="outline"
              className="w-fit border-dashed bg-white py-1.5 text-xs"
              icon={{ icon: 'plus', className: 'size-3.5 mb-0' }}
            >
              Agregar filtro
            </Button>
            {isOpen && (
              <FloatingPortal>
                <div
                  // False positive in this lint rule: https://github.com/floating-ui/floating-ui/discussions/3405#discussioncomment-14657647
                  // eslint-disable-next-line react-hooks/refs
                  ref={refs.setFloating}
                  style={floatingStyles}
                  {...getFloatingProps()}
                  className="z-10 min-w-32 rounded-md border border-neutral-200 bg-white pr-0.5 text-sm text-neutral-900 shadow-sm"
                >
                  <div className="max-h-[calc(8px+32px*8)] overflow-y-auto">
                    {filterableColumns.length > 12 && (
                      <div className="sticky top-0 flex gap-x-1 rounded-t-md bg-white p-2 pb-1">
                        <input
                          name={'table-filter-search'}
                          onChange={handleSearchChange}
                          className="w-full rounded border border-neutral-200 px-3 py-1 text-sm outline-none outline-2 -outline-offset-2 placeholder:text-neutral-800 focus:outline-blue-600 "
                          placeholder="Search..."
                        />
                      </div>
                    )}
                    <div className="p-1">
                      {renderColumns.length > 0 ? (
                        renderColumns
                          .filter(({ name }) => !filters.find((filter) => filter.name === name))
                          .map((column) => (
                            <Button
                              key={column.name}
                              onClick={() =>
                                addFilter({
                                  name: column.name,
                                  condition: column.filterConditions?.[0],
                                })
                              }
                              variant="transparent"
                            >
                              {column.label}
                            </Button>
                          ))
                      ) : (
                        <p className="px-2 py-1.5 italic text-neutral-800">Sin resultados para la búsqueda.</p>
                      )}
                    </div>
                  </div>
                </div>
              </FloatingPortal>
            )}
          </div>
        )}
        {filters.length >= 1 && (
          <Button
            onClick={clearFilters}
            variant="outline"
            className="w-fit border-red-200 bg-red-100 py-1.5 text-xs text-red-900 hover:bg-red-300 hover:text-red-900"
            icon={{ icon: 'x', className: 'size-3.5 mb-0' }}
          >
            Eliminar filtros
          </Button>
        )}
      </div>
    )
  )
}

function FilterModal<Data, Model extends TableModel>({
  name,
  condition,
  value,
  column,
  updateFilter,
  deleteFilter,
}: {
  name: string
  condition?: TableFilterConditions
  value?: string
  column: TableClientColumn<Data, Model>
  updateFilter: (filter: TableColumnFilter) => void
  deleteFilter: (name: string) => void
}) {
  const { isOpen, refs, floatingStyles, getReferenceProps, getFloatingProps } = useFloating({
    placement: 'bottom-start',
  })

  const [inputValue, setInputValue] = useState(value ?? '')

  const multiCondition = condition === TABLE_FILTERS_CONDITIONS.IN || condition === TABLE_FILTERS_CONDITIONS.NOT_IN
  const numberCondition =
    column.filterConditions?.includes(TABLE_FILTERS_CONDITIONS.GREATER_THAN) ??
    column.filterConditions?.includes(TABLE_FILTERS_CONDITIONS.LOWER_THAN)

  const filterValueLabel = (() => {
    if (multiCondition) {
      if (column.type === 'list') return value?.split(',').join(', ')
      if (column.type === 'date') {
        const [from, to] = value?.split('_') ?? ['', '']

        return `${parse.toDate(from)?.toLocaleDateString('es-AR') ?? ''} - ${parse.toDate(to)?.toLocaleDateString('es-AR') ?? ''}`
      }
    }

    if (column.type === 'date') {
      return parse.toDate(value)?.toLocaleDateString('es-AR')
    }

    return value
  })()

  const restartFilter = (event: React.MouseEvent<HTMLSpanElement> | undefined) => {
    event?.stopPropagation()
    updateFilter({ name, condition: undefined, value: undefined })
  }

  const updateInputFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value

    setInputValue(newValue)
    debounceUpdateFilter(newValue)
  }

  const debounceUpdateFilter = useDebouncedCallback((value: string) => {
    updateFilter({ name, condition, value })
  }, 300)

  return (
    <div className="relative">
      <Button
        ref={refs.setReference}
        {...getReferenceProps()}
        variant="outline"
        className={cx('w-fit items-center bg-white px-2 py-1.5 text-xs', {
          'border-dashed': !condition,
        })}
      >
        <span
          {...(condition && {
            onClick: () => deleteFilter(name),
            className: 'hover:text-red-900',
          })}
        >
          <Icon
            icon="plus"
            className={cx('transition-transform size-3.5 mb-0 -mt-px', {
              'rotate-45': condition,
            })}
          />
        </span>
        <span className="flex gap-x-1">
          {column.label}{' '}
          {condition && (
            <span className="block max-w-72 truncate text-blue-600">
              {TABLE_FILTERS_CONDITIONS_LABELS[condition].toLocaleLowerCase()} {filterValueLabel}
            </span>
          )}
        </span>
        <Icon icon="chevronDown" className="mb-0 size-4" />
      </Button>
      {isOpen && (
        <FloatingPortal>
          <div
            // False positive in this lint rule: https://github.com/floating-ui/floating-ui/discussions/3405#discussioncomment-14657647
            // eslint-disable-next-line react-hooks/refs
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-10 flex w-72 flex-col gap-y-2 rounded-md border border-neutral-200 bg-white p-2.5 text-sm text-neutral-900 shadow-sm"
          >
            <h4 className="text-sm text-neutral-900">Filtrar por {column.label}</h4>
            <SelectInput
              type="single"
              name={`${name}-filter-condition`}
              placeholder="Seleccionar condición"
              onChange={(option) => updateFilter({ name, condition: option as TableFilterConditions })}
              value={condition ?? ''}
              options={column.filterConditions!.map((value) => ({
                value,
                label: TABLE_FILTERS_CONDITIONS_LABELS[value],
              }))}
              disableSupportingText
            />
            {condition !== TABLE_FILTERS_CONDITIONS.EMPTY && condition !== TABLE_FILTERS_CONDITIONS.NOT_EMPTY ? (
              <div className="mb-2 flex flex-col gap-y-1.5">
                <div className="flex items-center gap-x-1.5">
                  <Icon icon="cornerDownRight" className="ml-1 text-neutral-700" strokeWidth={3} />
                  {column.type === 'list' && column.lookup ? (
                    <SelectInput
                      name={`${name}-filter-value`}
                      {...(multiCondition
                        ? {
                            type: 'multi',
                            value: value?.split(',') ?? [''],
                            onChange: (option) => updateFilter({ name, condition, value: option.join(',') }),
                          }
                        : {
                            type: 'single',
                            value: value ?? '',
                            onChange: (option) => updateFilter({ name, condition, value: option }),
                          })}
                      options={column.lookup}
                      placeholder={multiCondition ? 'Seleccionar valores' : 'Seleccionar valor'}
                      disabled={!condition}
                      disableSupportingText
                    />
                  ) : column.type === 'date' ? (
                    <DateFilter
                      name={name}
                      value={value}
                      condition={condition}
                      multiCondition={multiCondition}
                      updateFilter={updateFilter}
                    />
                  ) : (
                    <Input
                      name={`${name}-filter-value`}
                      value={inputValue ?? ''}
                      onChange={updateInputFilter}
                      placeholder="Valor a filtrar"
                      disabled={!condition}
                      disableSupportingText
                    />
                  )}
                </div>
                {multiCondition && (column.type === 'date' || column.type !== 'list') && (
                  <p className="ml-6 text-xs text-neutral-800">
                    <Icon icon="info" className="mr-1" />
                    {column.type === 'date'
                      ? 'Selecciona dos fechas para definir el rango de búsqueda.'
                      : 'Escribe los valores separados por coma para filtrar entre ellos.'}
                  </p>
                )}
                {numberCondition && (
                  <p className="ml-6 text-xs text-neutral-800">
                    <Icon icon="info" className="mr-1" />
                    Para filtrar valores negativos, utiliza el signo &quot;-&quot; antes del número.
                  </p>
                )}
              </div>
            ) : null}
            <Button onClick={restartFilter} variant="outline" className="py-1.5">
              Reiniciar
            </Button>
            <Button
              onClick={() => deleteFilter(name)}
              variant="outline"
              className="border-red-200 bg-red-100 py-1.5 text-red-900 hover:bg-red-300 hover:text-red-900"
            >
              Eliminar
            </Button>
          </div>
        </FloatingPortal>
      )}
    </div>
  )
}

function DateFilter({
  name,
  value,
  condition,
  multiCondition,
  updateFilter,
}: {
  name: string
  value?: string
  condition?: TableFilterConditions
  multiCondition: boolean
  updateFilter: (filter: TableColumnFilter) => void
}) {
  const [from, to] = value?.split('_') ?? ['', '']
  const [range, setRange] = useState<DateRange | null>({
    from: parse.toDate(from) ?? null,
    to: parse.toDate(to) ?? null,
  })

  const handleRangeFilter = (range: DateRange | null) => {
    setRange(range)

    if (range === null) {
      updateFilter({
        name,
        condition,
        value: '',
      })
    }

    if (range?.from && range.to) {
      updateFilter({
        name,
        condition,
        value: `${parse.toISOString(range.from)}_${parse.toISOString(range.to)}`,
      })
    }
  }

  return multiCondition ? (
    <DateInput
      name={`${name}-filter-value`}
      mode="range"
      value={range}
      onChange={handleRangeFilter}
      disabled={!condition}
      disableSupportingText
    />
  ) : (
    <DateInput
      name={`${name}-filter-value`}
      mode="single"
      value={parse.toDate(value)}
      onChange={(date) =>
        updateFilter({
          name,
          condition,
          value: date ? parse.toISOString(date) : '',
        })
      }
      disabled={!condition}
      disableSupportingText
    />
  )
}
