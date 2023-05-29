import { Database } from "@ai/types/supabase.types";
import { createClient } from "@supabase/supabase-js";

export default createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
