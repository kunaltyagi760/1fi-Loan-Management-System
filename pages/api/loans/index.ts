import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getUserFromReq } from '../../../utils/auth'
import { MongoClient, ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const user = getUserFromReq(req)
    if (!user) return res.status(401).json({ error: 'Missing auth' })

    const { productId, applicantName, applicantEmail, principal, tenureMonths } = req.body
    if (!productId || !applicantName || !applicantEmail || !principal) {
      return res.status(400).json({ error: 'Missing fields' })
    }

    try {
      const prod = await prisma.loanProduct.findUnique({ where: { id: productId } })
      if (!prod) return res.status(400).json({ error: 'Invalid product' })

      const app = await prisma.loanApplication.create({
        data: {
          productId,
          applicantName,
          applicantEmail,
          principal: Number(principal),
          tenureMonths: Number(tenureMonths) || 12,
          rate: prod.interest,
          status: 'pending',
          createdBy: user.sub
        }
      })

      return res.status(201).json(app)
    } catch (err: any) {
      console.error('/api/loans create error:', err)
      // fallback for local MongoDB without replica set (Prisma may require transactions)
      if (typeof err.message === 'string' && /replica set|transactions/i.test(err.message)) {
        try {
          const url = process.env.DATABASE_URL
          if (!url) throw new Error('DATABASE_URL not set')
          const client = new MongoClient(url)
          await client.connect()
          const db = client.db()
          // ensure product exists
          const prod = await db.collection('LoanProduct').findOne({ _id: new ObjectId(productId) })
          if (!prod) {
            await client.close()
            return res.status(400).json({ error: 'Invalid product' })
          }
          const applications = db.collection('LoanApplication')
          const doc = {
            productId: new ObjectId(productId),
            applicantName,
            applicantEmail,
            principal: Number(principal),
            tenureMonths: Number(tenureMonths) || 12,
            rate: prod.interest || 0,
            status: 'pending',
            createdAt: new Date(),
            createdBy: new ObjectId(user.sub)
          }
          const r = await applications.insertOne(doc)
          await client.close()
          return res.status(201).json({ id: r.insertedId, ...doc })
        } catch (mongoErr: any) {
          console.error('Mongo fallback error (create loan):', mongoErr)
          return res.status(500).json({ error: mongoErr?.message ?? 'Mongo fallback failed' })
        }
      }

      return res.status(500).json({ error: err.message })
    }
  }

  // GET not allowed here; products are available at /api/products
  res.status(405).end()
}

