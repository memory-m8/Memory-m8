// pages/index.tsx (Next.js 13/14 + Tailwind)
// Memory M8 — medical-style landing page
// SSR favicon fix: add <link rel="icon"> client-side only.

import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='28' fill='%230077b6'/%3E%3Cpath d='M20 32c0-6 5-11 12-11s12 5 12 11-5 11-12 11-12-5-12-11z' fill='%23A7D7CF'/%3E%3Ctext x='32' y='42' text-anchor='middle' font-size='18' font-family='Arial,Helvetica,sans-serif' fill='%230E5A6B'%3EM8%3C/text%3E%3C/svg%3E"

function FaviconManager({ href = DATA_URI }: { href?: string }) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    const head = document.head
    head.querySelectorAll("link[rel='icon']").forEach(n => n.parentNode?.removeChild(n))
    const link = document.createElement('link')
    link.setAttribute('rel', 'icon')
    link.setAttribute('href', href)
    head.appendChild(link)
  }, [href])
  return null
}

export default function Home() {
  const router = useRouter()

  // Flash banner from redirects (/?subscribed=1 etc.)
  const [flash, setFlash] = useState<'subscribed' | 'pledged' | null>(null)
  useEffect(() => {
    if (!router.isReady) return
    const { subscribed, pledged } = router.query
    if (subscribed === '1') setFlash('subscribed')
    else if (pledged === '1') setFlash('pledged')
  }, [router.isReady, router.query])

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Memory M8 — Companionship, Dignity & Support</title>
        <meta
          name="description"
          content="AI-powered reassurance for families, care homes and hospital wards. Multilingual, dignity-first, nurse prioritisation, and zero-knowledge patient privacy."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* no <link rel="icon"> here (SSR fix) */}
        <meta property="og:title" content="Memory M8 — Companionship, Dignity & Support" />
        <meta property="og:description" content="AI-powered reassurance for families, care homes and hospital wards." />
        <meta property="og:image" content="/og-memory-m8.jpg" />
        <meta property="og:url" content="https://memorym8.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Memory_M8" />
        <meta name="theme-color" content="#0077b6" />
      </Head>

      <FaviconManager />

      {/* Announcement bar */}
      <div className="bg-sky-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 text-sm text-center">
          <strong>Beta testing</strong> starts next week — join the waitlist below.
          <span className="inline-flex items-center gap-2 ml-3 align-middle">
            <img src="/google-play-badge.png" alt="Google Play" className="h-5" />
            <span className="opacity-90">Coming soon to Google Play</span>
          </span>
        </div>
      </div>

      {/* Flash (subscribe / sponsor-notify) */}
      {flash && (
        <div className="bg-emerald-50 border-b border-emerald-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-start justify-between gap-4">
            <p className="text-sm text-emerald-900">
              {flash === 'subscribed' &&
                'Thanks! Please check your email and click the confirmation link to complete your subscription.'}
              {flash === 'pledged' && 'Thank you — we’ll notify you as soon as sponsoring is available.'}
            </p>
            <button onClick={() => setFlash(null)} className="text-emerald-900/70 hover:text-emerald-900 text-sm">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <img src="/logo-memorym8.png" alt="Memory M8" className="h-8 w-auto" />
            <span className="sr-only">Memory M8</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-700">
            <a href="#families" className="hover:text-slate-900">For Families</a>
            <a href="#care" className="hover:text-slate-900">For Care Homes</a>
            <a href="#hospitals" className="hover:text-slate-900">For Hospitals</a>
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#faq" className="hover:text-slate-900">Q&amp;A</a>
            <a href="#sponsor" className="hover:text-slate-900">Sponsor a Patient</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#signup" className="hidden sm:inline-flex items-center rounded-xl bg-sky-600 px-4 py-2 text-white text-sm font-medium hover:bg-sky-700 shadow">
              Get Updates
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid lg:grid-cols-2 items-center gap-10">
              <div>
                <div className="flex items-center gap-4">
                  <img src="/logo-memorym8.png" alt="Memory M8 logo" className="h-12 w-12" />
                  <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
                    Welcome to Memory M8
                  </h1>
                </div>
                <p className="mt-5 text-lg text-slate-700">Companionship, Dignity &amp; Support — Powered by AI.</p>
                <p className="mt-4 text-slate-600">
                  Memory M8 reassures families, supports carers, and prioritises nurse attention for those living with memory loss.
                  Multilingual, dignity-first, and privacy by design. <strong>All patient-side features are zero-knowledge by default.</strong>
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a href="#signup" className="inline-flex items-center rounded-xl bg-sky-600 px-5 py-3 text-white font-medium hover:bg-sky-700 shadow">
                    Sign up for updates
                  </a>
                  <a href="#features" className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-slate-700 font-medium hover:bg-slate-50">
                    Explore features
                  </a>
                </div>
                <div className="mt-6 flex items-center gap-3 text-xs text-slate-600">
                  <span className="px-3 py-1 rounded-full bg-white border">GDPR</span>
                  <span className="px-3 py-1 rounded-full bg-white border">ICO</span>
                  <span className="px-3 py-1 rounded-full bg-white border">Zero-knowledge by default</span>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/3] w-full rounded-2xl bg-slate-200 shadow-inner overflow-hidden">
                  <img src="/hero.jpg" alt="Memory M8 companion and carer app screens" className="h-full w-full object-cover" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow p-4 w-64">
                  <p className="text-sm text-slate-700">“I can focus at work without worrying. If Mum needs reassurance, I get a gentle prompt and can send a quick voice note.”</p>
                  <p className="mt-2 text-xs text-slate-500">— Sarah, Family Carer</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it helps — VERTICALLY STACKED & LARGE */}
        <section id="families" className="py-20 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold text-slate-900">How Memory M8 helps</h2>
            <p className="mt-3 text-slate-600">
              Designed with families, care homes and hospitals in mind — simple, human, and clinically thoughtful.
            </p>

            <div className="mt-10 space-y-10">
              <article className="rounded-2xl border p-6 bg-white" id="families-card">
                <div className="aspect-[16/9] rounded-xl bg-slate-100 overflow-hidden mb-5">
                  <img src="/families.jpg" alt="Reassurance at home with subtle phone prompt and TV reminder" className="h-full w-full object-cover" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">For Families</h3>
                <p className="mt-3 text-slate-600 text-lg">
                  Check a loved one’s mood at a glance and use <strong>Whisper Mode</strong> for calm cues that don’t startle.
                  The companion keeps conversation familiar by drawing on favourite topics, photos and memories.
                  Over time it learns what settles anxiety, reminds about TV/radio at the right moment,
                  switches to the correct channel at 7:30pm, and can dim lights for bedtime.
                </p>
              </article>

              <article className="rounded-2xl border p-6 bg-white" id="care">
                <div className="aspect-[16/9] rounded-xl bg-slate-100 overflow-hidden mb-5">
                  <img src="/care-homes.jpg" alt="Care home dashboard highlighting residents who need attention" className="h-full w-full object-cover" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">For Care Homes</h3>
                <p className="mt-3 text-slate-600 text-lg">
                  Resident wellbeing dashboards surface who needs attention first, reducing anxiety-driven callouts so staff can focus
                  where it matters most. Alerts flag when reassurance or intervention is needed — in a room or during activities —
                  balancing compassionate human care with real-time AI support that preserves dignity and reduces disruption.
                </p>
              </article>

              <article className="rounded-2xl border p-6 bg-white" id="hospitals">
                <div className="aspect-[16/9] rounded-xl bg-slate-100 overflow-hidden mb-5">
                  <img src="/hospital-wards.jpg" alt="Nurse station ward view with prioritised patient alerts and multilingual reassurance" className="h-full w-full object-cover" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">For Hospital Wards</h3>
                <p className="mt-3 text-slate-600 text-lg">
                  Real-time ward views flag mood change, confusion or distress. Nurse prioritisation directs attention to patients who need it most,
                  supporting efficient, compassionate care. Multilingual reassurance helps overcome language barriers and delivers calm,
                  personalised messages that keep patients grounded in busy clinical environments.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 bg-sky-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold text-slate-900">Key features</h2>
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <div key={f.title} className="rounded-2xl border bg-white p-6">
                  <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-2 text-slate-600">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsor notify-only (no amounts yet) */}
        <section id="sponsor" className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-semibold text-slate-900">Sponsor a patient</h2>
                <p className="mt-3 text-slate-600">
                  Help someone access Memory M8 for a year. 100% of donations are ring-fenced for funded subscriptions, prioritised for those most in need.
                </p>
                <ul className="mt-4 space-y-2 text-slate-600 list-disc list-inside">
                  <li>Give any amount when payments open</li>
                  <li>We’ll notify you as soon as secure payments are available</li>
                  <li>Care homes and hospitals can apply for sponsored seats</li>
                </ul>
                <div className="mt-6 text-xs text-slate-500">Payments will open when our account is live.</div>
              </div>

              <div className="rounded-2xl border bg-white p-6">
                {/* Reuse subscribe to capture notify emails */}
                <form className="grid gap-4" method="POST" action="/api/subscribe">
                  <input type="hidden" name="role" value="Sponsor notifications" />
                  <div>
                    <label className="block text-sm text-slate-700">Email</label>
                    <input name="email" type="email" required placeholder="donor@example.com" className="mt-1 w-full rounded-xl border-slate-300" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700">Message (optional)</label>
                    <textarea name="message" rows={3} placeholder="Add a note for our team (e.g., prefer to sponsor in your local area)…" className="mt-1 w-full rounded-xl border-slate-300" />
                  </div>
                  <button type="submit" className="inline-flex items-center rounded-xl bg-teal-600 px-5 py-3 text-white font-medium hover:bg-teal-700 shadow">
                    Notify me when payments open
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 bg-sky-50">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold text-slate-900">Questions &amp; Answers</h2>
            <div className="mt-8 divide-y rounded-2xl border bg-white">
              {faq.map((item, idx) => (
                <details key={idx} className="group open:bg-slate-50">
                  <summary className="cursor-pointer list-none p-6 flex items-start justify-between">
                    <span className="text-base font-medium text-slate-900">{item.q}</span>
                    <span className="ml-6 text-slate-400 group-open:rotate-180 transition">⌃</span>
                  </summary>
                  <div className="px-6 pb-6 -mt-2 text-slate-700">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Subscribe */}
        <section id="signup" className="py-20 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Sign up for launch updates</h2>
              <p className="mt-2 text-slate-600">Be first to know when we open early access. We’ll only email when it’s genuinely useful.</p>
              <form className="mt-6 grid gap-4" method="POST" action="/api/subscribe">
                <input type="hidden" name="double_opt_in" value="true" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700">Full name</label>
                    <input required name="name" type="text" className="mt-1 w-full rounded-xl border-slate-300" placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700">Email</label>
                    <input required name="email" type="email" className="mt-1 w-full rounded-xl border-slate-300" placeholder="jane@memorym8.com" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700">I am</label>
                    <select name="role" className="mt-1 w-full rounded-xl border-slate-300">
                      <option>Family / Carer</option>
                      <option>Care Home</option>
                      <option>Hospital / NHS</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700">Organisation (optional)</label>
                    <input name="org" type="text" className="mt-1 w-full rounded-xl border-slate-300" placeholder="Meadow View Care Home" />
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <input required id="consent" name="consent" type="checkbox" className="mt-1 h-4 w-4" />
                  <label htmlFor="consent" className="text-sm text-slate-600">
                    I consent to Memory M8 storing my details to contact me about early access and product updates. I can unsubscribe at any time.
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <input id="marketing" name="marketing" type="checkbox" className="mt-1 h-4 w-4" />
                  <label htmlFor="marketing" className="text-sm text-slate-600">
                    I agree to occasional marketing emails about Memory M8 products and services.
                  </label>
                </div>
                <div className="sm:flex sm:items-center sm:justify-between mt-2">
                  <button type="submit" className="mt-4 inline-flex items-center rounded-xl bg-sky-600 px-5 py-3 text-white font-medium hover:bg-sky-700 shadow">
                    Notify me
                  </button>
                  <p className="mt-3 text-xs text-slate-500">We respect your privacy. See our Privacy Policy.</p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-4 gap-10">
            <div>
              <img src="/logo-memorym8.png" alt="Memory M8" className="h-8 w-auto" />
              <p className="mt-4 text-sm text-slate-600 max-w-xs">
                Memory M8 provides AI-powered reassurance and dignity-first support for those living with memory loss. Built in the UK, privacy by design.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <a aria-label="Facebook" href="https://facebook.com/MemoryM8" className="hover:opacity-80">
                  <img src="/icon-fb.svg" alt="Facebook" className="h-6 w-6" />
                </a>
                <a aria-label="X (Twitter)" href="https://x.com/Memory_M8" className="hover:opacity-80">
                  <img src="/icon-x.svg" alt="X" className="h-6 w-6" />
                </a>
                <a aria-label="LinkedIn" href="https://www.linkedin.com/company/memorym8" className="hover:opacity-80">
                  <img src="/icon-li.svg" alt="LinkedIn" className="h-6 w-6" />
                </a>
                <a aria-label="WhatsApp" href="https://wa.me/447496250436" className="hover:opacity-80">
                  <img src="/icon-wa.svg" alt="WhatsApp" className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">Quick links</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li><a className="hover:underline" href="#features">Features</a></li>
                <li><a className="hover:underline" href="#faq">Q&amp;A</a></li>
                <li><a className="hover:underline" href="#sponsor">Sponsor a Patient</a></li>
                <li><a className="hover:underline" href="#signup">Get Updates</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Memory M8 Ltd (England &amp; Wales)</li>
                <li>Company No: <span className="font-mono">16711676</span></li>
                <li>ICO Registration: <span className="font-mono">ZB986177</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">Contact</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>
                  Email:
                  {' '}
                  <a className="hover:underline" href="mailto:info@memorym8.com">info@memorym8.com</a>
                  {' · '}
                  <a className="hover:underline" href="mailto:join@memorym8.com">join@memorym8.com</a>
                  {' · '}
                  <a className="hover:underline" href="mailto:sponsor@memorym8.com">sponsor@memorym8.com</a>
                </li>
                <li>WhatsApp: <a className="hover:underline" href="https://wa.me/447496250436">+44 7496 250436</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Memory M8. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a className="hover:underline" href="/privacy">Privacy Policy</a>
              <a className="hover:underline" href="/terms">Terms</a>
              <a className="hover:underline" href="/cookies">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

const features = [
  { title: 'Mood tracking', text: 'Gentle, always-on insights for peace of mind.' },
  { title: 'Dignity-first reassurance', text: 'Language and prompts tuned for adults — never infantilising.' },
  { title: 'Nurse prioritisation', text: 'Direct attention to where it’s needed most across wards.' },
  { title: 'Multilingual companion', text: 'Welsh, Polish, Urdu, Punjabi, Arabic, Romanian, Spanish and more.' },
  { title: 'Smart integrations', text: 'TV/radio reminders (e.g., switch to the correct channel at 7:30), Alexa, lights.' },
  { title: 'Zero-knowledge privacy', text: 'Patient-side data is end-to-end encrypted; we can’t read your conversations.' },
]

const faq = [
  { q: 'Is Memory M8 safe and private?', a: 'Yes. We follow GDPR/ICO with data minimisation and end-to-end encryption. Patient-side is zero-knowledge by default.' },
  { q: 'How does it reduce anxiety for families?', a: 'Glanceable wellbeing, Whisper Mode for calm cues, and quick voice/video reassurance so you can stay focused at work.' },
  { q: 'How does it help care homes?', a: 'Dashboards surface who needs attention first, reducing anxiety-driven callouts and enabling more meaningful, timely care.' },
  { q: 'Does this work on hospital wards?', a: 'Yes. Real-time ward views flag mood/confusion to support nurse prioritisation while preserving dignity.' },
  { q: 'Which languages are supported?', a: 'Welsh and English at launch; expanding to Polish, Urdu, Punjabi, Arabic, Romanian, Spanish and more.' },
  { q: 'What is Whisper Mode?', a: 'A calming, low-volume cue that reassures without startling — ideal for confusion or night-time disorientation.' },
  { q: 'Can it remind about TV shows or control devices?', a: 'Yes — reminders for favourite TV/radio, auto-switching to the correct channel, smart lights and gentle bedtime routines.' },
  { q: 'How does the AI learn safely?', a: 'It adapts to patterns in routines, mood and responses, keeping a minimal profile used only for reassurance and reminders.' },
]
