# letitbingo — Project Specification

> Build spec for an AI coding agent (Cursor). Optimized for a **2-hour hackathon build** judged on: Problem & Idea, Functionality (works live), Use of Cursor/AI, Design & UX, Pitch, WOW factor.
> **Golden rule:** ship a *small but fully working* slice of the real flow with one wow-moment and a bold visual identity. Do NOT start features you can't finish.
> **Note on the "Use of Cursor/AI" criterion:** this measures how well the team builds *with* Cursor (the AI editor), not whether the app contains AI features. The app has **no in-product AI** — that's intentional and keeps the 2-hour scope safe. Drive Cursor with this spec as the source of truth.

---

## 1. Elevator Pitch

**letitbingo** turns a summer bucket list into a shared game. Someone creates a 5×5 bingo of summer challenges, drops the link in a group chat, and friends join. You complete squares in real life. Tapping a square shows posts from other people doing that same challenge ("looking for 2 people to hike Saturday — Telegram link"), so the board becomes a way to actually *find people and go do things*. Hit a line, share it to Instagram.

**One-line hook:** *A bucket list nobody finishes — turned into a game you play with friends and strangers.*

---

## 2. Canonical User Flow (the demo spine — make it work end to end)

1. A friend drops a **bingo link** in a group chat.
2. I open it and **register** (just name + emoji avatar — no password).
3. I **join** the shared bingo and see the board (title + grid of cells).
4. I **mark** the squares I've already done.
5. I see a square: **"Go on a hike."**
6. I **tap** it → a panel opens with **posts from other people** offering a hike, plus comments.
7. I follow a post's **Telegram link** to their group and go on the hike.
8. I come back and **mark the square done.**
9. I **share** the board to a friend and to my **Instagram story.**

Secondary: create a new bingo (pick a starter template or write your own); view a user's **profile** (TikTok-style page of their bingos).

---

## 3. Build Priorities (read first)

Build strictly in order; each phase must be demoable before the next.

1. **Open a shared bingo by link + lightweight register + see the board.** (the link flow — MUST WORK)
2. **Tap a square → panel with posts + comments + "Mark done".** (the heart of the product)
3. **Mark squares / line detection / celebration.** (the game feel)
4. **Share** — export board as image + copy link. (viral / "tell a friend")
5. **Create a bingo** — title + 24 challenges, via a starter template or manual entry → shareable link.
6. **Profile page** (TikTok-style). *(stretch)*
7. **Friends + friend-filtered posts.** *(low priority — cut unless time)*

If the clock runs out: a working 1→4 with **seeded posts** beats a half-built 1→7. See §11.

---

## 4. Architecture & Honest Scope Note

The shared-link scenario **requires a backend** — multiple users must see the same board and posts. Use **Supabase** (Postgres + instant REST API + optional Realtime). This is the single biggest time cost; budget for it.

- **"Register" = anonymous-lite.** On first visit, ask for name + emoji avatar, insert a `users` row, store `user.id` in `localStorage`. No Supabase Auth, no passwords, no email. (Turn RLS off / use permissive policies for the hackathon.)
- **Realtime is optional.** A refetch on open is fine. Add Supabase Realtime only if time remains (makes the demo feel live).
- **Fallback if backend gets risky (see §11):** seed posts as static data + keep your own progress in localStorage, and present it as multiplayer. The full story still demos.

**Stack:** Next.js (App Router) + TypeScript · Tailwind CSS · **Supabase JS client** · **Magic UI** (free, open-source components) on top of **shadcn/ui** primitives · **motion** (Framer Motion) · **html-to-image** (story export) · deploy on **Vercel**. No AI/LLM dependencies.

---

## 5. Data Model (Supabase)

