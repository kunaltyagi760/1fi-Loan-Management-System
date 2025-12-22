import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { MongoClient } from 'mongodb'

function isEmail(email: string) {
  // simple validation
  return /^\S+@\S+\.\S+$/.test(email)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, password, name } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
  if (!isEmail(email)) return res.status(400).json({ error: 'Invalid email' })
  if (typeof password !== 'string' || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

  const hashed = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({ data: { email, password: hashed, name } })
    return res.status(201).json({ id: user.id, email: user.email })
  } catch (err: any) {
    console.error('/api/auth/register error:', err)
    // handle unique constraint
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return res.status(409).json({ error: 'Email already registered' })
    }

    // Prisma + Mongo local dev: fallback to native Mongo driver when transactions/replica-set required
    if (typeof err.message === 'string' && /replica set|transactions/i.test(err.message)) {
      try {
        const url = process.env.DATABASE_URL
        if (!url) throw new Error('DATABASE_URL not set')
        const client = new MongoClient(url)
        await client.connect()
        const db = client.db()
        const users = db.collection('User')
        const existing = await users.findOne({ email })
        if (existing) {
          await client.close()
          return res.status(409).json({ error: 'Email already registered' })
        }
        const ins = await users.insertOne({ email, password: hashed, name, createdAt: new Date() })
        await client.close()
        return res.status(201).json({ id: ins.insertedId, email })
      } catch (mongoErr: any) {
        console.error('Mongo fallback error:', mongoErr)
        return res.status(500).json({ error: mongoErr?.message ?? 'Mongo fallback failed' })
      }
    }

    return res.status(500).json({ error: err?.message ?? 'Server error' })
  }
}
