-- topics table for newsletters

CREATE TABLE newsletters_topic_files_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  newsletter_topic_id UUID NOT NULL references newsletters_topics(id) on delete cascade on update no action,
  content TEXT NOT NULL,
  url TEXT NOT NULL,
  UNIQUE (newsletter_topic_id, url)
);

-- enable RLS on the table
ALTER TABLE public.newsletters_topic_files_contents ENABLE ROW LEVEL SECURITY;

-- --------------
-- Postgres should be able to create records that are owned by an account they belong to
-- --------------
create policy "Postgres can insert" on public.newsletters_topic_files_contents
    for insert
    to postgres
    with check (true);
    
-- --------------
-- Postgres user should be able to read all records regardless of account
-- --------------
create policy "Postgres can select" on public.newsletters_topic_files_contents
    for select
    to postgres
    using (true);

CREATE TABLE newsletters_topics_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  html text NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  newsletter_topic_id UUID NOT NULL references newsletters_topics(id) on delete cascade on update no action,
);

-- enable RLS on the table
ALTER TABLE public.newsletters_topics_emails ENABLE ROW LEVEL SECURITY;

-- --------------
-- Postgres should be able to create records that are owned by an account they belong to
-- --------------
create policy "Postgres can insert" on public.newsletters_topics_emails
    for insert
    to postgres
    with check (true);

----------------
-- Postgres should be able to delete records that are owned by an account they belong to
----------------
create policy "Postgres can delete" on public.newsletters_topics_emails
    for delete
    to postgres
    using (true);

---------------
-- Postgres should be able to update records that are owned by an account they belong to
---------------
create policy "Postgres can update" on public.newsletters_topics_emails
    for update
    to postgres
    using (true);

----------------
-- Authenticated users should be able to read all records regardless of account
----------------
create policy "Authenticated can select" on public.newsletters_accounts_topic_subscription
    for select
    to authenticated
    using (true);    