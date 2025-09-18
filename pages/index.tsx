// pages/index.tsx (Next.js 13/14 with Tailwind CSS)
// Professional medical-style landing page for Memory M8
// FIX: Some environments threw `Cannot read properties of null (reading '_')` when a
// <link rel="icon"> was rendered during SSR. We now manage the favicon **client-side**
// via a small hook that guarantees a single <link rel="icon"> is attached after mount.
// This avoids SSR head reconciliation bugs and still gives us a reliable data-URI fallback.
//
// Notes:
// - Keep /public/favicon.* optional. When you add a real file, just pass its URL to
//   <FaviconManager href="/favicon.ico"/> or update DATA_URI below.
// - Embedded smoke tests remain at the bottom (commented).
// - Forms post to your API routes (subscribe wired, sponsor-notify also uses subscribe).

import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// Minimal, branded SVG as a data-URI (tiny + universal)
const DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='28' fill='%230077b6'/%3E%3Cpath d='M20 32c0-6 5-11 12-11s12 5 12 11-5 11-12 11-12-5-12-11z' fill='%23A7D7CF'/%3E%3Ctext x='32' y='42' text-anchor='middle' font-size='18' font-family='Arial,Helvetica,sans-serif' fill='%230E5A6B'%3EM8%3C/text%3E%3C/svg%3E"

function FaviconManager({ href = DATA_URI }: { href?: string }) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    const head = document.head
    head.querySelectorAll("link[rel='icon']").forEach((n) => n.parentNode?.removeChild(n))
    const link = document.createElement('link')
    link.setAttribute('rel', 'icon')
    link.setAttribute('href', href)
    head.appendChild(link)
  }, [href])
  return null
}

