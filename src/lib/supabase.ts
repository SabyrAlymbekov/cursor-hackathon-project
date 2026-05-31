// Re-export the browser client for convenience in client components.
// For Server Components, import from @/utils/supabase/server instead.
export { createClient } from "@/utils/supabase/client";

// Named singleton for client components that don't need per-request isolation.
import { createClient as _create } from "@/utils/supabase/client";
export const supabase = _create();
