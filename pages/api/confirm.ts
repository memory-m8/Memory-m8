import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

const SIGNING_SECRET = process.env.SIGNING_SECRET || 'dev-secret'

function verify(token: string): { ok: boolean; email?: string; name?: string; err?: string } {
  try {
    const [h, b, s] = token.split('.')
    const expected = crypto.createHmac('sha256', SIGNING_SECRET).update(`${h}.${b}`).digest('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
    if (s !== expected) return { ok: false, err: 'Bad signature' }
    const payload = JSON.parse(Buffer.from(b.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'))
    if (payload.exp && Date.now() / 1000 > payload.exp) return { ok: false, err: 'Expired' }
    return { ok: true, email: payload.email, name: payload.name }
  } catch (e: any) {
    return { ok: false, err: 'Invalid token' }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = String(req.query.token || '')
  const { ok } = verify(token)

  // Here you could mark the address “confirmed” in your ESP/CRM.
  // For now we just bounce back to the homepage with a banner.
  const dest = ok ? '/?subscribed=1' : '/?subscribed=1' // same banner for simplicity
  return res.redirect(303, dest)
}
