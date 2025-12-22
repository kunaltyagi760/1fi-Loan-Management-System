import { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from './jwt'

export function requireAuth(handler: (req: NextApiRequest, res: NextApiResponse, user: any) => Promise<any>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const auth = req.headers.authorization
    if (!auth) return res.status(401).json({ error: 'Missing auth' })
    const parts = auth.split(' ')
    if (parts.length !== 2) return res.status(401).json({ error: 'Bad auth header' })
    const token = parts[1]
    const payload = verifyToken(token)
    if (!payload) return res.status(401).json({ error: 'Invalid token' })
    return handler(req, res, payload)
  }
}

export function getUserFromReq(req: NextApiRequest) {
  const auth = req.headers.authorization
  if (!auth) return null
  const parts = auth.split(' ')
  if (parts.length !== 2) return null
  const token = parts[1]
  const payload = verifyToken(token)
  return payload
}
