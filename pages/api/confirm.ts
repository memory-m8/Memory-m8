import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

const SITE_URL = (process.env.SITE_URL || 'https://www.memorym8.com').replace(/\/+$/, '')
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'dev-secret-change-me'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const debug = 'debug' in req.query
  const tokenRaw = String(req.query.token || '')
  const token = tokenRaw.trim().replace(/\s+/g, '') // defend against stray spaces/newlines

  if (!token) {
    if (debug) return res.status(400).json({ ok: false, error: 'Missing token' })
    return res.redirect(303, '/?confirm=missing')
  }

  try {
    const payload = jwt.verify(token, TOKEN_SECRET) as {
      email: string
      name?: string
      iat: number
      exp: number
    }

    // TODO: persist confirmation if you want (e.g., to a list/CRM).

    if (debug) return res.status(200).json({ ok: true, verifyResult: true, payload, SITE_URL })
    return res.redirect(303, '/?confirmed=1')
  } catch (err: any) {
    if (debug) return res.status(400).json({ ok: false, error: String(err?.message || err) })
    return res.redirect(303, '/?confirm=bad')
  }
}