export default function Home() {
  const router = useRouter()
  const [lang, setLang] = useState<'en' | 'cy'>('en')

  const copy = i18n[lang] ?? i18n.en
  const t = (k: keyof typeof copy) => copy[k]

  // Flash banner (/ ?subscribed=1 or ?pledged=1)
  const [flash, setFlash] = useState<{ type: 'subscribed' | 'pledged' | null; amount?: string | null }>({ type: null, amount: null })
  useEffect(() => {
    if (!router.isReady) return
    const { subscribed, pledged, amount } = router.query
    if (subscribed === '1') setFlash({ type: 'subscribed', amount: null })
    else if (pledged === '1') setFlash({ type: 'pledged', amount: typeof amount === 'string' ? amount : null })
  }, [router.isReady, router.query])

  const titleStr = `Memory M8 — ${t('heroTitle')}`

  // Expanded FAQ (EN 16 items; CY concise)
  const faq = lang === 'cy'
    ? [
        { q: 'A yw Memory M8 yn ddiogel a phreifat?', a: 'Ydw. GDPR/ICO, llai o ddata, amgryptiad cryf. Modd sero-wybodaeth i’r claf.' },
        { q: 'Sut mae’n lleihau pryder i deuluoedd?', a: 'Arwyddion lles cynnil; negeseuon llais/fideo tawel heb fabandod.' },
        { q: 'Sut mae’n helpu cartrefi gofal?', a: 'Dangosfyrddau’n blaenoriaethu sylw; llai o alwadau pryderus, mwy o ofal ystyrlon.' },
        { q: 'A yw’n gweithio ar wardiau?', a: 'Ydy. Golygfeydd amser real yn cefnogi blaenoriaethu nyrsys, aml‑ieithog ac yn dawelu.' },
        { q: 'Pa ieithoedd?', a: 'Cymraeg a Saesneg i ddechrau; mwy i ddilyn.' },
        { q: 'Beth yw Noddi Claf?', a: 'Blwyddyn o danysgrifiad i un person; crynodebau effaith dienw i roddwyr.' },
      ]
    : [
        { q: 'Is Memory M8 safe and private?', a: 'Yes. We follow GDPR/ICO with data minimisation and end‑to‑end encryption. Patient‑side is zero‑knowledge by default.' },
        { q: 'How does it reduce anxiety for families?', a: 'Glanceable wellbeing; send quick voice/video reassurance so you can stay focused at work.' },
        { q: 'How does it help care homes?', a: 'Resident dashboards surface who needs attention first, reducing anxiety‑driven callouts and enabling meaningful care.' },
        { q: 'Does this work on hospital wards?', a: 'Yes. Real‑time ward views flag mood/confusion to support nurse prioritisation while preserving dignity.' },
        { q: 'Which languages are supported?', a: 'Welsh and English at launch; expanding to Polish, Urdu, Punjabi, Arabic, Romanian, Spanish and more.' },
        { q: 'What does Sponsoring a Patient cover?', a: 'A full‑year subscription for one person; anonymised impact summaries for donors.' },
        { q: 'How does the AI companion learn about each patient?', a: 'It adapts by noticing patterns in routines, mood and responses, building a minimal care profile only for reassurance and reminders.' },
        { q: 'What is Whisper Mode and when is it used?', a: 'A calming, low‑volume cue that reassures without startling — ideal for confusion or night‑time disorientation.' },
        { q: 'Does Memory M8 keep conversations?', a: 'Patient‑side conversations are end‑to‑end encrypted under zero‑knowledge rules. We cannot read or repurpose them.' },
        { q: 'Can it remind about TV shows or control devices?', a: 'Yes. It can announce and switch on favourite TV/radio shows, dim lights, and nudge carers for a check‑in.' },
        { q: 'How does it avoid sounding infantilising?', a: 'Prompts are tuned for adult, dignity‑first phrasing and reference personal memories the patient enjoys.' },
        { q: 'Does it work offline?', a: 'Resilience mode caches key routines/prompts so reassurance continues offline; data re‑syncs later.' },
        { q: 'How are families and carers coordinated?', a: 'Multiple trusted contacts can connect. The system tags who reassurance is from and prioritises alerts.' },
        { q: 'Clinical value of nurse prioritisation?', a: 'It highlights rising risk (distress/confusion) so nurses can direct care efficiently without compromising dignity.' },
        { q: 'Can patients speak naturally?', a: 'Yes — natural speech in supported languages. It learns preferred phrases and topics for familiar conversations.' },
        { q: 'How is safety monitored?', a: 'Policy controls, audit trails for staff actions, and privacy‑preserving telemetry keep behaviour predictable and compliant.' },
      ]

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{titleStr}</title>
        <meta name="description" content={t('metaDescription')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* no <link rel="icon"> here (SSR fix) */}
        <meta property="og:title" content={`Memory M8 – ${t('heroTitle')}`} />
        <meta property="og:description" content={t('ogDescription')} />
        <meta property="og:image" content="/og-memory-m8.jpg" />
        <meta property="og:url" content="https://memorym8.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Memory_M8" />
        <meta name="theme-color" content="#0077b6" />
      </Head>

      <FaviconManager />

      <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <img src="/logo-memorym8.png" alt="Memory M8" className="h-8 w-auto" />
            <span className="sr-only">Memory M8</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-700">
            <a href="#families" className="hover:text-slate-900">{t('navFamilies')}</a>
            <a href="#care" className="hover:text-slate-900">{t('navCareHomes')}</a>
            <a href="#hospitals" className="hover:text-slate-900">{t('navHospitals')}</a>
            <a href="#features" className="hover:text-slate-900">{t('navFeatures')}</a>
            <a href="#faq" className="hover:text-slate-900">{t('navQA')}</a>
            <a href="#sponsor" className="hover:text-slate-900">{t('navSponsor')}</a>
          </nav>
          <div className="flex items-center gap-3">
            <label className="sr-only" htmlFor="lang">Language</label>
            <select id="lang" value={lang} onChange={(e)=>setLang(e.target.value as any)} className="rounded-lg border-slate-300 text-sm">
              <option value="en">English</option>
              <option value="cy">Cymraeg</option>
            </select>
            <a href="#signup" className="hidden sm:inline-flex items-center rounded-xl bg-sky-600 px-4 py-2 text-white text-sm font-medium hover:bg-sky-700 shadow">{t('ctaUpdates')}</a>
          </div>
        </div>
      </header>

      <main>
        {flash.type && (
          <div className="bg-emerald-50 border-b border-emerald-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-start justify-between gap-4">
              <p className="text-sm text-emerald-900">
                {flash.type === 'subscribed' && 'Thanks! Please check your email and click the confirmation link to complete your subscription.'}
                {flash.type === 'pledged' && "Thank you — we’ll notify you as soon as sponsoring is available."}
              </p>
              <button onClick={() => setFlash({ type: null, amount: null })} className="text-emerald-900/70 hover:text-emerald-900 text-sm">Dismiss</button>
            </div>
          </div>
        )}

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid lg:grid-cols-2 items-center gap-10">
              <div>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">Welcome to Memory M8</h1>
                <p className="mt-5 text-lg text-slate-700">Companionship, Dignity & Support — Powered by AI.</p>
                <p className="mt-4 text-slate-600">Memory M8 reassures families, supports carers, and prioritises nurse attention for those living with memory loss. Multilingual, dignity‑first, and privacy by design. <strong>All patient‑side features are zero‑knowledge by default.</strong></p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a href="#signup" className="inline-flex items-center rounded-xl bg-sky-600 px-5 py-3 text-white font-medium hover:bg-sky-700 shadow">{t('ctaSignup')}</a>
                  <a href="#features" className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-slate-700 font-medium hover:bg-slate-50">{t('ctaExplore')}</a>
                </div>
                <div className="mt-6 flex items-center gap-3 text-xs text-slate-600">
                  <span className="px-3 py-1 rounded-full bg-white border">GDPR</span>
                  <span className="px-3 py-1 rounded-full bg-white border">ICO</span>
                  <span className="px-3 py-1 rounded-full bg-white border">Zero‑knowledge by default</span>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] w-full rounded-2xl bg-slate-200 shadow-inner flex items-center justify-center">
                  <span className="text-slate-500">Hero Image / App Mockup</span>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow p-4 w-64">
                  <p className="text-sm text-slate-700">“I can focus at work without worrying. If Mum needs reassurance, I get a gentle prompt and can send a quick voice note.”</p>
                  <p className="mt-2 text-xs text-slate-500">— Sarah, Family Carer</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How Memory M8 helps */}
        <section id="families" className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold text-slate-900">How Memory M8 helps</h2>
            <p className="mt-3 text-slate-600 max-w-3xl">Designed with families, care homes and hospitals in mind — simple, human, and clinically thoughtful.</p>

            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <article className="rounded-2xl border p-6 bg-white">
                <div className="aspect-video rounded-xl bg-slate-100 flex items-center justify-center mb-4"><span className="text-slate-500">Image</span></div>
                <h3 className="text-xl font-semibold text-slate-900">For Families</h3>
                <p className="mt-2 text-slate-600">Memory M8 brings reassurance into the home. Families can check a loved one’s mood at a glance and use <strong>Whisper Mode</strong> for subtle, calming cues. The companion researches personal memories, photos and favourite topics to keep conversation familiar. It adapts over time — learning what settles anxiety and how best to reassure with dignity. Smart control can remind about TV shows, switch on the right channel at 7:30pm, and dim lights for bedtime.</p>
              </article>
              <article id="care" className="rounded-2xl border p-6 bg-white">
                <div className="aspect-video rounded-xl bg-slate-100 flex items-center justify-center mb-4"><span className="text-slate-500">Image</span></div>
                <h3 className="text-xl font-semibold text-slate-900">For Care Homes</h3>
                <p className="mt-2 text-slate-600">Resident wellbeing dashboards prioritise where carers need to be and who needs attention first. Anxiety‑driven callouts reduce so staff can focus time where it matters. Alerts surface when reassurance or intervention is required, whether in a resident’s room or during shared activities — balancing human care with real‑time AI support that keeps dignity intact.</p>
              </article>
              <article id="hospitals" className="rounded-2xl border p-6 bg-white">
                <div className="aspect-video rounded-xl bg-slate-100 flex items-center justify-center mb-4"><span className="text-slate-500">Image</span></div>
                <h3 className="text-xl font-semibold text-slate-900">For Hospital Wards</h3>
                <p className="mt-2 text-slate-600">Ward views flag mood changes, confusion or distress in real time. Nurse prioritisation highlights where human attention is most needed, ensuring compassionate, efficient care. Multilingual reassurance overcomes language barriers, while calm, personalised messages help patients stay grounded in a busy clinical environment.</p>
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

        {/* Sponsor notify-only (no amount) */}
        <section id="sponsor" className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-semibold text-slate-900">Sponsor a patient</h2>
                <p className="mt-3 text-slate-600">Help someone access Memory M8 for a year. 100% of donations are ring‑fenced for funded subscriptions, prioritised for those most in need.</p>
                <ul className="mt-4 space-y-2 text-slate-600 list-disc list-inside">
                  <li>Give any amount when payments open</li>
                  <li>We’ll notify you as soon as secure payments are available</li>
                  <li>Care homes and hospitals can apply for sponsored seats</li>
                </ul>
                <div className="mt-6 text-xs text-slate-500">Payments will open when our account is live.</div>
              </div>

              <div className="rounded-2xl border bg-white p-6">
                {/* Use subscribe route to collect notify emails */}
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
                  <button type="submit" className="inline-flex items-center rounded-xl bg-teal-600 px-5 py-3 text-white font-medium hover:bg-teal-700 shadow">Notify me when payments open</button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Q&A */}
        <section id="faq" className="py-20 bg-sky-50">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold text-slate-900">Questions & Answers</h2>
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
                  <label htmlFor="consent" className="text-sm text-slate-600">I consent to Memory M8 storing my details to contact me about early access and product updates. I can unsubscribe at any time.</label>
                </div>
                <div className="flex items-start gap-3">
                  <input id="marketing" name="marketing" type="checkbox" className="mt-1 h-4 w-4" />
                  <label htmlFor="marketing" className="text-sm text-slate-600">I agree to occasional marketing emails about Memory M8 products and services.</label>
                </div>
                <div className="sm:flex sm:items-center sm:justify-between mt-2">
                  <button type="submit" className="mt-4 inline-flex items-center rounded-xl bg-sky-600 px-5 py-3 text-white font-medium hover:bg-sky-700 shadow">Notify me</button>
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
              <p className="mt-4 text-sm text-slate-600 max-w-xs">Memory M8 provides AI-powered reassurance and dignity-first support for those living with memory loss. Built in the UK, privacy by design.</p>
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
                <li><a className="hover:underline" href="#faq">Q&A</a></li>
                <li><a className="hover:underline" href="#sponsor">Sponsor a Patient</a></li>
                <li><a className="hover:underline" href="#signup">Get Updates</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Memory M8 Ltd (England &amp; Wales)</li>
                <li>Company No: <span className="font-mono">16711676</span></li>
                <li>ICO Registration: <span className="font-mono">[ENTER ICO REF]</span></li>
                <li>VAT: <span className="font-mono">[IF APPLICABLE]</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">Contact</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Email: <a className="hover:underline" href="mailto:info@memorym8.com">info@memorym8.com</a> · <a className="hover:underline" href="mailto:join@memorym8.com">join@memorym8.com</a> · <a className="hover:underline" href="mailto:sponsor@memorym8.com">sponsor@memorym8.com</a></li>
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

      {/* --- Embedded Test Cases (paste into /__tests__/index.test.tsx) --- */}
      {false && <div />}
      {/*
        import { render, screen, fireEvent } from '@testing-library/react'
        import Home from '../pages/index'

        describe('Landing page smoke tests', () => {
          it('renders hero headline (EN)', () => {
            render(<Home />)
            expect(screen.getByText(/Companionship, Dignity/i)).toBeInTheDocument()
          })

          it('switches to Welsh copy when selected', () => {
            render(<Home />)
            const select = screen.getByLabelText('Language', { selector: 'select' })
            fireEvent.change(select, { target: { value: 'cy' } })
            expect(screen.getByText(/Cwmnïaeth, Urddas a Chefnogaeth/i)).toBeInTheDocument()
          })

          it('includes company number and WhatsApp link', () => {
            render(<Home />)
            expect(screen.getByText(/16711676/)).toBeInTheDocument()
            const wa = screen.getAllByRole('link').find(a => (a as HTMLAnchorElement).href.includes('wa.me/447496250436'))
            expect(wa).toBeTruthy()
          })

          it('includes a favicon link (fallback)', () => {
            render(<Home />)
            const link = document.head.querySelector('link[rel="icon"]') as HTMLLinkElement | null
            expect(link).not.toBeNull()
            expect(link?.getAttribute('href') || '').toContain('data:image/svg+xml')
          })

          it('renders at least one FAQ item', () => {
            render(<Home />)
            expect(screen.getByText(/safe and private|ddiogel a phreifat/i)).toBeInTheDocument()
          })
        })
      */}
    </>
  )
}

