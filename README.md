# Alessandro Admin Dashboard

Vite + React admin dashboard for the Alessandro Enterprises customer portal.
It reads live Supabase data only; it contains no mock data, local-storage data,
custom API client, or local backend dependency.

## Setup

```bash
npm install
```

Create `.env.local` from `.env.example` and supply the same Supabase URL and
anon/publishable key as the customer portal. Never use a service-role key in
this frontend.

## Admin access

The database migration uses `app_metadata.role = 'admin'` to determine who can
read and update all customer records. Create the admin auth user first, then
set that metadata from the Supabase SQL Editor (replace the email):

```sql
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
where email = 'admin@example.com';
```

Sign out and back in after applying the role so the user receives a new JWT.

## Deployment

For Vercel, set the project root to this dashboard folder and configure:

```text
Build Command: npm run build
Output Directory: dist
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Both environment variables must be available to the Production deployment.
