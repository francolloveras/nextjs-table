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
  [TABLE_FILTERS_CONDITIONS.EQUALS]: 'Es igual a',
  [TABLE_FILTERS_CONDITIONS.NOT_EQUALS]: 'No es igual a',
  [TABLE_FILTERS_CONDITIONS.GREATER_THAN]: 'Mayor a',
  [TABLE_FILTERS_CONDITIONS.LOWER_THAN]: 'Menor a',
  [TABLE_FILTERS_CONDITIONS.IN]: 'Entre',
  [TABLE_FILTERS_CONDITIONS.NOT_IN]: 'No está entre',
  [TABLE_FILTERS_CONDITIONS.EMPTY]: 'Esta vacío',
  [TABLE_FILTERS_CONDITIONS.NOT_EMPTY]: 'No esta vacío',
} as const
