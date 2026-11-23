import { PageSearchParams } from '@/lib/type'
import { prisma } from '@/lib/prisma'
import Table from '@/ui/table'
import { TABLE_FILTERS_CONDITIONS } from '@/ui/table/const'
import { getPrismaTableQuery } from '@/ui/table/utils'
import { Prisma } from '@prisma/client'
import { TableColumn, TableFilterConditions } from '@/ui/table/type'

const TABLE_ID = 'demo-table'
const roles = ['Admin', 'Editor', 'Member', 'Viewer']

type UserData = Prisma.UserGetPayload<Record<string, never>>

const columns: TableColumn<UserData, Prisma.UserFindManyArgs>[] = [
  {
    name: 'id',
    label: 'ID',
    defaultSort: 'asc',
    onSort: (value) => ({ id: value }),
    onSearch: (value) => ({ id: Number.isInteger(Number(value)) ? Number(value) : -1 }),
    onFilter: (value) => {
      const number = Number(value)
      const numbers = value.split(',').map(Number).filter(Number.isInteger)

      return {
        [TABLE_FILTERS_CONDITIONS.EQUALS]: { id: Number.isInteger(number) ? number : -1 },
        [TABLE_FILTERS_CONDITIONS.NOT_EQUALS]: { id: { not: Number.isInteger(number) ? number : -1 } },
        [TABLE_FILTERS_CONDITIONS.GREATER_THAN]: { id: { gt: Number.isInteger(number) ? number : -1 } },
        [TABLE_FILTERS_CONDITIONS.LOWER_THAN]: { id: { lt: Number.isInteger(number) ? number : -1 } },
        [TABLE_FILTERS_CONDITIONS.IN]: { id: { in: numbers } },
        [TABLE_FILTERS_CONDITIONS.NOT_IN]: { id: { notIn: numbers } },
      }
    },
  },
  {
    name: 'username',
    label: 'Username',
    onSort: (value) => ({ username: value }),
    onSearch: (value) => ({ username: { contains: value } }),
    onFilter: (value) => stringFilters('username', value),
  },
  {
    name: 'first-name',
    label: 'First name',
    onSort: (value) => ({ firstName: value }),
    onSearch: (value) => ({ firstName: { contains: value } }),
    onFilter: (value) => stringFilters('firstName', value),
    render: (fields) => fields.firstName,
  },
  {
    name: 'last-name',
    label: 'Last name',
    onSort: (value) => ({ lastName: value }),
    onSearch: (value) => ({ lastName: { contains: value } }),
    onFilter: (value) => stringFilters('lastName', value),
    render: (fields) => fields.lastName,
  },
  {
    name: 'role',
    label: 'Role',
    type: 'list',
    lookup: roles,
    onSort: (value) => ({ role: value }),
    onSearch: (value) => ({ role: { contains: value } }),
    onFilter: (value) => ({
      [TABLE_FILTERS_CONDITIONS.EQUALS]: { role: value },
      [TABLE_FILTERS_CONDITIONS.NOT_EQUALS]: { role: { not: value } },
      [TABLE_FILTERS_CONDITIONS.IN]: { role: { in: value.split(',') } },
      [TABLE_FILTERS_CONDITIONS.NOT_IN]: { role: { notIn: value.split(',') } },
    }),
  },
]

export default async function DemoTable({ searchParams }: { searchParams: PageSearchParams }) {
  const awaitedSearchParams = await searchParams

  const query = getPrismaTableQuery({
    columns,
    params: awaitedSearchParams,
  })

  const [data, dataCount, totalCount] = await Promise.all([
    prisma.user.findMany(query),
    prisma.user.count({ where: query.where }),
    prisma.user.count(),
  ])

  return (
    <Table
      id={TABLE_ID}
      columns={columns}
      data={data}
      dataCount={dataCount}
      totalCount={totalCount}
      searchParams={awaitedSearchParams}
      options={{ pageSize: 10 }}
    />
  )
}

function stringFilters(
  field: 'username' | 'firstName' | 'lastName',
  value: string,
): Partial<Record<TableFilterConditions, Prisma.UserWhereInput>> {
  const values = value.split(',')

  return {
    [TABLE_FILTERS_CONDITIONS.EQUALS]: { [field]: value },
    [TABLE_FILTERS_CONDITIONS.NOT_EQUALS]: { [field]: { not: value } },
    [TABLE_FILTERS_CONDITIONS.IN]: { [field]: { in: values } },
    [TABLE_FILTERS_CONDITIONS.NOT_IN]: { [field]: { notIn: values } },
    [TABLE_FILTERS_CONDITIONS.EMPTY]: { [field]: '' },
    [TABLE_FILTERS_CONDITIONS.NOT_EMPTY]: { [field]: { not: '' } },
  }
}
