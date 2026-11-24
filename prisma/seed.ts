import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const companies = [
  { name: 'Northstar Analytics', industry: 'Technology', region: 'North America' },
  { name: 'Greenline Energy', industry: 'Energy', region: 'North America' },
  { name: 'Meridian Health', industry: 'Healthcare', region: 'Asia Pacific' },
  { name: 'Aster & Co', industry: 'Professional Services', region: 'Europe' },
  { name: 'Paper Kite Studios', industry: 'Media', region: 'Europe' },
  { name: 'Copperfield Logistics', industry: 'Logistics', region: 'Asia Pacific' },
]

const periods = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05']
const statuses = ['Paid', 'Paid', 'Pending', 'Overdue']

const revenues = companies.flatMap((company, companyIndex) =>
  periods.map((period, periodIndex) => ({
    invoiceNumber: `INV-${period.replace('-', '')}-${String(companyIndex + 1).padStart(3, '0')}`,
    companyName: company.name,
    period,
    amountCents: 425_000 + companyIndex * 218_000 + periodIndex * 36_500 + companyIndex * periodIndex * 8_100,
    status: statuses[(companyIndex + periodIndex) % statuses.length],
  })),
)

try {
  const seededCompanies = await Promise.all(
    companies.map(({ name, ...company }) =>
      prisma.company.upsert({
        where: { name },
        update: company,
        create: { name, ...company },
      }),
    ),
  )
  const companyIds = new Map(seededCompanies.map(({ name, id }) => [name, id]))

  await Promise.all(
    revenues.map(({ companyName, ...revenue }) => {
      const companyId = companyIds.get(companyName)

      if (companyId === undefined) {
        throw new Error(`Seeded company not found: ${companyName}`)
      }

      return prisma.revenue.upsert({
        where: { invoiceNumber: revenue.invoiceNumber },
        update: { ...revenue, companyId },
        create: { ...revenue, companyId },
      })
    }),
  )
} finally {
  await prisma.$disconnect()
}
