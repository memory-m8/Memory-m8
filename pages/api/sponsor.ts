import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'
import path from 'path'
import fs from 'fs'

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

/** ---- Config ---- */
const FROM_SPONSOR = process.env.MAIL_FROM_SPONSOR || 'Memory M8 Sponsorship <sponsor@memorym8.com>'
const TO_SPONSOR = process.env.MAIL_TO_SPONSOR || 'sponsor@memorym8.com'
const LOGO_PATH = path.join(process.cwd(), 'public', 'logo-email.png')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }

  // Accept JSON or form-encoded bodies
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body
  const { amount, email, message } = body || {}

  if (!email || amount == null) {
    res.status(400).json({ error: 'Email and amount required' })
    return
  }

  const num = Math.max(0, Number(amount) || 0)
  // ~£1/day heuristic (29.99/month ≈ 1/day)
  const days = Math.round(num / (29.99 / 30))

  // Internal notification
  await transporter.sendMail({
    from: FROM_SPONSOR,
    to: TO_SPONSOR,
    subject: `New sponsorship pledge: £${num}`,
    text: `Donor: ${email}\nMessage: ${message || '—'}\nAmount: £${num}\nEst. days of reassurance: ${days}`,
  })

  // Donor acknowledgement (CID logo)
  const tmpl = fs.readFileSync(path.join(process.cwd(), 'templates', 'sponsor.html'), 'utf8')
  const html = tmpl.replace(/{{amount}}/g, String(num)).replace(/{{days}}/g, String(days))

  await transporter.sendMail({
    from: FROM_SPONSOR,
    to: email,
    subject: 'Thank you for your sponsorship pledge',
    html,
    attachments: [
      { filename: 'logo-email.png', path: LOGO_PATH, cid: 'mm8logo' }, // src="cid:mm8logo"
    ],
  })

  // Redirect browsers back to home with success banner; JSON for API callers
  const acceptsHTML = (req.headers.accept || '').includes('text/html')
  const isFormPost = (req.headers['content-type'] || '').includes('application/x-www-form-urlencoded')
  if (acceptsHTML || isFormPost) {
    const amountParam = encodeURIComponent(String(num))
    res.redirect(303, `/?pledged=1&amount=${amountParam}`)
    return
  }

  res.status(200).json({ ok: true })
}
