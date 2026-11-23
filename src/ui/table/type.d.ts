import { Valueof } from '@/lib/type'
import { TABLE_FILTERS_CONDITIONS } from '@/ui/table/const'

export interface TableModel {
  where?: object
  orderBy?: object
}

export type TableFilterConditions = Valueof<typeof TABLE_FILTERS_CONDITIONS>
export interface TableColumnFilter {
  condition?: TableFilterConditions
  value?: string
}
export interface TableColumnFilterWithName extends TableColumnFilter {
  name: string
}

interface TableColumnBase<Data, Model extends TableModel> {
  name: string
  label: string
  type?: 'default' | 'list' | 'date'
  defaultSort?: 'asc' | 'desc'
  defaultHidden?: boolean
  defaultFilter?: { ui: TableColumnFilter; query?: Model['where'] }
  lookup?: string[]
  onSearch?: (value: string) => Model['where']
  onSort?: (value: 'asc' | 'desc') => Model['orderBy']
  onFilter?: (value: string) => Partial<Record<TableFilterConditions, Model['where']>>
  render?: (fields: Data) => React.ReactNode
}

interface TableColumnDefault<Data, Model extends TableModel> extends TableColumnBase<Data, Model> {
  type?: 'default'
}

interface TableColumnDate<Data, Model extends TableModel> extends TableColumnBase<Data, Model> {
  type?: 'date'
}

interface TableColumnList<Data, Model extends TableModel> extends TableColumnBase<Data, Model> {
  type: 'list'
  lookup: string[]
}

export type TableColumn<Data, Model extends TableModel> =
  | TableColumnDefault<Data, Model>
  | TableColumnDate<Data, Model>
  | TableColumnList<Data, Model>

export interface TableClientColumn<Data, Model extends TableModel> extends TableColumnBase<Data, Model> {
  sortable: boolean
  searchable: boolean
  filterConditions: TableFilterConditions[] | undefined
}

export interface TableColumnFilter {
  name: string
  value?: string
  condition?: TableFilterConditions
}
