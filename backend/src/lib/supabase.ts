import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !anonKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
}

const hasServiceRoleKey =
  !!serviceRoleKey && serviceRoleKey !== 'your-service-role-key-here';

if (!hasServiceRoleKey) {
  console.warn(
    '\n⚠️  SUPABASE_SERVICE_ROLE_KEY is not set.\n' +
    '   Admin data routes will be limited until you add it.\n' +
    '   Get it from: Supabase Dashboard → Settings → API → service_role\n'
  );
}

// Auth client (anon key) — used for signInWithPassword and getUser.
export const supabaseAuth = createClient(supabaseUrl, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Admin client — uses service role key (bypasses RLS) when available,
// falls back to anon key so the server still starts without it.
export const supabaseAdmin = createClient(
  supabaseUrl,
  hasServiceRoleKey ? serviceRoleKey! : anonKey,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Create a per-request client scoped to the user's JWT so Supabase RLS applies.
export function createUserClient(accessToken: string) {
  return createClient(supabaseUrl!, anonKey!, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
