require('dotenv').config()
const { MongoClient, ObjectId } = require('mongodb')
const bcrypt = require('bcrypt')
const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL not set')
  process.exit(1)
}

async function main() {
  const client = new MongoClient(url)
  await client.connect()
  const db = client.db()

  const users = db.collection('User')
  const products = db.collection('LoanProduct')
  const applications = db.collection('LoanApplication')
  const collaterals = db.collection('Collateral')

  const hashed = await bcrypt.hash('password123', 10)
  const existingUser = await users.findOne({ email: 'admin@example.com' })
  if (!existingUser) {
    await users.insertOne({ email: 'admin@example.com', password: hashed, name: 'Admin', createdAt: new Date() })
  }

  const productList = [
    { name: 'Home Loan', interest: 8.5, description: 'Home loan against mutual funds', createdAt: new Date() },
    { name: 'Car Loan', interest: 10.0, description: 'Car loan secured by MF units', createdAt: new Date() },
    { name: 'Personal Loan', interest: 14.5, description: 'Unsecured personal loan demo', createdAt: new Date() },
    { name: 'Bike Loan', interest: 12.0, description: 'Two-wheeler loan', createdAt: new Date() }
  ]

  for (const p of productList) {
    const found = await products.findOne({ name: p.name })
    if (!found) await products.insertOne(p)
  }

  const prod = await products.findOne({})
  if (prod) {
    const existingApp = await applications.findOne({ applicantEmail: 'john@example.com' })
    let appId
    if (!existingApp) {
      const res = await applications.insertOne({ productId: prod._id, applicantName: 'John Doe', applicantEmail: 'john@example.com', principal: 500000, tenureMonths: 12, rate: prod.interest, status: 'approved', createdAt: new Date() })
      appId = res.insertedId
    } else {
      appId = existingApp._id
    }

    const existingCollateral = await collaterals.findOne({ folio: 'FOLIO123' })
    if (!existingCollateral) {
      await collaterals.insertOne({ applicationId: appId, fundName: 'ABC Mutual Fund - Growth', folio: 'FOLIO123', units: 100.0, nav: 50.5, createdAt: new Date() })
    }
  }

  console.log('Mongo seed completed')
  await client.close()
}

main().catch((e) => { console.error(e); process.exit(1) })
