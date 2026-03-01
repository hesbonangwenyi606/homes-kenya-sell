# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
# homes-kenya-sell

## Environment Setup

This app reads Supabase credentials from Vite environment variables.

1. Copy `.env.example` to `.env.local`
2. Set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

Do not put database direct connection strings or service role secrets in frontend env files.

## Supabase Database Setup (New Project)

If this is a fresh Supabase project, run the SQL script below in Supabase SQL Editor:

- [`db/supabase-init.sql`](./db/supabase-init.sql)

This creates:
- `public.saved_properties` for favorites
- `public.property_inquiries` for inquiry submissions
- `public.contact_leads` for the wide contact form
- `public.newsletter_subscribers` for footer subscriptions
- Required RLS policies and indexes
