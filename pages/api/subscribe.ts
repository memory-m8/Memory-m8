import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

/** ---- Mailer (dev-safe TLS; strict in prod) ---- */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE) === 'true', // true: 465 SSL, false: 587 STARTTLS
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: process.env.NODE_ENV !== 'production' ? { rejectUnauthorized: false } : undefined,
  })
}
const transporter = createTransporter()

/** ---- Simple token store for double opt-in (local/dev) ---- */
const TOKENS_FILE = path.join(process.cwd(), 'tokens.json')
function loadTokens(): Record<string, { email: string; name?: string }> {
  try { return JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8')) } catch { return {} }
}
function saveTokens(obj: Record<string, { email: string; name?: string }>) {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(obj, null, 2))
}

/** ---- Config ---- */
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000'
const FROM_UPDATES = process.env.MAIL_FROM_UPDATES || `Memory M8 <${process.env.SMTP_USER}>`
const TO_JOIN = process.env.MAIL_TO_JOIN || 'join@memorym8.com'
const LOGO_PATH = path.join(process.cwd(), 'public', 'logo-email.png')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }

  // Accept JSON or form-encoded bodies
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body
  const { name, email, role, org } = body || {}

  if (!email) {
    res.status(400).json({ error: 'Email required' })
    return
  }

  // Create + persist token
  const token = crypto.randomBytes(32).toString('hex')
  const confirmUrl = `${SITE_URL}/api/confirm?token=${token}`
  const tokens = loadTokens()
  tokens[token] = { email, name }
  saveTokens(tokens)

  // Internal notification
  await transporter.sendMail({
    from: FROM_UPDATES,
    to: TO_JOIN,
    subject: `New sign-up: ${email}`,
    text: `${name || 'Someone'} signed up${role ? ` as ${role}` : ''}${org ? ` (${org})` : ''}`,
  })

  // Confirmation email (CID logo)
  const tmplPath = path.join(process.cwd(), 'templates', 'confirm.html')
  const tmpl = fs.readFileSync(tmplPath, 'utf8')
  const html = tmpl.replace(/{{name}}/g, name || '').replace(/{{confirmUrl}}/g, confirmUrl)

  await transporter.sendMail({
    from: FROM_UPDATES,
    to: email,
    subject: 'Please confirm your Memory M8 subscription',
    html,
    attachments: [
      { filename: 'logo-email.png', path: LOGO_PATH, cid: 'mm8logo' }, // src="cid:mm8logo"
    ],
  })

  // Redirect browsers back to home with success banner; JSON for API callers
  const acceptsHTML = (req.headers.accept || '').includes('text/html')
  const isFormPost = (req.headers['content-type'] || '').includes('application/x-www-form-urlencoded')
  if (acceptsHTML || isFormPost) {
    res.redirect(303, '/?subscribed=1')
    return
  }

  res.status(200).json({ ok: true })
}
