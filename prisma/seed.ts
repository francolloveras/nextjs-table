import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const users = [
  { username: 'flloveras', firstName: 'Franco', lastName: 'Lloveras', role: 'Admin' },
  { username: 'amelia.chen', firstName: 'Amelia', lastName: 'Chen', role: 'Editor' },
  { username: 'noah.williams', firstName: 'Noah', lastName: 'Williams', role: 'Member' },
  { username: 'isabella.martin', firstName: 'Isabella', lastName: 'Martin', role: 'Viewer' },
  { username: 'liam.johnson', firstName: 'Liam', lastName: 'Johnson', role: 'Member' },
  { username: 'mia.garcia', firstName: 'Mia', lastName: 'Garcia', role: 'Editor' },
  { username: 'elijah.davis', firstName: 'Elijah', lastName: 'Davis', role: 'Viewer' },
  { username: 'sophia.rodriguez', firstName: 'Sophia', lastName: 'Rodriguez', role: 'Member' },
  { username: 'lucas.miller', firstName: 'Lucas', lastName: 'Miller', role: 'Admin' },
  { username: 'charlotte.lopez', firstName: 'Charlotte', lastName: 'Lopez', role: 'Editor' },
  { username: 'ezra.wilson', firstName: 'Ezra', lastName: 'Wilson', role: 'Member' },
  { username: 'harper.anderson', firstName: 'Harper', lastName: 'Anderson', role: 'Viewer' },
  { username: 'james.thomas', firstName: 'James', lastName: 'Thomas', role: 'Member' },
  { username: 'evelyn.taylor', firstName: 'Evelyn', lastName: 'Taylor', role: 'Editor' },
  { username: 'leo.moore', firstName: 'Leo', lastName: 'Moore', role: 'Viewer' },
  { username: 'abigail.jackson', firstName: 'Abigail', lastName: 'Jackson', role: 'Member' },
  { username: 'henry.white', firstName: 'Henry', lastName: 'White', role: 'Admin' },
  { username: 'ella.harris', firstName: 'Ella', lastName: 'Harris', role: 'Editor' },
  { username: 'jack.martinez', firstName: 'Jack', lastName: 'Martinez', role: 'Member' },
  { username: 'aria.clark', firstName: 'Aria', lastName: 'Clark', role: 'Viewer' },
]

try {
  await Promise.all(
    users.map(({ username, ...user }) =>
      prisma.user.upsert({
        where: { username },
        update: user,
        create: { username, ...user },
      }),
    ),
  )
} finally {
  await prisma.$disconnect()
}
