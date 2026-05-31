"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Share2, Check, X, Send, ExternalLink, ArrowLeft, Plus,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type Square = { id: number; text: string };
type Bingo = {
  id: string;
  title: string;
  squares: Square[];
  created_by: string;
  created_at: string;
};
type User = { id: string; name: string; avatar: string } | null;
type Post = {
  id: string;
  body: string;
  tg_link: string | null;
  created_at: string;
  user_id: string;
  author?: { name: string; avatar: string } | null;
};
type Comment = {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  author?: { name: string; avatar: string } | null;
};
type GridCell = { id: number; text: string; isFree: boolean };

// ─── Line detection ───────────────────────────────────────────────────────────

const LINES: number[][] = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

function getCompletedLines(done: Set<number>): Set<string> {
  const effective = new Set([...done, 12]);
  return new Set(
    LINES.filter((l) => l.every((p) => effective.has(p))).map((l) => l.join(","))
  );
}

function buildGrid(bingo: Bingo): GridCell[] {
  const map = new Map(bingo.squares.map((s) => [s.id, s.text]));
  return Array.from({ length: 25 }, (_, pos) =>
    pos === 12
      ? { id: 12, text: "FREE ☀️", isFree: true }
      : { id: pos, text: map.get(pos) ?? "", isFree: false }
  );
}

