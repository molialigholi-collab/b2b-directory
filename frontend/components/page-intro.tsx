type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <section className="mb-8 border-b border-line pb-8">
      <p className="text-sm font-semibold uppercase tracking-normal text-teal">{eyebrow}</p>
      <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-normal text-ink sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-ink/70">{description}</p>
    </section>
  );
}
