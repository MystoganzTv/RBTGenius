import PublicPageShell from "@/components/public/PublicPageShell";

export default function RefundPolicy() {
  return (
    <PublicPageShell
      title="Refund Policy"
      description="This policy explains how refund requests are handled for RBT Genius premium memberships."
    >
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">1. Subscription purchases</h2>
        <p className="mt-3">
          Premium access may be sold as monthly or yearly recurring billing. By purchasing a premium
          subscription, you authorize recurring charges according to the plan selected during checkout.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">2. Refund requests</h2>
        <p className="mt-3">
          Refund requests are reviewed on a case-by-case basis. If you believe you were charged in
          error or experienced a billing problem, contact us as soon as possible so we can review
          the situation.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">3. Non-refundable situations</h2>
        <p className="mt-3">
          In general, partial usage of a billing period, missed cancellations, or access to premium
          content alone may not automatically qualify for a refund. However, we will still review
          legitimate cases fairly.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">4. How to request help</h2>
        <p className="mt-3">
          For billing support or refund review, email
          {" "}
          <a className="font-medium text-[#1E5EFF]" href="mailto:support@rbtgenius.app">
            support@rbtgenius.app
          </a>
          {" "}
          and include the email used on your account, the plan involved, and the date of the charge.
        </p>
      </section>
    </PublicPageShell>
  );
}
