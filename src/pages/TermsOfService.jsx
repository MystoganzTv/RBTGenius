import PublicPageShell from "@/components/public/PublicPageShell";

export default function TermsOfService() {
  return (
    <PublicPageShell
      title="Terms of Service"
      description="These terms explain how RBT Genius can be used, what we provide, and the responsibilities of members using the platform."
    >
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">1. About RBT Genius</h2>
        <p className="mt-3">
          RBT Genius is an educational platform designed to help users prepare for the Registered
          Behavior Technician exam through practice questions, flashcards, mock exams, analytics,
          and tutoring features. The platform is intended for study support and does not replace
          formal supervision, clinical judgment, or BACB guidance.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">2. Accounts and access</h2>
        <p className="mt-3">
          You are responsible for keeping your login credentials secure and for the activity that
          occurs under your account. You must provide accurate account information and use the
          service only for lawful and educational purposes.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">3. Membership plans</h2>
        <p className="mt-3">
          RBT Genius may offer free and premium access levels. Premium features may include
          expanded question access, mock exams, analytics, and billing tools. Plan details, pricing,
          and feature availability may change over time.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">4. Educational use only</h2>
        <p className="mt-3">
          Content inside RBT Genius is provided for study and review. It should not be treated as
          legal, medical, psychological, or supervisory advice. Users remain responsible for
          following the standards and requirements of the BACB, their employers, and their supervisors.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">5. Acceptable use</h2>
        <p className="mt-3">
          You may not misuse the platform, attempt unauthorized access, copy or resell protected
          content, interfere with service availability, or use automated methods to extract the
          question bank or system content without written permission.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">6. Service updates</h2>
        <p className="mt-3">
          We may improve, modify, or discontinue parts of the service as the product evolves.
          Reasonable effort will be made to maintain platform availability, but uninterrupted access
          is not guaranteed.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">7. Contact</h2>
        <p className="mt-3">
          For account or legal questions related to these terms, contact
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
