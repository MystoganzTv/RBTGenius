import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const CONTACT_EMAIL = "support@rbtgenius.app";

export default function PublicSiteFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/90 dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-slate-700 dark:text-slate-200">
            RBT Genius
          </p>
          <p className="mt-1">
            Practical exam prep for future Registered Behavior Technicians.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link to={createPageUrl("TermsOfService")} className="hover:text-slate-900 dark:hover:text-slate-100">
            Terms of Service
          </Link>
          <Link to={createPageUrl("PrivacyPolicy")} className="hover:text-slate-900 dark:hover:text-slate-100">
            Privacy Policy
          </Link>
          <Link to={createPageUrl("RefundPolicy")} className="hover:text-slate-900 dark:hover:text-slate-100">
            Refund Policy
          </Link>
          <Link to={createPageUrl("Contact")} className="hover:text-slate-900 dark:hover:text-slate-100">
            Contact
          </Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-slate-900 dark:hover:text-slate-100">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}
