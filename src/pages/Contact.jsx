import PublicPageShell from "@/components/public/PublicPageShell";

export default function Contact() {
  return (
    <PublicPageShell
      title="Contact"
      description="Reach out to RBT Genius for support, billing questions, or product-related help."
    >
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Support email</h2>
        <p className="mt-3">
          The main contact for RBT Genius is
          {" "}
          <a className="font-medium text-[#1E5EFF]" href="mailto:support@rbtgenius.app">
            support@rbtgenius.app
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">What to include</h2>
        <p className="mt-3">
          For faster help, include the email on your account and a short description of the issue.
          If your question is about billing, include the plan and approximate date of purchase.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Topics we can help with</h2>
        <p className="mt-3">
          We can help with account access, premium billing, technical issues, and general support
          related to using the RBT Genius platform.
        </p>
      </section>
    </PublicPageShell>
  );
}
