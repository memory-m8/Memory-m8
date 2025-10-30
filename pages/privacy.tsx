// pages/privacy.tsx
import Head from "next/head";

export default function PrivacyPage() {
  const updated = "30/10/2025";
  const title = "Privacy Policy – Memory M8";
  const canonical = "https://www.memorym8.com/privacy";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Memory M8 Privacy Policy" />
        <link rel="canonical" href={canonical} />
      </Head>

      <main style={{ padding: "32px 16px", maxWidth: 900, margin: "0 auto" }}>
        <article>
          <h1>Privacy Policy</h1>
          <p><strong>Last updated:</strong> {updated}</p>

          <p>
            <strong>Memory M8 Ltd</strong> (Company No. 16711676) (“<strong>Memory M8</strong>”, “<strong>we</strong>”, “<strong>us</strong>”)
            provides reassurance and dignity-first support for people living with memory loss. We design our
            services to <strong>minimise data</strong> and <strong>maximise control</strong>.
          </p>

          <ul>
            <li><strong>Controller:</strong> Memory M8 Ltd, England &amp; Wales</li>
            <li><strong>ICO Registration:</strong> ZB986177</li>
            <li><strong>Contact (general):</strong> <a href="mailto:info@memorym8.com">info@memorym8.com</a></li>
            <li><strong>Contact (privacy &amp; rights):</strong> <a href="mailto:privacy@memorym8.com">privacy@memorym8.com</a></li>
          </ul>

          <hr />

          <h2>What data we process</h2>
          <h3>Account &amp; access</h3>
          <p>Name, email, role/organisation (if provided) to create and secure your account and send essential service messages.</p>

          <h3>Care context (carer/family provided)</h3>
          <p>Patient preferences, routines, notes you choose to add. You control what you enter and can remove it at any time.</p>

          <h3>Companion content (patient side)</h3>
          <p>
            Patient-side features run under a <strong>zero-knowledge</strong> design by default.
            Content is <strong>end-to-end encrypted</strong> and not readable by us (we may process minimal metadata required for reliability and security).
          </p>

          <h3>Whisper Mode &amp; Visitor Voice Recognition (optional)</h3>
          <p>
            If enabled by the family/carer, the system may capture and store a <strong>small voice profile (embedding)</strong> for approved visitors so the companion can recognise familiar people and discreetly remind the patient who entered the room.
          </p>
          <ul>
            <li><strong>Purpose:</strong> Identify approved visitors solely to trigger discreet reminders.</li>
            <li><strong>Lawful basis:</strong> <strong>Explicit consent</strong> from the patient or their lawful representative and informed consent from each enrolled visitor (UK GDPR Art. 9(2)(a) — biometric data).</li>
            <li><strong>Data stored:</strong> Voice embeddings only (no raw audio).</li>
            <li><strong>Security:</strong> Encrypted with strict access controls.</li>
            <li><strong>Sharing:</strong> Never sold or used for advertising; only with essential processors under contract.</li>
            <li><strong>Control:</strong> Carers/families can enrol/remove visitors; patients/representatives may revoke consent at any time.</li>
            <li><strong>Retention:</strong> Until consent is withdrawn, the patient profile is closed, or the visitor is deleted—whichever occurs first.</li>
          </ul>

          <h3>Device, diagnostics &amp; security logs</h3>
          <p>Minimal telemetry (e.g., crash/diagnostic events, request/response codes, device/OS model) to keep the service reliable and secure; pseudonymised where possible.</p>

          <h3>Support communications</h3>
          <p>Emails and in-app messages for support and issue resolution.</p>

          <blockquote>
            We do <strong>not</strong> sell personal data and do <strong>not</strong> use patient content for advertising.
          </blockquote>

          <h2>Why we process data (lawful bases)</h2>
          <ul>
            <li><strong>Contract</strong> – to provide the services you request.</li>
            <li><strong>Consent</strong> – optional updates/marketing; Whisper Mode &amp; Visitor Recognition.</li>
            <li><strong>Legitimate interests</strong> – security, fraud prevention, service safety and quality (balanced against your rights).</li>
            <li><strong>Legal obligation</strong> – compliance with UK law and regulatory requirements.</li>
          </ul>

          <h2>Sharing &amp; processors</h2>
          <p>
            We use trusted providers (hosting, push notifications, support tooling) under data-protection agreements.
            They act on our instructions and do not use personal data for their own purposes. We may disclose data if required by law or to protect users from harm.
          </p>

          <h2>International transfers</h2>
          <p>
            Where data is transferred outside the UK, we apply appropriate safeguards (e.g., the UK International Data Transfer Agreement or
            UK Addendum to the EU Standard Contractual Clauses) consistent with UK GDPR.
          </p>

          <h2>Retention</h2>
          <ul>
            <li>We keep data only as long as needed for the purposes above.</li>
            <li>Patient-side encrypted content: under the user’s control and deletable in-app.</li>
            <li>Visitor voice embeddings: retained only while consent remains active or until removed.</li>
            <li>Diagnostics &amp; logs: short service-improving periods unless needed for security/legal reasons.</li>
          </ul>

          <h2>Security</h2>
          <p>Industry-standard safeguards including encryption in transit and at rest, access controls, and secure development practices.</p>

          <h2>Your rights (UK GDPR)</h2>
          <p>
            You can request access, correction, deletion, restriction, portability, and object to certain processing.
            Where processing relies on consent, you may withdraw consent at any time (doesn’t affect prior lawful use).
          </p>
          <p>
            To exercise rights: <a href="mailto:privacy@memorym8.com">privacy@memorym8.com</a>.
            You may also complain to the UK ICO.
          </p>

          <h2>Children &amp; safeguarding</h2>
          <p>
            Memory M8 is designed for adult use overseen by families/carers and care providers.
            Where capacity/consent is managed by a representative, they should control enrolment and data deletion.
          </p>

          <h2>Your choices &amp; deletion</h2>
          <ul>
            <li>In-app controls to manage patient profiles, remove family invites, and delete visitor voice profiles.</li>
            <li>Privacy modes: patients can enable <strong>FULL</strong> privacy (do-not-record) or <strong>QUIET</strong> mode at any time.</li>
            <li>Account deletion or export: email <a href="mailto:privacy@memorym8.com">privacy@memorym8.com</a>.</li>
          </ul>

          <h2>Cookies &amp; website</h2>
          <p>Our website uses only the cookies/scripts necessary to operate the site and any analytics you consent to (if enabled).</p>

          <h2>Changes to this policy</h2>
          <p>We’ll post updates here and, where appropriate, notify you by email or in-app.</p>

          <p>
            <strong>Memory M8 Ltd</strong><br />
            Contact (general): <a href="mailto:info@memorym8.com">info@memorym8.com</a><br />
            Contact (privacy &amp; rights): <a href="mailto:privacy@memorym8.com">privacy@memorym8.com</a>
          </p>
        </article>
      </main>
    </>
  );
}
