// pages/test-email.tsx
import { useState } from 'react'

export default function TestEmail() {
  const [email, setEmail] = useState('tester@example.com')
  const [name, setName] = useState('Test User')
  const [role, setRole] = useState('Family')
  const [org, setOrg] = useState('')
  const [out, setOut] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function call(path: string, payload?: any) {
    setLoading(true)
    setOut(null)
    try {
      const res = await fetch(path, {
        method: payload ? 'POST' : 'GET',
        headers: payload ? { 'Content-Type': 'application/json' } : undefined,
        body: payload ? JSON.stringify(payload) : undefined,
      })
      const text = await res.text()
      try {
        setOut({ ok: res.ok, status: res.status, json: JSON.parse(text) })
      } catch {
        setOut({ ok: res.ok, status: res.status, text })
      }
    } catch (e: any) {
      setOut({ ok: false, error: e?.message || String(e) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 16, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Email Debug & Test Page</h1>
      <p style={{ color: '#475569', marginBottom: 16 }}>
        Use this to debug SMTP on Vercel. It calls your live API with <code>?debug=1</code> so it returns JSON instead of redirecting.
      </p>

      <section style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>1) Verify SMTP credentials</h2>
        <button
          onClick={() => call('/api/smtp-verify')}
          disabled={loading}
          style={{ padding: '10px 14px', borderRadius: 8, background: '#0369a1', color: 'white', border: 0 }}
        >
          {loading ? 'Verifying…' : 'Run /api/smtp-verify'}
        </button>
      </section>

      <section style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>2) Send subscribe (debug)</h2>
        <div style={{ display: 'grid', gap: 8 }}>
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }} />
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }} />
          <input placeholder="Role" value={role} onChange={e=>setRole(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }} />
          <input placeholder="Organisation (optional)" value={org} onChange={e=>setOrg(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button
            onClick={() => call('/api/subscribe?debug=1', { name, email, role, org })}
            disabled={loading}
            style={{ padding: '10px 14px', borderRadius: 8, background: '#0ea5e9', color: 'white', border: 0 }}
          >
            {loading ? 'Submitting…' : 'POST /api/subscribe?debug=1'}
          </button>
          <button
            onClick={() => call('/api/confirm?token=INVALID&debug=1')}
            disabled={loading}
            style={{ padding: '10px 14px', borderRadius: 8, background: '#ef4444', color: 'white', border: 0 }}
          >
            {loading ? 'Testing…' : 'GET /api/confirm?token=INVALID&debug=1'}
          </button>
        </div>
      </section>

      <section style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Response</h2>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#0b1220', color: '#e2e8f0', padding: 12, borderRadius: 8, maxHeight: 420, overflow: 'auto' }}>
{JSON.stringify(out, null, 2)}
        </pre>
      </section>
    </main>
  )
}
