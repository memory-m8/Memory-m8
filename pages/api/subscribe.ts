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
    secure: String(process.env.SMTP_SECURE) === 'true',
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
  try { fs.writeFileSync(TOKENS_FILE, JSON.stringify(obj, null, 2)) } catch {}
}

/** ---- Config ---- */
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000'
const FROM_UPDATES = process.env.MAIL_FROM_UPDATES || `Memory M8 <${process.env.SMTP_USER}>`
const TO_JOIN = process.env.MAIL_TO_JOIN || 'join@memorym8.com'
const LOGO_PATH = path.join(process.cwd(), 'public', 'logo-email.png')

/** Make GETs friendly: just redirect back home */
function redirectHome(res: NextApiResponse, tag = '1') {
  res.writeHead(303, { Location: `/?subscribed=${tag}` })
  res.end()
}

export const config = {
  api: { bodyParser: { sizeLimit: '1mb' } },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Graceful handling for GET (people browsing directly to /api/subscribe)
  if (req.method === 'GET') {
    return redirectHome(res, '0') // ?subscribed=0 means “noop redirect”
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, GET')
    return res.status(405).end('Method Not Allowed')
  }

  try {
    // Accept form-urlencoded OR JSON
    let body: any = req.body
    const ctype = (req.headers['content-type'] || '').toLowerCase()
    if (typeof body === 'string') {
      // JSON string body (rare with browsers)
      try { body = JSON.parse(body) } catch {/* ignore */}
    }
    if (ctype.includes('application/x-www-form-urlencoded') && typeof body === 'object') {
      // Next already parsed it to an object; nothing to do
    }

    const { name = '', email = '', role = '', org = '' } = body || {}
    if (!email) {
      // For forms, bounce back to the page rather than showing JSON
      if ((req.headers.accept || '').includes('text/html')) return redirectHome(res, 'missing_email')
      return res.status(400).json({ error: 'Email required' })
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
    const tmpl = fs.existsSync(tmplPath) ? fs.readFileSync(tmplPath, 'utf8') : `
      <p>Hello {{name}},</p>
      <p>Please confirm your Memory M8 subscription:</p>
      <p><a href="{{confirmUrl}}">Confirm subscription</a></p>
      <p>Thank you.</p>
      <img src="cid:mm8logo" alt="Memory M8" />
    `
    const html = tmpl.replace(/{{name}}/g, name || '').replace(/{{confirmUrl}}/g, confirmUrl)

    await transporter.sendMail({
      from: FROM_UPDATES,
      to: email,
      subject: 'Please confirm your Memory M8 subscription',
      html,
      attachments: [{ filename: 'logo-email.png', path: LOGO_PATH, cid: 'mm8logo' }],
    })

    // Browser submits get a clean redirect back to home with banner
    const acceptsHTML = (req.headers.accept || '').includes('text/html')
    const isFormPost = (req.headers['content-type'] || '').includes('application/x-www-form-urlencoded')
    if (acceptsHTML || isFormPost) return redirectHome(res, '1')

    // API clients get JSON
    return res.status(200).json({ ok: true })
  } catch (err: any) {
    console.error('subscribe error', err)
    // For browsers, go back with failure flag so user isn’t stuck on an error page
    const acceptsHTML = (req.headers.accept || '').includes('text/html')
    if (acceptsHTML) return redirectHome(res, 'error')
    return res.status(500).json({ error: 'Internal error' })
  }
}