```
users        : id (uuid pk), name, avatar (emoji), created_at
bingos       : id (uuid pk), title, squares (jsonb: [{id, text}] length 25),
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

- `/` — **Landing / Create**: hero with the brand, a short value prop, and two paths: **"Start a bingo"** (pick a starter template or write your own → creates a bingo, returns a shareable link) and **"I have a link."**
- `/b/[id]` — **The shared board** (main screen). If no local user → inline register (name + emoji), then join. Renders the bingo table + this user's progress. Has a Share button.
  - **Square panel** = a modal / bottom sheet *inside* this page (not a separate route): shows the challenge, a list of posts (author, body, Telegram link, comments), a "Post something" action, and a **Mark done** toggle. Include an "Everyone / Friends" tab (Friends is stretch, defaults to Everyone).
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

## 8. UI Component Library (the wow layer)

Use **Magic UI** — it's free and open-source (MIT); only their pre-made *templates* are paid, the components are free. Install from the Magic UI registry (https://magicui.design) on top of shadcn/ui primitives. Free alternatives if you want more: **Aceternity UI**, **Cult UI**.

Map components to moments:
- **Confetti** → full bingo line celebration (signature moment).
- **Particles** / **Meteors** → ambient landing-hero background.
- **Animated Gradient Text** / **Aurora Text** → the brand in the hero.
- **Shimmer / Rainbow Button** → primary CTAs.
- **Number Ticker** → "X / 24" progress.
- **Border Beam / Shine Border** → highlight a completed line on the board.

Don't ship raw shadcn defaults — every interactive element should feel summery and alive.

---

## 9. Design Direction (commit hard — carries Design & WOW)

Avoid the generic AI look (no Inter/Roboto, no purple-on-white, no timid palettes). Chosen aesthetic: **"sun-bleached retro postcard"** — playful, warm, like a 70s travel sticker pack. The name *letitbingo* is a wink ("let it be / let it bingo") — keep the tone light and joyful.

- **Color (CSS vars):** sunset spine coral `#FF6B5B` → amber `#FFB347` → peach; deep ink `#1E2A47` for text; sharp turquoise `#2EC4B6` for completed squares.
- **Type:** distinctive display font (e.g. **Clash Display** / **Cabinet Grotesk**, Fontshare, free) + clean body (**General Sans**). Big confident headline.
- **Texture:** subtle grain/noise overlay, soft shadows, slightly rounded "sticker" cells.
- **Signature interaction:** the BINGO line celebration. Make this one moment excellent — it's what judges remember and what makes people share.
- **Motion:** one staged page-load reveal (staggered cells) beats scattered micro-animations.

---

## 10. Create Flow (no AI — templates + manual)

Creating a bingo must be fast. On `/`:
- Offer **2–3 starter templates** as one-tap fills (editable after): e.g. "Adventure summer", "Chill summer", "Local — around Bishkek / Issyk-Kul". Store each as a hardcoded array of 24 challenge strings in the app.
- Or **write your own**: a simple grid of 24 text inputs + a title field.
- Center (id 12) is always the free space.
- On save → insert into `bingos`, redirect to `/b/[id]`, surface the shareable link + a "copy link" button immediately.

---

## 11. Build Order for the 2 Hours (agent checklist)

- [ ] **0:00–0:30** Scaffold Next + Tailwind + shadcn + Magic UI. Fonts + color vars. Create Supabase project, run table SQL, add client + env keys. Seed one demo bingo + a few posts (so the square panel is never empty on stage).
- [ ] **0:30–1:10** `/b/[id]`: load bingo + completions, render the bingo table, register-on-first-visit (name + emoji), mark-done toggle, line detection + Confetti.
- [ ] **1:10–1:40** Square panel: posts list (body + author + Telegram link) + comments + "post" action, wired to Supabase.
- [ ] **1:40–1:55** Share: `html-to-image` board → PNG + copy-link button.
- [ ] **1:55–2:00** Landing + create-from-template → new bingo → shareable link. Deploy to Vercel and smoke-test the full link flow on the live URL.
- [ ] **If time left:** `/u/[id]` TikTok-style profile; Realtime subscriptions; Friends filter.

**Cut order under time pressure:** Friends → Profile → Realtime → fancy create flow (use the seeded bingo instead) → keep 1–4 working no matter what.

---

## 12. Bingo Line Detection (logic)

Indices 0–24, row-major. Bingo = any fully-completed line:
- rows `[0–4]…[20–24]`, columns `[0,5,10,15,20]…[4,9,14,19,24]`, diagonals `[0,6,12,18,24]` and `[4,8,12,16,20]`.
- Center (12) counts as completed (free). On each toggle, detect a *newly* completed line → fire confetti once per line.

---

## 13. Demo Script (3-min pitch)

1. **Hook (15s):** "Everyone makes a summer bucket list. Nobody finishes it. We made it a game you play with your friends."
2. **The link (75s):** Open a shared bingo link on stage → register in 2 seconds → board appears. Tap the **"Go on a hike"** square → show real posts from others with a Telegram link. This is the core "aha".
3. **Win it (45s):** Mark squares → hit a line → confetti + BINGO → export the Instagram story image.
4. **Create (15s):** Back on landing, one tap on a template → a fresh shareable board.
5. **Close (10s):** "It's live — scan this, start your summer." (QR to the Vercel URL.)

---

## 14. Definition of Done (MVP)

- [ ] Open a shared bingo by link; register with name + emoji; see the same board as others
- [ ] Bingo rendered as a titled table with cells; mark squares done; progress + line celebration
- [ ] Tap a square → panel with others' posts (+ Telegram link) and comments
- [ ] Share board as an image + copyable link
- [ ] Bold, cohesive "retro postcard" identity — not generic
- [ ] Deployed to a public Vercel URL

Keep it simple. Make it beautiful. Make the link → tap-a-square → find-people moment unforgettable.