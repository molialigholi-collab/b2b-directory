import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticles } from "@/lib/api";

type ArticleDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.filter((article) => article.slug).map((article) => ({ slug: article.slug as string }));
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await getArticle(slug).catch(() => null);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Link href="/articles" className="inline-flex text-sm font-semibold text-berry transition hover:text-ink">
        Back to articles
      </Link>

      <article className="space-y-6">
        {article.image ? (
          <div className="flex min-h-64 items-center justify-center border border-line bg-white shadow-panel">
            <img src={article.image} alt={article.title} className="max-h-[420px] w-full object-contain p-4" />
          </div>
        ) : null}

        <header className="border-b border-line pb-8">
          <p className="text-sm font-semibold uppercase tracking-normal text-berry">Article</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-normal text-ink sm:text-4xl">{article.title}</h1>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-ink/65">
            {article.company_name ? (
              article.company_slug ? (
                <Link href={`/companies/${article.company_slug}`} className="font-semibold text-teal transition hover:text-ink">
                  {article.company_name}
                </Link>
              ) : (
                <span>{article.company_name}</span>
              )
            ) : null}
            <span>{dateFormatter.format(new Date(article.created_at))}</span>
          </div>
        </header>

        <div className="max-w-4xl whitespace-pre-wrap text-base leading-8 text-ink/75">{article.content}</div>
      </article>
    </div>
  );
}
