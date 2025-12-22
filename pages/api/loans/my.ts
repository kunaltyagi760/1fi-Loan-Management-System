import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { requireAuth } from '../../../utils/auth'

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  if (req.method !== 'GET') return res.status(405).end()

  const apps = await prisma.loanApplication.findMany({ where: { createdBy: user.sub }, include: { product: true } })
  return res.status(200).json({ applications: apps })
}

export default requireAuth(handler)
