type WorkspacePlaceholderProps = {
  title: string;
  description: string;
};

export function WorkspacePlaceholder({
  title,
  description,
}: WorkspacePlaceholderProps) {
  return (
    <main className="min-h-svh bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">
          Private workspace
        </p>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      </div>
    </main>
  );
}
