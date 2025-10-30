import Head from "next/head";
import Link from "next/link";

export default function DeleteAccountPage() {
  const formUrl =
    process.env.NEXT_PUBLIC_GOOGLE_FORM_URL || "https://forms.gle/REPLACE_ME";
  const embedUrl = process.env.NEXT_PUBLIC_GOOGLE_FORM_EMBED_URL || "";
  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@memorym8.com";

  return (
    <>
      <Head>
        <title>Memory M8 – Account &amp; Data Deletion</title>
        <meta
          name="description"
          content="Request deletion of your Memory M8 account and associated data."
        />
      </Head>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Memory M8 – Account &amp; Data Deletion</h1>
          <p className="text-gray-600">
            Use this page to request deletion of your account and associated data.
          </p>
        </header>

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mt-0 text-xl font-semibold">What we delete</h2>
          <ul className="list-disc pl-6">
            <li>Account and profile</li>
            <li>Photos and audio/voice clips</li>
            <li>Memories, routines, visit logs, mood/session events</li>
            <li>Paired device links</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">Temporary retention</h2>
          <p>
            Backups and audit traces may persist for up to <strong>30 days</strong> before
            automatic purge. We may retain minimal records required for fraud prevention and legal
            compliance.
          </p>

          <h2 className="mt-6 text-xl font-semibold">Identity verification</h2>
          <p>
            Requests should be made from the account’s email address. If not, we may request a
            verification code or a reply from the account email.
          </p>

          <h2 className="mt-6 text-xl font-semibold">Timeline</h2>
          <p>
            We acknowledge within <strong>7 days</strong> and complete deletion as soon as possible
            (usually faster; legal maximum may be up to 30 days).
          </p>

          <h2 className="mt-6 text-xl font-semibold">Request deletion</h2>
          <p className="mb-2">
            Use our request form:&nbsp;
            <a
              className="inline-block rounded-lg border border-blue-600 px-3 py-2 text-blue-700 hover:bg-blue-50"
              href={formUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Open deletion request form
            </a>
          </p>

          {embedUrl ? (
            <div className="mt-4">
              <iframe
                src={embedUrl}
                width="100%"
                height={900}
                frameBorder={0}
                marginHeight={0}
                marginWidth={0}
                referrerPolicy="no-referrer-when-downgrade"
              >
                Loading…
              </iframe>
            </div>
          ) : null}

          <h2 className="mt-6 text-xl font-semibold">Support</h2>
          <p>
            Email{" "}
            <a className="text-blue-700 underline" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>{" "}
            for help.
          </p>
        </section>

        <footer className="mt-8 text-sm text-gray-600">
          © {new Date().getFullYear()} Memory M8.{" "}
          <Link className="underline" href="/privacy">
            Privacy
          </Link>{" "}
          •{" "}
          <Link className="underline" href="/terms">
            Terms
          </Link>
        </footer>
      </main>
    </>
  );
}
