select dbdev.install('basejump-basejump_core');
create extension "basejump-basejump_core"
    version '2.0.1';

-- To enable team accounts, set team_accounts_enabled to true in the basejump.config table.
-- UPDATE basejump.config SET team_accounts_enabled = true;