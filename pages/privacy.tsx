import Head from 'next/head'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — Memory M8</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 prose prose-slate">
        <h1>Privacy Policy</h1>
        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>

        <p>
          Memory M8 Ltd (Company No. 16711676) (“<strong>Memory M8</strong>”, “we”, “us”) provides reassurance and
          dignity-first support for those living with memory loss. We take privacy seriously and design our services
          to minimise data and maximise control.
        </p>

        <h2>Who is the controller?</h2>
        <p>
          Memory M8 Ltd, England &amp; Wales. ICO Registration: <strong>ZB986177</strong>.
          Contact: <a href="mailto:info@memorym8.com">info@memorym8.com</a>.
        </p>

        <h2>What data we process</h2>
        <ul>
          <li><strong>Account &amp; contact data</strong> (name, email, role, organisation) for updates and access.</li>
          <li><strong>Care context</strong> added by families/carers (e.g., preferences, routines).</li>
          <li><strong>App telemetry</strong> (diagnostics, security logs) — minimised and pseudonymised where possible.</li>
          <li><strong>Companion interactions</strong> — patient-side features operate under <em>zero-knowledge</em> by default; content is end-to-end encrypted and not readable by us.</li>
        </ul>

        <h3>Whisper Mode &amp; Visitor Voice Recognition</h3>
        <p>
          To protect dignity, Whisper Mode can discreetly remind a patient who has entered the room. If enabled by the family/carer,
          the system may <strong>capture and store a small voice profile for approved visitors</strong> so the companion can recognise familiar people.
        </p>
        <ul>
          <li><strong>Purpose:</strong> Identification of approved visitors solely to deliver discreet reminders.</li>
          <li><strong>Lawful basis:</strong> <em>Consent</em> from the patient or their lawful representative and <em>informed consent</em> from each enrolled visitor.</li>
          <li><strong>Storage &amp; security:</strong> Voice embeddings (not raw audio) are encrypted and stored with strict access controls.</li>
          <li><strong>Sharing:</strong> Never sold or used for advertising; not shared with third parties except essential processors under contract.</li>
          <li><strong>Control:</strong> Families/carers can enrol or remove visitors; patients/representatives may revoke consent at any time. Deleting a visitor removes their profile.</li>
          <li><strong>Retention:</strong> Until consent is withdrawn, the patient profile is closed, or a family/carer deletes the visitor, whichever is sooner.</li>
        </ul>

        <h2>Why we process data (lawful bases)</h2>
        <ul>
          <li><strong>Contract</strong> — to provide the service you request.</li>
          <li><strong>Consent</strong> — updates, marketing (optional), Whisper Mode visitor recognition.</li>
          <li><strong>Legitimate interests</strong> — security, fraud prevention, service safety.</li>
          <li><strong>Legal obligation</strong> — compliance with UK law and regulatory requirements.</li>
        </ul>

        <h2>Where data is processed</h2>
        <p>
          We use trusted providers that meet applicable UK GDPR standards. Transfers outside the UK use appropriate safeguards
          (e.g., IDTA or UK Addendum to SCCs).
        </p>

        <h2>Retention</h2>
        <p>
          We keep data only as long as needed for the stated purposes. Patient-side encrypted content is under the user’s control and may
          be deleted within the app. Visitor voice profiles are kept only while consent remains active.
        </p>

        <h2>Your rights</h2>
        <p>
          You can request access, correction, deletion, restriction, or portability of your personal data, and you can object to certain processing.
          Where processing is based on consent, you can withdraw it at any time.
        </p>
        <p>
          To exercise rights, contact <a href="mailto:privacy@memorym8.com">privacy@memorym8.com</a>. You can also complain to the ICO.
        </p>

        <h2>Children &amp; safeguarding</h2>
        <p>
          Memory M8 is designed for adult use overseen by families/carers and care providers. Where capacity or consent is managed by a representative,
          they should control enrolment and data deletion.
        </p>

        <h2>Changes</h2>
        <p>
          We will post updates here and, where appropriate, notify you by email or in-app.
        </p>
      </main>
    </>
  )
}
