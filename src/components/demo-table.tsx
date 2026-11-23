import { PageSearchParams } from '@/lib/type'
import Table from '@/ui/table'
import { TableColumn } from '@/ui/table/type'

const TABLE_ID = 'demo-table'

export default async function DemoTable({ searchParams }: { searchParams: PageSearchParams }) {
  const awaitedSearchParams = await searchParams

  const columns: TableColumn<Data, { orderBy: object; where: object }>[] = [
    {
      name: 'id',
      label: 'ID',
      render: ({ id }) => id,
    },
    {
      name: 'username',
      label: 'Username',
      render: ({ username }) => username,
    },
    {
      name: 'first-name',
      label: 'First name',
      render: ({ firstName }) => firstName,
    },
    {
      name: 'last-name',
      label: 'Last name',
      render: ({ lastName }) => lastName,
    },
    {
      name: 'rol',
      label: 'Rol',
      render: ({ rol }) => rol,
    },
  ]

  const data: Data[] = [
    {
      id: 1,
      username: 'flloveras',
      firstName: 'Franco',
      lastName: 'Lloveras',
      rol: 'Admin',
    },
  ]
  const dataCount = 8
  const totalCount = 10

  return (
    <Table
      id={TABLE_ID}
      columns={columns}
      data={data}
      dataCount={dataCount}
      totalCount={totalCount}
      searchParams={awaitedSearchParams}
    />
  )
}

interface Data {
  id: number
  username: string
  firstName: string
  lastName: string
  rol: string
}
