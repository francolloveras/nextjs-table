export const TABLE_MAX_PAGE_SIZE = 100 as const

export const TABLE_PARAMS = {
  SEARCH: 'search',
  SORT: 'sort',
  HIDE_COLUMNS: 'hide-columns',
  PAGE: 'page',
  PAGE_SIZE: 'page-size',
  FILTER: 'filter',
} as const

export const TABLE_FILTERS_CONDITIONS = {
  EQUALS: 'equal',
  NOT_EQUALS: 'not-equal',
  GREATER_THAN: 'gt',
  LOWER_THAN: 'lt',
  IN: 'in',
  NOT_IN: 'not-in',
  EMPTY: 'empty',
  NOT_EMPTY: 'not-empty',
} as const

export const TABLE_FILTERS_CONDITIONS_LABELS = {
  [TABLE_FILTERS_CONDITIONS.EQUALS]: 'Equals',
  [TABLE_FILTERS_CONDITIONS.NOT_EQUALS]: 'Does not equal',
  [TABLE_FILTERS_CONDITIONS.GREATER_THAN]: 'Greater than',
  [TABLE_FILTERS_CONDITIONS.LOWER_THAN]: 'Less than',
  [TABLE_FILTERS_CONDITIONS.IN]: 'Is between',
  [TABLE_FILTERS_CONDITIONS.NOT_IN]: 'Is not between',
  [TABLE_FILTERS_CONDITIONS.EMPTY]: 'Is empty',
  [TABLE_FILTERS_CONDITIONS.NOT_EMPTY]: 'Is not empty',
} as const
