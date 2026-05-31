import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { BingoBoard } from "./bingo-board";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("bingos").select("title").eq("id", id).single();
  return { title: data ? `${data.title} — letitbingo` : "letitbingo" };
}

export default async function BingoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: bingo } = await supabase
    .from("bingos")
    .select("*")
    .eq("id", id)
    .single();

  if (!bingo) notFound();

  const { data: { user } } = await supabase.auth.getUser();

  let completedSquareIds: number[] = [];
  let dbUser: { id: string; name: string; avatar: string } | null = null;

  if (user) {
    const [{ data: completions }, { data: userRow }] = await Promise.all([
      supabase
        .from("completions")
        .select("square_id")
        .eq("bingo_id", id)
        .eq("user_id", user.id),
      supabase
        .from("users")
        .select("id, name, avatar")
        .eq("id", user.id)
        .single(),
    ]);
    completedSquareIds = completions?.map((c) => c.square_id) ?? [];
    dbUser = userRow;
  }

  return (
    <BingoBoard
      bingo={bingo}
      user={dbUser}
      initialCompletions={completedSquareIds}
    />
  );
}
