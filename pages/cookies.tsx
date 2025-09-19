import Head from 'next/head'

export default function Cookies() {
  return (
    <>
      <Head>
        <title>Cookie Policy — Memory M8</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 prose prose-slate">
        <h1>Cookie Policy</h1>
        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>

        <h2>How we use cookies</h2>
        <p>
          Memory M8 uses essential cookies to run the site and measure aggregated performance. We avoid cross-site ad tracking.
          You can control non-essential cookies via your browser settings.
        </p>

        <h2>Categories</h2>
        <ul>
          <li><strong>Strictly necessary</strong> — session management, security, load-balancing.</li>
          <li><strong>Performance</strong> — anonymous analytics (e.g., page load, error rates).</li>
          <li><strong>Preferences</strong> — language or accessibility choices (optional).</li>
        </ul>

        <h2>Third-party services</h2>
        <p>
          Where we use analytics or error-monitoring providers, we contract them as processors and do not allow them to use data for advertising.
        </p>

        <h2>Managing cookies</h2>
        <p>
          Most browsers let you block or delete cookies. Blocking essential cookies may impact functionality. For questions,
          contact <a href="mailto:privacy@memorym8.com">privacy@memorym8.com</a>.
        </p>
      </main>
    </>
  )
}
