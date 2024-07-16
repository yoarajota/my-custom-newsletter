## Only allow account members to view posts

create policy "Only members can view posts" on posts
    for select
    to authenticated
    using (
        (account_id IN ( SELECT basejump.get_accounts_with_role()))
    );


## Allow only account owners to update posts

create policy "Only owners can update posts" on posts
    for update
    to authenticated
    using (
        (account_id IN ( SELECT basejump.get_accounts_with_role('owner')))
    );

## Authenticated users should be able to read all records regardless of account

create policy "All logged in users can select" on posts
    for select
    to authenticated
    using (true);

## Authenticated AND Anon users should be able to read all records regardless of account

create policy "All authenticated and anonymous users can select" on posts
    for select
    to authenticated, anon
    using (true);

## Users should be able to read records that are owned by an account they belong to

create policy "Account members can select" on posts
    for select
    to authenticated
    using (
        (account_id IN ( SELECT basejump.get_accounts_with_role()))
    );

## Users should be able to create records that are owned by an account they belong to

create policy "Account members can insert" on posts
    for insert
    to authenticated
    with check (
        (account_id IN ( SELECT basejump.get_accounts_with_role()))
    );

## Users should be able to update records that are owned by an account they belong to

create policy "Account members can update" on posts
    for update
    to authenticated
    using (
        (account_id IN ( SELECT basejump.get_accounts_with_role()))
    );

## Users should be able to delete records that are owned by an account they belong to

create policy "Account members can delete" on posts
    for delete
    to authenticated
    using (
        (account_id IN ( SELECT basejump.get_accounts_with_role()))
    );

## Only account OWNERS should be able to delete records that are owned by an account they belong to

create policy "Account owners can delete" on posts
    for delete
    to authenticated
    using (
        (account_id IN ( SELECT basejump.get_accounts_with_role('owner')))
    );