function fireConfetti() {
  confetti({
    particleCount: 180,
    spread: 80,
    origin: { y: 0.55 },
    colors: ["#FF6B5B", "#FFB347", "#2EC4B6", "#ffffff"],
    gravity: 1.1,
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  bingo: Bingo;
  user: User;
  initialCompletions: number[];
}

export function BingoBoard({ bingo, user, initialCompletions }: Props) {
  const router = useRouter();
  const grid = buildGrid(bingo);

  const [completedIds, setCompletedIds] = useState<Set<number>>(
    new Set(initialCompletions)
  );
  const [completedLines, setCompletedLines] = useState<Set<string>>(
    () => getCompletedLines(new Set(initialCompletions))
  );

  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);
  const [copied, setCopied]             = useState(false);
  const [copying, setCopying]           = useState(false);
  const [showBingo, setShowBingo]       = useState(false);

  // ── Toggle completion ──────────────────────────────────────────────────────

  const handleCellToggle = useCallback(
    async (cell: GridCell) => {
      if (cell.isFree) return;
      if (!user) {
        router.push(`/auth/register?next=/b/${bingo.id}`);
        return;
      }

      const wasDone = completedIds.has(cell.id);
      const newDone = new Set(completedIds);
      if (wasDone) {
        newDone.delete(cell.id);
      } else {
        newDone.add(cell.id);
      }

      const prevLines = getCompletedLines(completedIds);
      const newLines  = getCompletedLines(newDone);

      setCompletedIds(newDone);
      setCompletedLines(newLines);

      if (!wasDone && newLines.size > prevLines.size) {
        fireConfetti();
        setShowBingo(true);
        setTimeout(() => setShowBingo(false), 3500);
      }

      if (wasDone) {
        await supabase
          .from("completions")
          .delete()
          .eq("bingo_id", bingo.id)
          .eq("user_id", user.id)
          .eq("square_id", cell.id);
      } else {
        await supabase.from("completions").insert({
          bingo_id: bingo.id,
          user_id: user.id,
          square_id: cell.id,
        });
      }
    },
    [bingo.id, completedIds, user, router]
  );

  // ── Share (copy link) ─────────────────────────────────────────────────────

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Copy this bingo to own profile ────────────────────────────────────────

  async function copyBingo() {
    if (!user) {
      router.push(`/auth/register?next=/b/${bingo.id}`);
      return;
    }
    setCopying(true);
    const { data: nb } = await supabase
      .from("bingos")
      .insert({
        title: `${bingo.title} (my copy)`,
        squares: bingo.squares,
        created_by: user.id,
      })
      .select("id")
      .single();
    setCopying(false);
    if (nb) router.push(`/b/${nb.id}`);
  }

  // ── Determine which cells are in a completed line ─────────────────────────

  const highlightedCells = new Set<number>();
  for (const lineKey of completedLines) {
    lineKey.split(",").map(Number).forEach((p) => highlightedCells.add(p));
  }

  const isOwn = user?.id === bingo.created_by;
  const doneCount = completedIds.size;

  return (
    <main className="min-h-dvh bg-background">
      {/* Top nav */}
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> letitbingo
        </Link>
        <div className="flex items-center gap-2">
          {!isOwn && (
            <Button size="sm" variant="outline" onClick={copyBingo} disabled={copying}>
              {copying ? "Copying…" : "Copy to my profile"}
            </Button>
          )}
          <Button size="sm" onClick={copyLink}>
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {copied ? "Copied!" : "Share"}
          </Button>
        </div>
      </div>

      {/* Board */}
      <div className="mx-auto max-w-2xl px-4 pb-20">
        {/* Title bar */}
        <div className="mb-4 overflow-hidden rounded-2xl border-2 border-border bg-primary px-6 py-4 text-center shadow-md">
          <p className="mb-0.5 text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground/60">
            B · I · N · G · O
          </p>
          <h1
            className="text-2xl font-bold text-primary-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {bingo.title}
          </h1>
          <p className="mt-1 text-sm text-primary-foreground/70">
            {doneCount} / 24 done
          </p>
        </div>

        {/* 5×5 grid */}
        <div className="grid grid-cols-5 gap-1.5">
          {grid.map((cell) => {
            const done    = cell.isFree || completedIds.has(cell.id);
            const inLine  = highlightedCells.has(cell.id);

            return (
              <motion.button
                key={cell.id}
                onClick={() => setSelectedCell(cell)}
                whileTap={{ scale: 0.93 }}
                className={cn(
                  "relative flex min-h-[4.5rem] flex-col items-center justify-center rounded-xl border-2 px-1 py-2 text-center text-[10px] font-semibold leading-tight transition-all duration-200 sm:min-h-[5rem] sm:text-xs",
                  done && !cell.isFree
                    ? "border-accent bg-accent text-accent-foreground shadow-sm"
                    : cell.isFree
                    ? "border-accent/40 bg-accent/10 text-accent"
                    : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5",
                  inLine && "ring-2 ring-secondary ring-offset-1"
                )}
              >
                {done && !cell.isFree && (
                  <span className="absolute right-1 top-1 text-[10px] leading-none opacity-80">✓</span>
                )}
                {cell.text}
              </motion.button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs font-medium text-muted-foreground">
            <span>Progress</span>
            <span className="text-accent">{doneCount} / 24</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-accent"
              animate={{ width: `${(doneCount / 24) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Hint if not logged in */}
        {!user && (
          <div className="mt-4 rounded-xl border-2 border-dashed border-border bg-card p-4 text-center text-sm text-muted-foreground">
            <Link href={`/auth/register?next=/b/${bingo.id}`} className="font-semibold text-primary hover:underline">
              Join for free
            </Link>{" "}
            to mark squares and track your progress.
          </div>
        )}
      </div>

      {/* BINGO celebration overlay */}
      <AnimatePresence>
        {showBingo && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="rounded-3xl bg-primary px-12 py-8 text-center shadow-2xl">
              <p
                className="text-7xl font-bold text-primary-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                BINGO!
              </p>
              <p className="mt-2 text-primary-foreground/80">Line complete 🎉</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Square detail panel */}
      <AnimatePresence>
        {selectedCell && (
          <SquarePanel
            cell={selectedCell}
            bingo={bingo}
            user={user}
            isDone={selectedCell.isFree || completedIds.has(selectedCell.id)}
            onToggle={() => {
              handleCellToggle(selectedCell);
              setSelectedCell(null);
            }}
            onClose={() => setSelectedCell(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

// ─── Square panel (bottom sheet) ─────────────────────────────────────────────

interface PanelProps {
  cell: GridCell;
  bingo: Bingo;
  user: User;
  isDone: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function SquarePanel({ cell, bingo, user, isDone, onToggle, onClose }: PanelProps) {
  const [posts, setPosts]       = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [postBody, setPostBody] = useState("");
  const [tgLink, setTgLink]     = useState("");
  const [commentBody, setCommentBody]   = useState<Record<string, string>>({});
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [submitting, setSubmitting]     = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function load() {
      const { data: rawPosts } = await supabase
        .from("posts")
        .select("*")
        .eq("bingo_id", bingo.id)
        .eq("square_id", cell.id)
        .order("created_at", { ascending: false });

      if (!rawPosts?.length) { setPosts([]); return; }

      const uids = [...new Set(rawPosts.map((p) => p.user_id))];
      const { data: users } = await supabase
        .from("users")
        .select("id, name, avatar")
        .in("id", uids);
      const userMap = new Map((users ?? []).map((u) => [u.id, u]));

      setPosts(rawPosts.map((p) => ({ ...p, author: userMap.get(p.user_id) ?? null })));
    }
    load();
  }, [bingo.id, cell.id]);

  async function loadComments(postId: string) {
    if (comments[postId]) { setExpandedPost(postId); return; }
    const { data: rawComments } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (!rawComments?.length) { setComments((c) => ({ ...c, [postId]: [] })); setExpandedPost(postId); return; }

    const uids = [...new Set(rawComments.map((c) => c.user_id))];
    const { data: users } = await supabase.from("users").select("id, name, avatar").in("id", uids);
    const userMap = new Map((users ?? []).map((u) => [u.id, u]));

    setComments((prev) => ({
      ...prev,
      [postId]: rawComments.map((c) => ({ ...c, author: userMap.get(c.user_id) ?? null })),
    }));
    setExpandedPost(postId);
  }

  async function submitPost() {
    if (!user || !postBody.trim()) return;
    setSubmitting(true);
    const { data: newPost } = await supabase
      .from("posts")
      .insert({
        bingo_id: bingo.id,
        square_id: cell.id,
        user_id: user.id,
        body: postBody.trim(),
        tg_link: tgLink.trim() || null,
      })
      .select("*")
      .single();
    setSubmitting(false);
    if (newPost) {
      setPosts((p) => [{ ...newPost, author: user }, ...p]);
      setPostBody("");
      setTgLink("");
    }
  }

  async function submitComment(postId: string) {
    if (!user || !commentBody[postId]?.trim()) return;
    const body = commentBody[postId].trim();
    const { data: newComment } = await supabase
      .from("comments")
      .insert({ post_id: postId, user_id: user.id, body })
      .select("*")
      .single();
    if (newComment) {
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] ?? []), { ...newComment, author: user }],
      }));
      setCommentBody((prev) => ({ ...prev, [postId]: "" }));
    }
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[85dvh] flex-col overflow-hidden rounded-t-3xl border-t-2 border-border bg-background shadow-2xl"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Challenge
            </p>
            <h2
              className="mt-0.5 text-xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {cell.text}
            </h2>
          </div>
          <button onClick={onClose} className="mt-1 rounded-full p-1.5 hover:bg-muted">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Mark done toggle */}
        {!cell.isFree && (
          <div className="px-5 pb-3">
            <button
              onClick={onToggle}
              className={cn(
                "w-full rounded-xl border-2 py-2.5 text-sm font-semibold transition-all",
                isDone
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-primary bg-primary text-primary-foreground hover:brightness-110"
              )}
            >
              {isDone ? "✓ Done — tap to undo" : "Mark as done ✓"}
            </button>
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {/* Post form */}
          {user && (
            <div className="mb-5 rounded-2xl border-2 border-border bg-card p-4">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">Share with the group</p>
              <textarea
                ref={textareaRef}
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
                placeholder="Tell others about it — looking for people, tips, etc."
                rows={2}
                className="w-full resize-none rounded-lg border-2 border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <input
                value={tgLink}
                onChange={(e) => setTgLink(e.target.value)}
                placeholder="Telegram group link (optional)"
                className="mt-2 w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <div className="mt-2 flex justify-end">
                <Button size="sm" onClick={submitPost} disabled={submitting || !postBody.trim()}>
                  <Send className="h-3.5 w-3.5" />
                  {submitting ? "Posting…" : "Post"}
                </Button>
              </div>
            </div>
          )}

          {/* Posts list */}
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </p>

          {posts.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No posts yet — be the first!
            </p>
          )}

          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <div key={post.id} className="rounded-2xl border-2 border-border bg-card p-4">
                {/* Author + body */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-2xl leading-none">{post.author?.avatar ?? "🙂"}</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground">
                      {post.author?.name ?? "Unknown"}
                    </p>
                    <p className="mt-0.5 text-sm text-foreground">{post.body}</p>
                    {post.tg_link && (
                      <a
                        href={post.tg_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20"
                      >
                        <ExternalLink className="h-3 w-3" /> Telegram group
                      </a>
                    )}
                  </div>
                </div>

                {/* Comments toggle */}
                <button
                  onClick={() =>
                    expandedPost === post.id
                      ? setExpandedPost(null)
                      : loadComments(post.id)
                  }
                  className="mt-3 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  {expandedPost === post.id ? "Hide comments" : `Show comments${comments[post.id] ? ` (${comments[post.id].length})` : ""}`}
                </button>

                {/* Comments */}
                {expandedPost === post.id && (
                  <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                    {(comments[post.id] ?? []).map((c) => (
                      <div key={c.id} className="flex items-start gap-2">
                        <span className="text-lg leading-none">{c.author?.avatar ?? "🙂"}</span>
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground">{c.author?.name}</p>
                          <p className="text-xs text-foreground">{c.body}</p>
                        </div>
                      </div>
                    ))}

                    {user && (
                      <div className="mt-1 flex gap-2">
                        <input
                          value={commentBody[post.id] ?? ""}
                          onChange={(e) =>
                            setCommentBody((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          placeholder="Add a comment…"
                          className="flex-1 rounded-lg border-2 border-input bg-background px-3 py-1.5 text-xs focus:border-primary focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              submitComment(post.id);
                            }
                          }}
                        />
                        <button
                          onClick={() => submitComment(post.id)}
                          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
