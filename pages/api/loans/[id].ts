import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (req.method === 'GET') {
    const app = await prisma.loanApplication.findUnique({ where: { id: String(id) }, include: { product: true, createdByUser: true } })
    if (!app) return res.status(404).json({ error: 'Not found' })
    return res.status(200).json(app)
  }
  res.status(405).end()
}
