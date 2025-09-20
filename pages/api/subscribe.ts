import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'

/** ---- Config ---- */
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000'
const FROM_UPDATES =
  process.env.MAIL_FROM_UPDATES || `Memory M8 <${process.env.SMTP_USER}>`
const TO_JOIN = process.env.MAIL_TO_JOIN || 'join@memorym8.com'
const LOGO_PATH = path.join(process.cwd(), 'public', 'logo-email.png')
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'dev-secret-change-me'
const TOKEN_TTL_SECONDS = Number(process.env.TOKEN_TTL_SECONDS || 60 * 60 * 48) // 48h

/** ---- Helpers ---- */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE) === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: process.env.NODE_ENV !== 'production' ? { rejectUnauthorized: false } : undefined,
  })
}
const transporter = createTransporter()

function b64url(buf: Buffer) {
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}
function signToken(email: string, name: string) {
  const header = b64url(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })))
  const payload = b64url(
    Buffer.from(
      JSON.stringify({
        email,
        name,
        exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
      })
    )
  )
  const toSign = `${header}.${payload}`
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(toSign).digest()
  return `${toSign}.${b64url(sig)}`
}

function redirect(res: NextApiResponse, key: string) {
  res.writeHead(303, { Location: `/?${key}=1` })
  res.end()
}

/** ---- API Handler ---- */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  const debug = req.query.debug === '1' || req.headers['x-debug'] === '1'

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body
    const { name = '', email = '', role = '', org = '' } = body || {}
    if (!email) {
      return debug
        ? res.status(400).json({ ok: false, error: 'Email required' })
        : redirect(res, 'missing_email')
    }

    // Build token & confirm URL
    const token = signToken(email, name)
    const confirmUrl = `${SITE_URL}/api/confirm?token=${encodeURIComponent(token)}`

    // Internal notification
    let internalInfo: any = null
    try {
      internalInfo = await transporter.sendMail({
        from: FROM_UPDATES,
        to: TO_JOIN,
        subject: `New sign-up: ${email}`,
        text: `${name || 'Someone'} signed up${role ? ` as ${role}` : ''}${org ? ` (${org})` : ''}`,
      })
    } catch (e: any) {
      if (debug) return res.status(500).json({ ok: false, stage: 'internal_notify', error: e?.message || String(e) })
      throw e
    }

    // Template (fallback inline)
    const tmplPath = path.join(process.cwd(), 'templates', 'confirm.html')
    const baseHtml = fs.existsSync(tmplPath)
      ? fs.readFileSync(tmplPath, 'utf8')
      : `<p>Hello {{name}},</p><p>Please confirm your subscription:</p><p><a href="{{confirmUrl}}">Confirm</a></p>`

    const html = baseHtml
      .replace(/{{name}}/g, name || '')
      .replace(/{{confirmUrl}}/g, confirmUrl)

    // Confirmation email to user
    let userInfo: any = null
    try {
      userInfo = await transporter.sendMail({
        from: FROM_UPDATES,
        to: email,
        subject: 'Please confirm your Memory M8 subscription',
        html,
        attachments: [{ filename: 'logo-email.png', path: LOGO_PATH, cid: 'mm8logo' }],
      })
    } catch (e: any) {
      if (debug) return res.status(500).json({ ok: false, stage: 'user_mail', error: e?.message || String(e) })
      throw e
    }

    if (debug) {
      return res.status(200).json({
        ok: true,
        confirmUrl,
        internalInfo,
        userInfo,
      })
    }

    return redirect(res, 'subscribed')
  } catch (err: any) {
    if (debug) return res.status(500).json({ ok: false, error: err?.message || String(err) })
    console.error('subscribe error', err)
    return redirect(res, 'email_failed')
  }
}
