import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { requireAuth } from '../../../utils/auth'

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  const found = await prisma.user.findUnique({ where: { id: user.sub } })
  if (!found) return res.status(404).json({ error: 'User not found' })
  return res.status(200).json({ user: { id: found.id, email: found.email, name: found.name } })
}

export default requireAuth(handler)
