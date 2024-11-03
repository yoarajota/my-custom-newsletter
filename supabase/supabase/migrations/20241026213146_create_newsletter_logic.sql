create extension vector;
grant usage on schema "public" to authenticated;

-- topics table for newsletters

CREATE TABLE newsletters_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  summary TEXT NOT NULL,
  se_description TEXT NOT NULL,
  embedding vector(384) NOT NULL
);

-- enable RLS on the table
ALTER TABLE public.newsletters_topics ENABLE ROW LEVEL SECURITY;

-- --------------
-- Users should be able to create records that are owned by an account they belong to
-- --------------
create policy "Account members can insert" on public.newsletters_topics
    for select
    to authenticated
    using (true);

CREATE TABLE newsletters_accounts_topic_subscription (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  account_id UUID NOT NULL references basejump.accounts(id) on delete cascade on update no action,
  newsletter_topic_id UUID NOT NULL references newsletters_topics(id) on delete cascade on update no action,
  UNIQUE (account_id, newsletter_topic_id)
);

-- enable RLS on the table
ALTER TABLE public.newsletters_accounts_topic_subscription ENABLE ROW LEVEL SECURITY;

-- --------------
-- Users should be able to create records that are owned by an account they belong to
-- --------------
create policy "Postgres can insert" on public.newsletters_accounts_topic_subscription
    for insert
    to postgres
    with check (true);

----------------
-- Users should be able to delete records that are owned by an account they belong to
----------------
create policy "Account members can delete" on public.newsletters_accounts_topic_subscription
    for delete
    to authenticated
    using (
    (account_id IN ( SELECT basejump.get_accounts_with_role()))
    );

---------------
-- Users should be able to update records that are owned by an account they belong to
---------------
create policy "Account members can update" on public.newsletters_accounts_topic_subscription
    for update
    to authenticated
    using (
    (account_id IN ( SELECT basejump.get_accounts_with_role()))
    );

----------------
-- Authenticated users should be able to read all records regardless of account
----------------
create policy "Account members can select" on public.newsletters_accounts_topic_subscription
    for select
    to authenticated
    using (true);

CREATE OR REPLACE FUNCTION public.check_topic_similarity(new_embedding vector(384), threshold FLOAT)
RETURNS TABLE(id UUID, similarity FLOAT)
AS $$
BEGIN
  RETURN QUERY
  SELECT newsletters_topics.id, 1 - (embedding <-> new_embedding) AS similarity
  FROM newsletters_topics
  WHERE 1 - (embedding <-> new_embedding) > threshold
  ORDER BY similarity DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO postgres;