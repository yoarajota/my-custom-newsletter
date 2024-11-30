-- Function to test if a user is subscribed to a newsletter topic
CREATE OR REPLACE FUNCTION public.is_subscribed_to_newsletter_topic(user_id UUID, newsletter_topic_id UUID)
  RETURNS BOOLEAN AS
$func$
DECLARE
  subscribed BOOLEAN;
BEGIN
    SELECT
        EXISTS(
        SELECT 1
        FROM
            public.newsletters_topics_accounts_subscriptions
        WHERE
            newsletters_topics_accounts_subscriptions.newsletter_topic_id = is_subscribed_to_newsletter_topic.newsletter_topic_id
            AND newsletters_topics_accounts_subscriptions.account_id = (
                select basejump.accounts.id from basejump.accounts where primary_owner_user_id = user_id
            )
        )
    INTO subscribed;
    RETURN subscribed;
END
$func$ LANGUAGE plpgsql;

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
  newsletter_topic_id UUID NOT NULL references newsletters_topics(id) on delete cascade on update no action
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
create policy "Authenticated can select" on public.newsletters_topics_emails
    for select
    to authenticated
    using (is_subscribed_to_newsletter_topic(auth.uid(), newsletter_topic_id));

-- get all emails subscribed to a newsletter topic
CREATE OR REPLACE FUNCTION public.get_emails_subscribed(newsletter_topic_id UUID)
    RETURNS TABLE(email character varying, name text)
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $func$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        u.email,
        ba.name
    FROM 
        public.newsletters_topics_accounts_subscriptions nte
    JOIN 
        basejump.accounts ba 
        ON nte.account_id = ba.id
    JOIN 
        auth.users u
        ON ba.primary_owner_user_id = u.id
    WHERE 
        nte.newsletter_topic_id = get_emails_subscribed.newsletter_topic_id;
END
$func$;