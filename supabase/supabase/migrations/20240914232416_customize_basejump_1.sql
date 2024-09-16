create or replace function basejump.run_new_user_setup() 
returns trigger 
security definer
as $$
declare
    first_account_id    uuid;
    generated_user_name text;
begin
    -- first we setup the user profile
    -- TODO: see if we can get the user's name from the auth.users table once we learn how oauth works
    
    if new.raw_app_meta_data->>'provider' = 'google' then
        -- Faça algo se o provedor for 'google'
        generated_user_name := new.raw_user_meta_data->>'full_name';
    else
        generated_user_name := split_part(new.email, '@', 1);
    end if;

    -- create the new users's personal account
    insert into basejump.accounts (name, primary_owner_user_id, personal_account, id)
    values (generated_user_name, NEW.id, true, NEW.id) 
    returning id into first_account_id;

    -- add them to the account_user table so they can act on it
    insert into basejump.account_user (account_id, user_id, account_role)
    values (first_account_id, NEW.id, 'owner');

    return NEW;
end;
$$ language plpgsql;