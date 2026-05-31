# Summer Bingo — Project Specification (v2: multiplayer)

> Build spec for an AI coding agent (Cursor). Optimized for a **2-hour hackathon build** judged on: Problem & Idea, Functionality (works live), Use of AI, Design & UX, Pitch, WOW factor.
> **Golden rule:** ship a *small but fully working* slice of the real flow with one wow-moment and a bold visual identity. Do NOT start features you can't finish.

---

## 1. Elevator Pitch

**Summer Bingo** turns a summer bucket list into a shared game. Someone creates a 5×5 bingo of summer challenges (AI can fill it from a vibe), drops the link in a group chat, and friends join. You complete squares in real life. Tapping a square shows posts from other people doing that same challenge ("looking for 2 people to hike Saturday — Telegram link"), so the board becomes a way to actually *find people and go do things*. When you hit a line, you share it to Instagram.

**One-line hook for the pitch:** *A bucket list nobody finishes — turned into a game you play with friends and strangers.*

---

## 2. Canonical User Flow (this is the demo spine — make it work end to end)

1. A friend drops a **bingo link** in a group chat.
2. I open it and **register** (just name + emoji avatar — no password).
3. I **join** the shared bingo and see the board (title + grid of cells).
4. I **mark** the squares I've already done.
5. I see a square: **"Go on a hike."**
6. I **tap** it → a panel opens with **posts from other people** offering a hike, plus comments.
7. I follow a post's **Telegram link** to their group and go on the hike.
8. I come back and **mark the square done.**
9. I **share** the board to a friend and to my **Instagram story.**

Secondary flows: create a new bingo (AI or manual); view a user's **profile** (TikTok-style page of their bingos).

---

## 3. Build Priorities (read this first)

Build strictly in order; each phase must be demoable before the next.

1. **Open a shared bingo by link + lightweight register + see the board.** (the link flow — MUST WORK)
2. **Tap a square → panel with posts + comments + "Mark done".** (the heart of the product)
3. **Mark squares / line detection / celebration.** (the game feel)
4. **Share** — export board as image + copy link. (viral / "tell a friend")
5. **AI generator** in the create flow — vibe → 24 challenges. (AI criterion + wow)
6. **Profile page** (TikTok-style). *(stretch)*
7. **Friends + friend-filtered posts.** *(low priority — cut unless time)*

If the clock runs out: a working 1→4 with **seeded posts** beats a half-built 1→7. See §11.

---

## 4. Architecture & Honest Scope Note

The shared-link scenario **requires a backend** — multiple users must see the same board and the same posts. Use **Supabase** (Postgres + instant REST + optional Realtime). This is the single biggest time cost; budget for it.

- **"Register" = anonymous-lite.** On first visit, ask for name + emoji avatar, insert a `users` row, store `user.id` in `localStorage`. No Supabase Auth, no passwords, no email. (Turn RLS off / use permissive policies for the hackathon.)
- **Realtime is optional.** A plain refetch on open is fine. Add Supabase Realtime only if time remains (it makes the demo feel live).
- **Fallback if backend gets risky (see §11):** seed posts as static data + keep your own progress in localStorage, and present it as multiplayer. The full story still demos.

Stack: **Next.js (App Router) + TypeScript**, **Tailwind**, **shadcn/ui** (base), **Magic UI** (wow layer), **motion** (Framer Motion), **Supabase JS client**, **html-to-image** (story export), **Anthropic Claude API** via a Next.js server route. Deploy on **Vercel**.

---

## 5. Data Model (Supabase)

```
users        : id (uuid pk), name, avatar (emoji), created_at
bingos       : id (uuid pk), title, vibe, squares (jsonb: [{id, text}] length 25),
               created_by (users.id), created_at
completions  : id, bingo_id, user_id, square_id, created_at   -- one row = user did a square
posts        : id, bingo_id, square_id, user_id, body, tg_link, created_at
comments     : id, post_id, user_id, body, created_at
friendships  : id, user_id, friend_id, created_at             -- stretch only
```

Rendering the board for user U on bingo B:
- cells come from `B.squares`
- completed set = `completions` where `bingo_id = B.id AND user_id = U.id`
- tapping square S → `posts` where `bingo_id = B.id AND square_id = S` (+ their comments)

Center square (id 12) is a fixed free space ("FREE — it's summer ☀️").

---

## 6. Pages / Routes

- `/` — **Landing / Create**: hero, an AI vibe input ("Describe your summer…") + example chips, "Build a bingo" CTA (creates a bingo, returns a shareable link), and an "I have a link" path.
- `/b/[id]` — **The shared board** (main screen). If no local user → inline register (name + emoji), then join. Renders the bingo table + this user's progress. Has Share button.
  - **Square panel** = a modal / bottom sheet *inside* this page (not a separate route): shows the challenge, a list of posts (each with author, body, Telegram link, comments), a "Post something" action, and a **Mark done** toggle. Include an "Everyone / Friends" tab (Friends is stretch, defaults to Everyone).
- `/u/[id]` — **Profile** *(stretch)*: TikTok-style full-viewport vertical snap-scroll of this user's bingos with progress.

Share link = `/b/[id]`. Story export = render the board node → PNG via `html-to-image`.

---

## 7. The Bingo Board UI ("table with a title and cells")

