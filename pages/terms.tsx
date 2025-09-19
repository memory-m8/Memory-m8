import Head from 'next/head'

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms & Conditions — Memory M8</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 prose prose-slate">
        <h1>Terms &amp; Conditions</h1>
        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>

        <h2>Who we are</h2>
        <p>Memory M8 Ltd (Company No. 16711676), registered in England &amp; Wales.</p>

        <h2>Service summary</h2>
        <p>
          Memory M8 provides a companion app and tools for families, care homes and hospitals to support those living with memory loss.
          Features include wellbeing check-ins, Whisper Mode, multilingual reassurance, and care dashboards.
        </p>

        <h2>Acceptable use</h2>
        <ul>
          <li>Use the service lawfully and respectfully.</li>
          <li>Do not attempt to reverse engineer, interfere with, or misuse the service.</li>
          <li>Only enrol visitors in Whisper Mode with their informed consent.</li>
        </ul>

        <h2>Accounts &amp; security</h2>
        <p>You are responsible for safeguarding login credentials and device security.</p>

        <h2>Healthcare disclaimer</h2>
        <p>
          Memory M8 supports care but is <strong>not</strong> a medical device and does not replace clinical judgment. Always follow local clinical guidance
          and escalate concerns to qualified professionals.
        </p>

        <h2>Subscriptions &amp; sponsoring</h2>
        <p>
          Pricing and sponsorship details will be provided before purchase. Sponsored subscriptions are ring-fenced for beneficiaries.
          Refunds follow consumer law and our published policy.
        </p>

        <h2>Intellectual property</h2>
        <p>All content, trademarks and software are owned by Memory M8 or our licensors. You receive a limited, revocable, non-transferable licence to use the app.</p>

        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, we exclude implied warranties and are not liable for indirect or consequential loss.
          Nothing limits liability for fraud or death/personal injury caused by negligence.
        </p>

        <h2>Termination</h2>
        <p>We may suspend or terminate access for breach, risk, or lawful request. You can cancel anytime; closing an account will delete personal data according to our Privacy Policy.</p>

        <h2>Governing law</h2>
        <p>These terms are governed by the laws of England &amp; Wales and subject to the jurisdiction of its courts.</p>
      </main>
    </>
  )
}
