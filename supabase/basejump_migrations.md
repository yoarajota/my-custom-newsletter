## Creating new protected tables
One of the primary benefits of Supabase is the ability to leverage RLS to restrict access to tables and data. Basejump makes it easy to create tables that can only be accessed by account members or owners.

npx @usebasejump/cli@latest generate table posts

## You can also list out any additional columns you want to add to the table.

npx @usebasejump/cli@latest generate table posts title body published:boolean published_at:date