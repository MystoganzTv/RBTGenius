import Layout from "./Layout";
import pages from "./pages.config";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  return (
    <>
      <Layout>
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">
              Starter Project
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950">
              RBT GENIUS
            </h1>
            <p className="max-w-2xl text-base text-slate-600">
              Base inicial para construir tu app por clases, modulos y paginas sin
              perder tiempo armando la estructura desde cero.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {pages.map((page) => (
              <article
                key={page.path}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  {page.label}
                </h2>
                <p className="mt-2 text-sm text-slate-500">{page.description}</p>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  {page.path}
                </p>
              </article>
            ))}
          </div>
        </section>
      </Layout>
      <Toaster />
    </>
  );
}
