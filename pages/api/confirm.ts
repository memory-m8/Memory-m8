import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

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

const TOKENS_FILE = path.join(process.cwd(), 'tokens.json')
const FROM_UPDATES = process.env.MAIL_FROM_UPDATES || `Memory M8 <${process.env.SMTP_USER}>`
const LOGO_PATH = path.join(process.cwd(), 'public', 'logo-email.png')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = String(req.query.token || '')
  if (!token) {
    res.status(400).send('Missing token')
    return
  }

  // Validate + consume token
  let email = ''
  let name = ''
  try {
    const data = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'))
    if (!data[token]) {
      res.status(400).send('Invalid or expired token')
      return
    }
    email = data[token].email
    name = data[token].name || ''
    delete data[token]
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(data, null, 2))
  } catch {
    res.status(400).send('Invalid or expired token')
    return
  }

  // Send Welcome (CID logo)
  const tmplPath = path.join(process.cwd(), 'templates', 'welcome.html')
  const tmpl = fs.readFileSync(tmplPath, 'utf8')
  const html = tmpl.replace(/{{name}}/g, name || '')

  await transporter.sendMail({
    from: FROM_UPDATES,
    to: email,
    subject: 'Welcome to Memory M8 updates',
    html,
    attachments: [
      { filename: 'logo-email.png', path: LOGO_PATH, cid: 'mm8logo' },
    ],
  })

  res.send('<h1>Subscription confirmed</h1><p>Thanks for joining Memory M8!</p>')
}