Render it as a classic bingo table, not generic cards:
- A **title bar** across the top (the bingo's name), styled like a retro stamp/header.
- Optional **B-I-N-G-O column letters** above the grid for instant recognizability.
- **5×5 grid** of square cells. Each cell: short challenge text, a tap target, a clear completed state (turquoise fill + stamp/check). Center cell is the free space.
- A small **avatar row** showing who's joined this bingo.
- A **progress counter** ("X / 24") using Magic UI **Number Ticker**.

Interactions:
- Tap a cell → opens the square panel (posts/comments/mark done).
- Marking done → satisfying flip + stamp; updates `completions`.
- Completing a full line → full-screen **Confetti** + big **"BINGO!"** + an immediate "Share this" prompt.

---

## 8. Magic UI Components (wow layer over shadcn)

Install from the Magic UI registry (https://magicui.design). Map to moments:
- **Confetti** → full bingo line celebration (signature moment).
- **Particles** / **Meteors** → ambient landing-hero background.
- **Animated Gradient Text** / **Aurora Text** → product name in hero.
- **Shimmer / Rainbow Button** → primary CTAs.
- **Number Ticker** → "X / 24" progress.
- **Border Beam / Shine Border** → highlight a completed line on the board.

Don't ship raw shadcn defaults — every interactive element should feel summery and alive.

---

## 9. Design Direction (commit hard — carries Design & WOW)

Avoid the generic AI look (no Inter/Roboto, no purple-on-white, no timid palettes). Chosen aesthetic: **"Sun-bleached retro postcard"** — playful, warm, like a 70s travel sticker pack.

- **Color (CSS vars):** sunset spine coral `#FF6B5B` → amber `#FFB347` → peach; deep ink `#1E2A47` for text; sharp turquoise `#2EC4B6` for completed squares.
- **Type:** distinctive display font (e.g. **Clash Display** / **Cabinet Grotesk**, Fontshare, free) + clean body (**General Sans**). Big confident headline.
- **Texture:** subtle grain/noise overlay, soft shadows, slightly rounded "sticker" cells.
- **Signature interaction:** the BINGO line celebration. Make this one moment excellent — it's what judges remember and what makes people share.
- **Motion:** one staged page-load reveal (staggered cells) beats scattered micro-animations. When AI generates a board, stagger the cells filling in (feels magical).

---

## 10. AI Bingo Generator (AI criterion, lives in the create flow)

Landing vibe input → server route → 24 personalized challenges → board fills with a staggered reveal.

`app/api/generate/route.ts` (Node runtime). Key in `ANTHROPIC_API_KEY`, **server-side only**. System instruction:

```
You generate summer bingo challenges. Given a vibe, return EXACTLY 24 short,
fun, doable real-life challenges (3–6 words each), varied in effort, no numbering,
no duplicates, summery. Return ONLY a JSON array of 24 strings, nothing else.
```

Use the latest Claude **Sonnet** model (check https://docs.claude.com/en/docs/about-claude/models). Strip code fences before `JSON.parse`; on failure retry once, then fall back to a hardcoded default board so the demo never crashes. Center (id 12) is always the free space.

---

## 11. Build Order for the 2 Hours (agent checklist)

- [ ] **0:00–0:30** Scaffold Next + Tailwind + shadcn + Magic UI. Fonts + color vars. Create Supabase project, run the table SQL, add client + env keys. Seed one demo bingo + a few posts (so the panel is never empty on stage).
- [ ] **0:30–1:05** `/b/[id]`: load bingo + completions, render the bingo table, register-on-first-visit (name + emoji), mark-done toggle, line detection + Confetti.
- [ ] **1:05–1:35** Square panel: posts list (body + author + Telegram link) + comments + "post" action, wired to Supabase.
- [ ] **1:35–1:50** Share: `html-to-image` board → PNG + copy-link button.
- [ ] **1:50–2:00** Landing + AI generate → new bingo → shareable link. Deploy to Vercel and smoke-test the full link flow on the live URL.
- [ ] **If time left:** `/u/[id]` TikTok-style profile; Realtime subscriptions; Friends filter.

**Cut order under time pressure:** Friends → Profile → Realtime → AI generate (replace with the seeded bingo) → keep 1–4 working no matter what.

---

## 12. Bingo Line Detection (logic)

Indices 0–24, row-major. Bingo = any fully-completed line:
- rows `[0–4]…[20–24]`, columns `[0,5,10,15,20]…[4,9,14,19,24]`, diagonals `[0,6,12,18,24]` and `[4,8,12,16,20]`.
- Center (12) counts as completed (free). On each toggle, detect a *newly* completed line → fire confetti once per line.

---

## 13. Demo Script (3-min pitch)

1. **Hook (15s):** "Everyone makes a summer bucket list. Nobody finishes it. We made it a game you play with your friends."
2. **The link (60s):** Open a shared bingo link on stage → register in 2 seconds → board appears. Tap the **"Go on a hike"** square → show real posts from others with a Telegram link.
3. **Win it (45s):** Mark squares → hit a line → confetti + BINGO → export the Instagram story image.
4. **Create (30s):** Back on landing, type a vibe → AI fills a fresh board live.
5. **Close (15s):** "It's live — scan this, start your summer." (QR to the Vercel URL.)

---

## 14. Definition of Done (MVP)

- [ ] Open a shared bingo by link; register with name + emoji; see the same board as others
- [ ] Bingo rendered as a titled table with cells; mark squares done; progress + line celebration
- [ ] Tap a square → panel with others' posts (+ Telegram link) and comments
- [ ] Share board as an image + copyable link
- [ ] Bold, cohesive "retro postcard" identity — not generic
- [ ] Deployed to a public Vercel URL

Keep it simple. Make it beautiful. Make the link → tap-a-square → find-people moment unforgettable.