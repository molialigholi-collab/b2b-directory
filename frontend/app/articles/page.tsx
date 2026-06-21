import Link from "next/link";
import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { PageIntro } from "@/components/page-intro";
import { getArticles } from "@/lib/api";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Articles",
  description: "Read industry articles published by companies in the B2B Directory Platform.",
  alternates: {
    canonical: absoluteUrl("/articles"),
  },
};

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div>
      <PageIntro eyebrow="Articles" title="Industry articles" description="Read company-linked articles from the Django articles endpoint." />
      {articles.length === 0 ? (
        <EmptyState title="No articles yet" message="Publish articles in Django admin and they will populate this list." />
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <article key={article.id} className="border border-line bg-white p-5 shadow-panel">
              <p className="text-xs font-semibold uppercase tracking-normal text-berry">
                {article.company_name || `Company #${article.company}`}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-ink">
                {article.slug ? (
                  <Link href={`/articles/${article.slug}`} className="transition hover:text-berry">
                    {article.title}
                  </Link>
                ) : (
                  article.title
                )}
              </h2>
              <p className="mt-3 line-clamp-4 text-sm leading-6 text-ink/70">{article.content}</p>
              {article.slug ? (
                <Link href={`/articles/${article.slug}`} className="mt-5 inline-flex text-sm font-semibold text-berry transition hover:text-ink">
                  Read article
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
