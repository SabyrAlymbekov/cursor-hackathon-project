import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CreateBingo } from "./create-client";

export const metadata = { title: "Create a bingo — letitbingo" };

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/register?next=/create");

  const { template } = await searchParams;

  return <CreateBingo userId={user.id} defaultTemplate={template} />;
}
