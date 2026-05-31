import Link from "next/link";

const NAV = [
  {
    heading: "Product",
    links: [
      { label: "Start a bingo",   href: "/create" },
      { label: "Browse templates", href: "/create" },
      { label: "Open a board",    href: "/auth/login" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign up",  href: "/auth/register" },
      { label: "Log in",   href: "/auth/login" },
      { label: "Profile",  href: "/u/me" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About",    href: "#" },
      { label: "Contact",  href: "#" },
      { label: "Privacy",  href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-primary-foreground">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="w-fit text-2xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              letit<span className="text-primary">bingo</span>
            </Link>
            <p className="text-sm leading-relaxed text-white/50 max-w-[200px]">
              Turn your summer bucket list into a shared game.
            </p>
            <p className="text-xs text-white/30 mt-auto">
              © {new Date().getFullYear()} letitbingo
            </p>
          </div>

          {/* Nav columns */}
          {NAV.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40"
              >
                {col.heading}
              </p>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom rule */}
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/30">
            Built for summer. Made with care.
          </p>
          <div className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-primary" />
            <span className="inline-block h-2 w-2 rounded-full bg-secondary" />
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
          </div>
        </div>
      </div>
    </footer>
  );
}
