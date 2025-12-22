const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash('password123', 10)
  let user = await prisma.user.findUnique({ where: { email: 'admin@example.com' } })
  if (!user) {
    user = await prisma.user.create({ data: { email: 'admin@example.com', password: hashed, name: 'Admin' } })
  }

  const products = [
    { name: 'Home Loan', interest: 8.5, description: 'Home loan against mutual funds' },
    { name: 'Car Loan', interest: 10.0, description: 'Car loan secured by MF units' },
    { name: 'Personal Loan', interest: 14.5, description: 'Unsecured personal loan demo' },
    { name: 'Bike Loan', interest: 12.0, description: 'Two-wheeler loan' }
  ]

  for (const p of products) {
    const exists = await prisma.loanProduct.findFirst({ where: { name: p.name } })
    if (!exists) await prisma.loanProduct.create({ data: p })
  }

  const prod = await prisma.loanProduct.findFirst()
  if (prod) {
    const app = await prisma.loanApplication.create({
      data: {
        productId: prod.id,
        applicantName: 'John Doe',
        applicantEmail: 'john@example.com',
        principal: 500000,
        tenureMonths: 12,
        rate: prod.interest,
        status: 'approved'
      }
    })

    await prisma.collateral.create({
      data: {
        applicationId: app.id,
        fundName: 'ABC Mutual Fund - Growth',
        folio: 'FOLIO123',
        units: 100.0,
        nav: 50.5
      }
    })
  }

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
