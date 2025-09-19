import Head from 'next/head'

export default function AIPrivacy() {
  return (
    <>
      <Head>
        <title>AI & Zero-Knowledge Privacy — Memory M8</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 prose prose-slate">
        <h1>AI &amp; Zero-Knowledge Privacy</h1>
        <p>
          Patient-side conversations and prompts are end-to-end encrypted under a zero-knowledge model.
          Memory M8 cannot read this content. Families and authorised carers control access and deletion.
        </p>

        <h2>Model behaviour</h2>
        <ul>
          <li>Prompts are tuned for adults and dignity-first language.</li>
          <li>We block unsafe outputs and log policy events, not private content.</li>
          <li>We do not sell or use your data to train advertising models.</li>
        </ul>

        <h2>Whisper Mode</h2>
        <p>
          If enabled, Whisper Mode may maintain <strong>encrypted visitor voice profiles</strong> (with informed consent) to provide discreet reminders of who is present.
          Profiles are deletable at any time and never used for marketing or unrelated purposes.
        </p>

        <p>See our <a href="/privacy">Privacy Policy</a> for the full legal basis, retention and your rights.</p>
      </main>
    </>
  )
}
