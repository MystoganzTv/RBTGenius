import PublicPageShell from "@/components/public/PublicPageShell";

export default function PrivacyPolicy() {
  return (
    <PublicPageShell
      title="Privacy Policy"
      description="This policy explains what information RBT Genius collects, how it is used, and how it supports your study experience."
    >
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">1. Information we collect</h2>
        <p className="mt-3">
          We may collect account details such as your name, email address, login method, plan,
          study activity, attempts, mock exam results, usage analytics, and billing-related records
          connected to your account.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">2. Why we collect it</h2>
        <p className="mt-3">
          We use your information to operate the platform, save your progress, personalize your
          experience, manage subscriptions, improve product performance, and provide support when needed.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">3. Billing and payment data</h2>
        <p className="mt-3">
          Subscription payments may be processed through Stripe. RBT Genius may store payment
          metadata such as plan, amount, currency, status, Stripe customer IDs, and Stripe session
          or subscription references. Full card data is not stored directly by RBT Genius.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">4. OAuth and sign-in providers</h2>
        <p className="mt-3">
          If you sign in with providers such as Google, Apple, GitHub, or Microsoft, we may store
          your provider name, basic profile information, and linked account identifiers needed to
          support login and account recovery.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">5. Data retention</h2>
        <p className="mt-3">
          We retain account and study information for as long as needed to operate your account,
          maintain records, improve service quality, and comply with applicable legal or financial obligations.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">6. Contact</h2>
        <p className="mt-3">
          Privacy questions can be sent to
          {" "}
          <a className="font-medium text-[#1E5EFF]" href="mailto:support@rbtgenius.app">
            support@rbtgenius.app
          </a>
          .
        </p>
      </section>
    </PublicPageShell>
  );
}
