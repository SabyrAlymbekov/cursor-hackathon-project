@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ── Summer palette ──────────────────────────────────────────────────── */
    --background:             36 60% 97%;   /* warm cream     #FFF8EE */
    --foreground:             224 41% 15%;  /* deep ink       #1E2A47 */

    --card:                   0 0% 100%;
    --card-foreground:        224 41% 15%;

    --popover:                0 0% 100%;
    --popover-foreground:     224 41% 15%;

    --primary:                5 95% 63%;    /* coral          #FF6B5B */
    --primary-foreground:     0 0% 100%;

    --secondary:              36 100% 62%;  /* amber/golden   #FFB347 */
    --secondary-foreground:   224 41% 15%;

    --muted:                  30 45% 92%;   /* sandy muted    #F5E8D8 */
    --muted-foreground:       224 18% 48%;  /* soft ink */

    --accent:                 175 62% 45%;  /* teal           #2EC4B6 */
    --accent-foreground:      0 0% 100%;

    --destructive:            0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    --border:                 30 28% 83%;   /* warm tan       #E8C9A8 */
    --input:                  30 28% 83%;
    --ring:                   5 95% 63%;    /* coral ring */

    --radius: 0.75rem;

    --font-sans:    "General Sans", ui-sans-serif, system-ui, sans-serif;
    --font-serif:   ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
    --font-mono:    ui-monospace, "Cascadia Code", monospace;
    --font-display: "Clash Display", ui-sans-serif, system-ui, sans-serif;

    /* Warm shadows */
    --shadow-sm:  0 1px 3px 0 hsl(5 60% 50% / 0.12), 0 1px 2px -1px hsl(5 60% 50% / 0.10);
    --shadow-md:  0 4px 12px -2px hsl(5 60% 50% / 0.14), 0 2px 4px -2px hsl(5 60% 50% / 0.10);
    --shadow-lg:  0 8px 24px -4px hsl(224 41% 15% / 0.16), 0 4px 8px -4px hsl(224 41% 15% / 0.10);
    --shadow-2xl: 0 16px 40px -8px hsl(224 41% 15% / 0.22);
  }

  .dark {
    --background:             224 41% 10%;
    --foreground:             36 60% 95%;

    --card:                   224 35% 15%;
    --card-foreground:        36 60% 95%;

    --popover:                224 35% 15%;
    --popover-foreground:     36 60% 95%;

    --primary:                5 95% 68%;
    --primary-foreground:     0 0% 100%;

    --secondary:              36 100% 65%;
    --secondary-foreground:   224 41% 10%;

    --muted:                  224 30% 18%;
    --muted-foreground:       224 15% 60%;

    --accent:                 175 62% 52%;
    --accent-foreground:      0 0% 100%;

    --destructive:            0 72% 55%;
    --destructive-foreground: 0 0% 100%;

    --border:                 224 25% 22%;
    --input:                  224 25% 22%;
    --ring:                   5 95% 68%;

    --font-sans:    "General Sans", ui-sans-serif, system-ui, sans-serif;
    --font-display: "Clash Display", ui-sans-serif, system-ui, sans-serif;
    --font-mono:    ui-monospace, "Cascadia Code", monospace;
    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-sans);
  }
  h1, h2, h3, h4 {
    font-family: var(--font-display);
  }
}
