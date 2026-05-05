type WorkspacePlaceholderProps = {
  title: string;
  description: string;
};

export function WorkspacePlaceholder({
  title,
  description,
}: WorkspacePlaceholderProps) {
  return (
    <section className="min-h-[calc(100svh-9rem)] rounded-md border border-border bg-card p-5 text-card-foreground sm:p-8">
      <div className="flex max-w-3xl flex-col gap-4">
        <p className="text-sm font-medium text-muted-foreground">
          Private workspace
        </p>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
      </div>
    </section>
  );
}
