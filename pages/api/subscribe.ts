import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import path from 'path'
import fs from 'fs'

/** ---------- config ---------- */
const SITE_URL = (process.env.SITE_URL || 'https://www.memorym8.com').replace(/\/+$/, '')
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'dev-secret-change-me'
const FROM_UPDATES = process.env.FROM_UPDATES || process.env.SMTP_USER || 'noreply@memorym8.com'
const TO_JOIN = process.env.JOIN_OPS || 'join@memorym8.com'

/** ---------- mailer ---------- */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE) === 'true', // true: 465, false: 587
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  tls: process.env.NODE_ENV !== 'production' ? { rejectUnauthorized: false } : undefined,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  // Accept JSON or x-www-form-urlencoded
  const body =
    typeof req.body === 'string'
      ? Object.fromEntries(new URLSearchParams(req.body))
      : (req.body as Record<string, string>)
  const { name = '', email = '', role = '', org = '' } = body || {}
  const debug = 'debug' in req.query

  if (!email) return res.status(400).json({ ok: false, error: 'Email required' })

  // Issue a short-lived JWT (no server storage needed)
  const token = jwt.sign({ email, name }, TOKEN_SECRET, { expiresIn: '24h' })
  const confirmUrl = `${SITE_URL}/api/confirm?token=${encodeURIComponent(token)}`

  // Internal heads-up
  const internalInfo = await transporter.sendMail({
    from: FROM_UPDATES,
    to: TO_JOIN,
    subject: `New sign-up: ${email}`,
    text: `${name || 'Someone'} signed up${role ? ` as ${role}` : ''}${org ? ` (${org})` : ''}`,
  })

  // User confirmation email (template + inline logo if present)
  const logoPath = path.join(process.cwd(), 'public', 'logo-email.png')
  const tmplPath = path.join(process.cwd(), 'templates', 'confirm.html')
  const tmpl = fs.existsSync(tmplPath)
    ? fs.readFileSync(tmplPath, 'utf8')
    : `<!doctype html><meta charset="utf-8"><div style="font-family:system-ui,Segoe UI,Arial">
         <h2>Confirm your subscription</h2>
         <p>Hello {{name}}, thanks for signing up for Memory M8 updates.</p>
         <p><a href="{{confirmUrl}}">Confirm my subscription</a></p>
       </div>`

  const html = tmpl
    .replace(/{{\s*name\s*}}/g, name || 'there')
    .replace(/{{\s*confirmUrl\s*}}/g, confirmUrl)

  const userInfo = await transporter.sendMail({
    from: FROM_UPDATES,
    to: email,
    subject: 'Please confirm your Memory M8 subscription',
    html,
    attachments: fs.existsSync(logoPath) ? [{ filename: 'logo-email.png', path: logoPath, cid: 'mm8logo' }] : [],
  })

  if (debug) {
    return res.status(200).json({
      ok: true,
      confirmUrl,
      internalInfo: {
        accepted: internalInfo.accepted,
        rejected: internalInfo.rejected,
        response: internalInfo.response,
        messageId: internalInfo.messageId,
      },
      userInfo: {
        accepted: userInfo.accepted,
        rejected: userInfo.rejected,
        response: userInfo.response,
        messageId: userInfo.messageId,
      },
      envCheck: { SITE_URL, FROM_UPDATES, TOKEN_SECRET_len: TOKEN_SECRET.length },
    })
  }

  const acceptsHTML = (req.headers.accept || '').includes('text/html')
  if (acceptsHTML) return res.redirect(303, '/?subscribed=1')
  return res.status(200).json({ ok: true })
}
