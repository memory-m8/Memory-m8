// pages/api/smtp-verify.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE) === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: process.env.NODE_ENV !== 'production' ? { rejectUnauthorized: false } : undefined,
    })

    const canVerify = typeof (transporter as any).verify === 'function'
    const verifyResult = canVerify ? await transporter.verify() : 'verify() not supported by this transport'

    res.status(200).json({
      ok: true,
      verifyResult,
      env: {
        SMTP_HOST: process.env.SMTP_HOST || '(missing)',
        SMTP_PORT: process.env.SMTP_PORT || '(missing)',
        SMTP_SECURE: process.env.SMTP_SECURE || '(missing)',
        SMTP_USER: process.env.SMTP_USER ? '(set)' : '(missing)',
        SMTP_PASS: process.env.SMTP_PASS ? '(set)' : '(missing)',
        MAIL_FROM_UPDATES: process.env.MAIL_FROM_UPDATES || '(fallback to SMTP_USER)',
        MAIL_TO_JOIN: process.env.MAIL_TO_JOIN || '(default join@memorym8.com)',
        SITE_URL: process.env.SITE_URL || '(missing)',
      },
    })
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || String(err) })
  }
}
