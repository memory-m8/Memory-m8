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
  try {
    const token = String(req.query.token || '')
    if (!token) return redirect(res, 'confirm_error')
    const { email } = verifyToken(token)
    console.log('Confirmed:', email)
    return redirect(res, 'confirmed')
  } catch (err) {
    console.error('confirm error', err)
    return redirect(res, 'confirm_error')
  }
}
