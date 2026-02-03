import { Link } from "wouter";
import NotFound from "@/pages/not-found";
import { LEGAL_CONTENT } from "@/lib/legal-content";

const CONTENT_KEY_MAP: Record<string, string> = {
  "privacy-policy": "privacy-policy",
  "terms-of-service": "terms-of-service",
  warranty: "warranty",
  returns: "returns",
  "shipping-and-returns": "returns",
};

type InfoPageProps = {
  pageKey?: string;
  slug?: string;
};

const resolveContentKey = (key?: string) => {
  if (!key) return null;
  return CONTENT_KEY_MAP[key] ?? key;
};

export default function InfoPage({ pageKey, slug }: InfoPageProps) {
  const contentKey = resolveContentKey(pageKey ?? slug);
  const entry = contentKey ? LEGAL_CONTENT[contentKey] : undefined;

  if (!entry) {
    return <NotFound />;
  }

  return (
    <section className="bg-white text-gray-900">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24 flex justify-center">
        <div className="max-w-4xl w-full space-y-10 text-center">
          <header className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
              Policy
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {entry.title}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about how we operate, protect your
              data, and support your purchase.
            </p>
          </header>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-10 shadow-sm text-left">
            <article
              className="prose prose-slate max-w-none prose-headings:text-gray-900 prose-strong:text-gray-900 prose-a:text-[#0c57ef] prose-h3:mt-10 prose-h4:mt-6"
              dangerouslySetInnerHTML={{ __html: entry.content }}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600 mx-auto sm:mx-0">
              Still have questions? We are here to help.
            </div>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-end w-full sm:w-auto">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-white bg-[#0c57ef] hover:bg-[#0a47c2] transition-colors"
              >
                Contact support
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-[#0c57ef] bg-[#e8f2ff] hover:bg-[#d5e7ff] transition-colors"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
