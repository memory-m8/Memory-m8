import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'dev-secret-change-me'

function b64urlDecode(s: string) {
  s = s.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  return Buffer.from(s, 'base64').toString('utf8')
}
function verifyToken(token: string) {
  const [h, p, s] = token.split('.')
  if (!h || !p || !s) throw new Error('Bad token')
  const calc = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(`${h}.${p}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
  if (calc !== s) throw new Error('Bad signature')
  const payload = JSON.parse(b64urlDecode(p))
  if (payload.exp && Date.now() / 1000 > payload.exp) throw new Error('Expired')
  return payload as { email: string; name?: string }
}
function redirect(res: NextApiResponse, key: string) {
  res.writeHead(303, { Location: `/?${key}=1` })
  res.end()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const debug = req.query.debug === '1' || req.headers['x-debug'] === '1'
  try {
    const token = String(req.query.token || '')
    if (!token) {
      return debug ? res.status(400).json({ ok: false, error: 'Missing token' }) : redirect(res, 'confirm_error')
    }
    const payload = verifyToken(token)
    if (debug) return res.status(200).json({ ok: true, payload })
    return redirect(res, 'confirmed')
  } catch (err: any) {
    if (debug) return res.status(400).json({ ok: false, error: err?.message || String(err) })
    console.error('confirm error', err)
    return redirect(res, 'confirm_error')
  }
}
