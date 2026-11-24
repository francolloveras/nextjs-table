import { PageSearchParams } from '@/lib/type'
import { prisma } from '@/lib/prisma'
import Table from '@/ui/table'
import { TABLE_FILTERS_CONDITIONS } from '@/ui/table/const'
import { getPrismaTableQuery } from '@/ui/table/utils'
import { Prisma } from '@prisma/client'
import { TableColumn } from '@/ui/table/type'
import { cx, parse } from '@/lib/utils'
import Chip from '@/ui/chip'

const TABLE_ID = 'demo-table'
const STATUSES = {
  PAID: 'Paid',
  PENDING: 'Pending',
  OVERDUE: 'Overdue',
}

export default async function DemoTable({ searchParams }: { searchParams: PageSearchParams }) {
  const awaitedSearchParams = await searchParams

  const companies = await prisma.company.findMany({
    select: { name: true, industry: true, region: true },
  })

  const columns: TableColumn<RevenueData, Prisma.RevenueFindManyArgs>[] = [
    {
      name: 'invoiceNumber',
      label: 'Invoice',
      defaultSort: 'asc',
      onSort: (value) => ({ invoiceNumber: value }),
      onSearch: (value) => ({ invoiceNumber: { contains: value } }),
      onFilter: (value) => ({
        [TABLE_FILTERS_CONDITIONS.EQUALS]: { invoiceNumber: value },
        [TABLE_FILTERS_CONDITIONS.NOT_EQUALS]: { invoiceNumber: { not: value } },
        [TABLE_FILTERS_CONDITIONS.IN]: { invoiceNumber: { in: value.split(',') } },
        [TABLE_FILTERS_CONDITIONS.NOT_IN]: { invoiceNumber: { notIn: value.split(',') } },
        [TABLE_FILTERS_CONDITIONS.EMPTY]: { invoiceNumber: '' },
        [TABLE_FILTERS_CONDITIONS.NOT_EMPTY]: { invoiceNumber: { not: '' } },
      }),
    },
    {
      name: 'company',
      label: 'Company',
      type: 'list',
      lookup: Array.from(new Set(companies.map(({ name }) => name))),
      onSort: (value) => ({ company: { name: value } }),
      onSearch: (value) => ({ company: { is: { name: { contains: value } } } }),
      onFilter: (value) => ({
        [TABLE_FILTERS_CONDITIONS.EQUALS]: { company: { is: { name: value } } },
        [TABLE_FILTERS_CONDITIONS.NOT_EQUALS]: { company: { isNot: { name: value } } },
        [TABLE_FILTERS_CONDITIONS.IN]: { company: { is: { name: { in: value.split(',') } } } },
        [TABLE_FILTERS_CONDITIONS.NOT_IN]: { company: { isNot: { name: { in: value.split(',') } } } },
      }),
      render: ({ company }) => company.name,
    },
    {
      name: 'industry',
      label: 'Industry',
      type: 'list',
      lookup: Array.from(new Set(companies.map(({ industry }) => industry))),
      onSort: (value) => ({ company: { industry: value } }),
      onSearch: (value) => ({ company: { is: { industry: { contains: value } } } }),
      onFilter: (value) => ({
        [TABLE_FILTERS_CONDITIONS.EQUALS]: { company: { is: { industry: value } } },
        [TABLE_FILTERS_CONDITIONS.NOT_EQUALS]: { company: { isNot: { industry: value } } },
        [TABLE_FILTERS_CONDITIONS.IN]: { company: { is: { industry: { in: value.split(',') } } } },
        [TABLE_FILTERS_CONDITIONS.NOT_IN]: { company: { isNot: { industry: { in: value.split(',') } } } },
      }),
      render: ({ company }) => company.industry,
    },
    {
      name: 'region',
      label: 'Region',
      type: 'list',
      lookup: Array.from(new Set(companies.map(({ region }) => region))),
      onSort: (value) => ({ company: { region: value } }),
      onSearch: (value) => ({ company: { is: { region: { contains: value } } } }),
      onFilter: (value) => ({
        [TABLE_FILTERS_CONDITIONS.EQUALS]: { company: { is: { region: value } } },
        [TABLE_FILTERS_CONDITIONS.NOT_EQUALS]: { company: { isNot: { region: value } } },
        [TABLE_FILTERS_CONDITIONS.IN]: { company: { is: { region: { in: value.split(',') } } } },
        [TABLE_FILTERS_CONDITIONS.NOT_IN]: { company: { isNot: { region: { in: value.split(',') } } } },
      }),
      render: ({ company }) => company.region,
    },
    {
      name: 'period',
      label: 'Period',
      type: 'period',
      onSort: (value) => ({ period: value }),
      onSearch: (value) => ({ period: { contains: value } }),
      onFilter: (value) => {
        const [from, to] = value.split('_')

        return {
          [TABLE_FILTERS_CONDITIONS.EQUALS]: { period: value },
          [TABLE_FILTERS_CONDITIONS.NOT_EQUALS]: { period: { not: value } },
          [TABLE_FILTERS_CONDITIONS.IN]: { period: { gte: from, lte: to } },
          [TABLE_FILTERS_CONDITIONS.NOT_IN]: { NOT: { period: { gte: from, lte: to } } },
        }
      },
    },
    {
      name: 'amountCents',
      label: 'Revenue',
      onSort: (value) => ({ amountCents: value }),
      onSearch: (value) => ({ amountCents: parse.parseCents(value) }),
      onFilter: (value) => {
        const cents = parse.parseCents(value)

        return {
          [TABLE_FILTERS_CONDITIONS.EQUALS]: { amountCents: cents },
          [TABLE_FILTERS_CONDITIONS.NOT_EQUALS]: { amountCents: { not: cents } },
          [TABLE_FILTERS_CONDITIONS.GREATER_THAN]: { amountCents: { gt: cents } },
          [TABLE_FILTERS_CONDITIONS.LOWER_THAN]: { amountCents: { lt: cents } },
        }
      },
      render: ({ amountCents }) => parse.formatCents(amountCents),
    },
    {
      name: 'status',
      label: 'Status',
      type: 'list',
      lookup: Object.values(STATUSES),
      onSort: (value) => ({ status: value }),
      onSearch: (value) => ({ status: { contains: value } }),
      onFilter: (value) => ({
        [TABLE_FILTERS_CONDITIONS.EQUALS]: { status: value },
        [TABLE_FILTERS_CONDITIONS.NOT_EQUALS]: { status: { not: value } },
        [TABLE_FILTERS_CONDITIONS.IN]: { status: { in: value.split(',') } },
        [TABLE_FILTERS_CONDITIONS.NOT_IN]: { status: { notIn: value.split(',') } },
        [TABLE_FILTERS_CONDITIONS.EMPTY]: { status: '' },
        [TABLE_FILTERS_CONDITIONS.NOT_EMPTY]: { status: { not: '' } },
      }),
      render: ({ status }) => (
        <Chip
          className={cx({
            'border-green-300 text-green-800 bg-green-200': status === STATUSES.PAID,
            'border-amber-300 text-amber-800 bg-amber-200': status === STATUSES.PENDING,
            'border-red-300 text-red-800 bg-red-200': status === STATUSES.OVERDUE,
          })}
        >
          {status}
        </Chip>
      ),
    },
  ]

  const query = getPrismaTableQuery({
    columns,
    params: awaitedSearchParams,
  })

  const [data, dataCount, totalCount] = await Promise.all([
    prisma.revenue.findMany({ ...query, ...revenueQuery }),
    prisma.revenue.count({ where: query.where }),
    prisma.revenue.count(),
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

const revenueQuery = Prisma.validator<Prisma.RevenueFindManyArgs>()({
  select: {
    id: true,
    invoiceNumber: true,
    company: { select: { name: true, industry: true, region: true } },
    period: true,
    amountCents: true,
    status: true,
  },
})
type RevenueData = Prisma.RevenueGetPayload<typeof revenueQuery>
