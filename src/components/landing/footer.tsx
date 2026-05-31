export function Footer() {
  return (
    <footer className="border-t-2 border-[var(--color-border)] bg-[var(--color-cream)] px-4 py-10 text-center">
      <p
        className="text-2xl font-bold text-[var(--color-ink)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        letit<span className="text-[var(--color-coral)]">bingo</span>
      </p>
      <p className="mt-2 text-sm text-[var(--color-ink)] opacity-40">
        Make this summer unforgettable. ☀️
      </p>
    </footer>
  );
}
