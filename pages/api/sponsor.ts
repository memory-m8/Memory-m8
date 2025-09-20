import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'
import path from 'path'
import fs from 'fs'

/** ---- Mailer (dev-safe TLS; strict in prod) ---- */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE) === 'true', // true: 465, false: 587
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  tls: process.env.NODE_ENV !== 'production' ? { rejectUnauthorized: false } : undefined,
})

/** ---- Config ---- */
const FROM_SPONSOR = process.env.FROM_SPONSOR || 'Memory M8 Sponsorship <sponsor@memorym8.com>'
const TO_SPONSOR = process.env.SPONSOR_OPS || 'sponsor@memorym8.com'
const LOGO_PATH = path.join(process.cwd(), 'public', 'logo-email.png')

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
  const { amount = '', email = '', message = '' } = body || {}

  const numeric = Number(amount)
  if (!email || Number.isNaN(numeric)) {
    return res.status(400).json({ ok: false, error: 'Email and valid amount required' })
  }

  const num = Math.max(0, numeric)
  // ~£1/day heuristic (29.99/month ≈ 1/day)
  const days = Math.round(num / (29.99 / 30))

  // Notify ops
  await transporter.sendMail({
    from: FROM_SPONSOR,
    to: TO_SPONSOR,
    subject: `New sponsorship pledge: £${num}`,
    text: `Donor: ${email}\nMessage: ${message || '—'}\nAmount: £${num}\nEst. days of reassurance: ${days}`,
  })

  // Thank the donor (template + inline logo if present)
  const tmplPath = path.join(process.cwd(), 'templates', 'sponsor.html')
  const tmpl = fs.existsSync(tmplPath)
    ? fs.readFileSync(tmplPath, 'utf8')
    : `<!doctype html><meta charset="utf-8"><div style="font-family:system-ui,Segoe UI,Arial">
         <h2>Thank you for your sponsorship pledge</h2>
         <p>Your pledge of <strong>£{{amount}}</strong> helps us deliver calm, dignified reassurance.</p>
         <p>That’s around <strong>{{days}}</strong> days of access for someone who needs it most.</p>
       </div>`

  const html = tmpl
    .replace(/{{\s*amount\s*}}/g, String(num))
    .replace(/{{\s*days\s*}}/g, String(days))

  await transporter.sendMail({
    from: FROM_SPONSOR,
    to: email,
    subject: 'Thank you for your sponsorship pledge',
    html,
    attachments: fs.existsSync(LOGO_PATH) ? [{ filename: 'logo-email.png', path: LOGO_PATH, cid: 'mm8logo' }] : [],
  })

  const acceptsHTML = (req.headers.accept || '').includes('text/html')
  if (acceptsHTML) return res.redirect(303, `/?pledged=1&amount=${encodeURIComponent(String(num))}`)
  return res.status(200).json({ ok: true })
}
