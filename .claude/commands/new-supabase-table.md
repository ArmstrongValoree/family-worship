# New Supabase Table
Create a new Supabase table with full RLS setup.

Steps:
1. Write the SQL migration with:
   - id uuid primary key default gen_random_uuid()
   - created_at timestamptz default now()
   - All specified columns with correct types
2. Enable RLS on the table
3. Write RLS policies for:
   - SELECT: household members can read their own household data
   - INSERT: authenticated users only
   - UPDATE: role-based (HH or owner only)
   - DELETE: HH only
4. Add the TypeScript type to src/types/index.ts
5. Add a hook in src/hooks/ if data fetching is needed
6. Commit: feat(db): add [table_name] table with RLS policies