const features = [
  { title: 'Mood tracking', text: 'Gentle, always-on insights for peace of mind.' },
  { title: 'Dignity-first reassurance', text: 'Language and prompts designed not to infantilise.' },
  { title: 'Nurse prioritisation', text: 'Surface attention where it’s needed most across wards.' },
  { title: 'Multilingual companion', text: 'Welsh, Polish, Urdu, Punjabi, Arabic, Romanian, Spanish and more.' },
  { title: 'Smart integrations', text: 'TV/radio reminders (e.g., turn on Coronation Street at 7:30), Alexa, lights.' },
  { title: 'Zero-knowledge privacy', text: 'All patient-side data is end‑to‑end encrypted; we can’t read your data.' },
]

const i18n = {
  en: {
    heroTitle: 'Companionship, Dignity & Support — Powered by AI',
    metaDescription: 'AI-powered reassurance for families, care homes and hospital wards. Multilingual, dignity-first, nurse-prioritisation, zero-knowledge privacy.',
    ogDescription: 'AI-powered reassurance for families, care homes and hospital wards.',
    navFamilies: 'For Families',
    navCareHomes: 'For Care Homes',
    navHospitals: 'For Hospitals',
    navFeatures: 'Features',
    navQA: 'Q&A',
    navSponsor: 'Sponsor a Patient',
    ctaUpdates: 'Get Updates',
    ctaSignup: 'Sign up for updates',
    ctaExplore: 'Explore features',
  },
  cy: {
    heroTitle: 'Cwmnïaeth, Urddas a Chefnogaeth — wedi’i Gyflenwi gan AI',
    metaDescription: 'Cymorth pweredig gan AI i deuluoedd, cartrefi gofal a wardiau ysbyty.',
    ogDescription: 'Cymorth pweredig gan AI i deuluoedd, cartrefi gofal a wardiau ysbyty.',
    navFamilies: 'I Deuluoedd',
    navCareHomes: 'I Gartrefi Gofal',
    navHospitals: 'I Wardiau Ysbyty',
    navFeatures: 'Nodweddion',
    navQA: 'C&A',
    navSponsor: 'Noddi Claf',
    ctaUpdates: 'Derbyn Diweddariadau',
    ctaSignup: 'Cofrestru am ddiweddariadau',
    ctaExplore: 'Archwilio nodweddion',
  }
} as const