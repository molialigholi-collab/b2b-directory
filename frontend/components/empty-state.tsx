type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="border border-dashed border-line bg-white px-5 py-8 text-center shadow-panel">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-ink/65">{message}</p>
    </div>
  );
}
