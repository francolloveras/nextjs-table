import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
}

const createPrismaClient = () => {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (Boolean(url) !== Boolean(authToken)) {
    throw new Error('Set both TURSO_DATABASE_URL and TURSO_AUTH_TOKEN')
  }

  if (url && authToken) {
    return new PrismaClient({
      adapter: new PrismaLibSQL({ url, authToken }),
    })
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Turso credentials are required in production')
  }

  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
