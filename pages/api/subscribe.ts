import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

/** ---------- Mailer ---------- */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE) === 'true', // true: 465, false: 587
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: process.env.NODE_ENV !== 'production' ? { rejectUnauthorized: false } : undefined,
  })
}
const transporter = createTransporter()

/** ---------- Config ---------- */
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000'
const FROM_UPDATES = process.env.MAIL_FROM_UPDATES || `Memory M8 <${process.env.SMTP_USER}>`
const TO_JOIN = process.env.MAIL_TO_JOIN || 'join@memorym8.com'
const SIGNING_SECRET = process.env.SIGNING_SECRET || 'dev-secret'
const LOGO_PATH = path.join(process.cwd(), 'public', 'logo-email.png')

/** ---------- Tiny signed token (JWT-ish, no persistence) ---------- */
function base64url(i: Buffer | string) {
  return Buffer.from(i).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}
function signToken(payload: Record<string, any>) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64url(JSON.stringify(payload))
  const sig = crypto.createHmac('sha256', SIGNING_SECRET).update(`${header}.${body}`).digest('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
  return `${header}.${body}.${sig}`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).send('Method Not Allowed')
  }

  // Next parses urlencoded/JSON into an object already
  const { name, email, role, org } = (req.body || {}) as {
    name?: string; email?: string; role?: string; org?: string
  }

  if (!email) return res.status(400).json({ error: 'Email required' })

  // Create a 48h token without writing to disk
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 48
  const token = signToken({ email, name, exp })
  const confirmUrl = `${SITE_URL}/api/confirm?token=${encodeURIComponent(token)}`

  // Internal heads-up
  try {
    await transporter.sendMail({
      from: FROM_UPDATES,
      to: TO_JOIN,
      subject: `New sign-up: ${email}`,
      text: `${name || 'Someone'} signed up${role ? ` as ${role}` : ''}${org ? ` (${org})` : ''}`,
    })
  } catch (_) { /* non-blocking */ }

  // Confirmation email (CID logo supported)
  const tmplPath = path.join(process.cwd(), 'templates', 'confirm.html')
  const tmpl = fs.existsSync(tmplPath)
    ? fs.readFileSync(tmplPath, 'utf8')
    : `<p>Hello{{name}},</p><p>Please confirm your subscription:</p><p><a href="{{confirmUrl}}">Confirm</a></p>`
  const html = tmpl.replace(/{{name}}/g, name ? ` ${name}` : '').replace(/{{confirmUrl}}/g, confirmUrl)

  await transporter.sendMail({
    from: FROM_UPDATES,
    to: email,
    subject: 'Please confirm your Memory M8 subscription',
    html,
    attachments: fs.existsSync(LOGO_PATH) ? [{ filename: 'logo-email.png', path: LOGO_PATH, cid: 'mm8logo' }] : [],
  })

  // Redirect human users; JSON for API callers
  const acceptsHTML = (req.headers.accept || '').includes('text/html')
  const isFormPost = (req.headers['content-type'] || '').includes('application/x-www-form-urlencoded')
  if (acceptsHTML || isFormPost) {
    return res.redirect(303, '/?subscribed=1')
  }
  return res.status(200).json({ ok: true })
}
