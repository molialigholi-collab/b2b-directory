type SearchFormProps = {
  action: string;
  defaultValue?: string;
  placeholder: string;
};

export function SearchForm({ action, defaultValue = "", placeholder }: SearchFormProps) {
  return (
    <form action={action} className="mb-6 flex flex-col gap-3 border border-line bg-white p-4 shadow-panel sm:flex-row">
      <input
        type="search"
        name="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="min-h-11 flex-1 border border-line bg-paper px-3 text-sm text-ink outline-none transition placeholder:text-ink/45 focus:border-teal"
      />
      <button type="submit" className="min-h-11 border border-teal bg-teal px-5 text-sm font-semibold text-white transition hover:bg-ink">
        Search
      </button>
      {defaultValue ? (
        <a href={action} className="inline-flex min-h-11 items-center justify-center border border-line px-5 text-sm font-semibold text-ink transition hover:border-teal hover:text-teal">
          Clear
        </a>
      ) : null}
    </form>
  );
}
