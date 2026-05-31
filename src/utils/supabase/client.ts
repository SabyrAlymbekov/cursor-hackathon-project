import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

// Fallback prevents build-time crash when env vars are not yet set in Vercel.
// Real values must be added in Vercel project → Settings → Environment Variables.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "placeholder_key";

export const createClient = () =>
  createBrowserClient<Database>(supabaseUrl, supabaseKey);
