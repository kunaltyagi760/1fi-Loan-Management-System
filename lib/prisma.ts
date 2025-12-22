// Use require to import PrismaClient to avoid some TS resolution issues
// and ensure we use a single shared client instance.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client')

type PrismaAny = any
const globalForPrisma = global as unknown as { prisma?: PrismaAny }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ['query'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
