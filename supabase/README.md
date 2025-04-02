# POSTGRES DATABASE ARCHITECTURE

## Overview
This system is a comprehensive platform designed to manage newsletters, user accounts, and billing subscriptions within a **Single-Database Tenancy** architecture. It enables users to subscribe to specific newsletter topics, receive tailored email content, and handle account management with support for personal and team accounts. The billing system integrates seamlessly to manage premium features or subscriptions.

In this single-database tenancy model, all tenants (e.g., different organizations or teams) coexist in a single shared database. The `accounts` entity serves as the tenant identifier to distinguish between tenants, with data isolation enforced at the application level to ensure each tenant accesses only their relevant data, such as subscribed newsletter topics linked via `newsletters_topics_accounts_subscrip`. Shared resources like `newsletters_topics` are accessible across tenants unless restricted, while tenant-specific configurations and billing details are managed through entities like `billing_subscriptions` and `config`. This approach simplifies initial setup and resource management, making it ideal for smaller-scale SaaS applications, though it requires careful attention to scalability and performance as the number of tenants grows.

The architecture is divided into two primary modules:
1. **Newsletter Management**: Manages newsletter topics, content files, subscriptions, and email delivery.
2. **User and Billing Management**: Handles user authentication, account structures, invitations, and subscription billing.

## Architecture

### Newsletter Management
This module focuses on creating, managing, and delivering newsletters.

- **Entities:**
  - **`newsletters_topics`:**
    - **Fields**: `id` (uuid), `created_at` (timestamptz), `name` (text), `summary` (text), `seo_description` (text), `embedding` (vector)
    - **Purpose**: Defines newsletter topics with metadata and an embedding for advanced search or recommendations.
  - **`newsletters_topic_files_contents`:**
    - **Fields**: `id` (uuid), `created_at` (timestamptz), `newsletter_topic_id` (uuid), `content` (text), `url` (text)
    - **Purpose**: Stores content files associated with each topic.
  - **`newsletters_topics_accounts_subscrip`:**
    - **Fields**: `id` (uuid), `created_at` (timestamptz), `account_id` (uuid), `newsletter_topic_id` (uuid)
    - **Purpose**: Links user accounts to subscribed newsletter topics, enforcing tenant-specific data access.
  - **`newsletters_topics_emails`:**
    - **Fields**: `id` (uuid), `html` (text), `created_at` (timestamptz), `newsletter_topic_id` (uuid)
    - **Purpose**: Manages email templates or content for each topic.

### User and Billing Management
This module manages user authentication, account structures, and billing within the single-database tenancy model.

- **Entities:**
  - **`auth_users`:**
    - **Fields**: `id` (id)
    - **Purpose**: Central entity for user authentication.
  - **`accounts`:**
    - **Fields**: `id` (id), `primary_user_id` (id), `slug` (text), `personal_account` (boolean), `updated_at` (timestamp), `created_by` (id)
    - **Purpose**: Represents user accounts, acting as the tenant identifier for data isolation.
  - **`account_user`:**
    - **Fields**: `user_id`, `role`
    - **Purpose**: Associates users with accounts and defines their roles.
  - **`billing_subscriptions`:**
    - **Fields**: `id` (id), `account_id` (id), `billing_customer_id` (id), `status` (text), `metadata`, `price_id` (id), `quantity_period` (text), `cancel_at_period_end` (boolean), `created_at` (timestamp), etc.
    - **Purpose**: Manages subscription details, including trials and cancellations, scoped to each tenant.
  - **`billing_customers`:**
    - **Fields**: `id` (id), `email` (text), `active` (boolean), `provider` (text)
    - **Purpose**: Stores billing customer information.
  - **`invitations`:**
    - **Fields**: `id` (id), `account_id` (id), `invited_by_user_id` (id), `account_name` (text), `updated_at` (timestamp), `created_at` (timestamp), `invitation_type` (text)
    - **Purpose**: Handles invitations for users to join accounts.
  - **`config`:**
    - **Fields**: `enable_lean_sync` (boolean), `enable_personal_account` (boolean), `enable_team_account` (boolean)
    - **Purpose**: Provides configuration toggles for system features, applicable across tenants.

## Relationships
- **Newsletter Management:**
  - Each `newsletters_topics` entry can have multiple `newsletters_topic_files_contents` and `newsletters_topics_emails`.
  - `newsletters_topics_accounts_subscrip` links `newsletters_topics` to `accounts`, enabling subscription tracking with tenant isolation.
- **User and Billing Management:**
  - `auth_users` connects to `accounts` (via `primary_user_id`) and `account_user` (via `user_id`).
  - `accounts` links to `billing_subscriptions` and `invitations` via `account_id`.
  - `billing_subscriptions` connects to `billing_customers` via `billing_customer_id`.

## Design Considerations
- **Single-Database Tenancy**: All tenants share a single database, with `accounts` as the tenant identifier. Data isolation is enforced at the application level, ensuring secure access to tenant-specific data like subscriptions and billing.
- **Scalability**: UUIDs are used for primary and foreign keys to ensure uniqueness and support distributed systems. However, single-database tenancy requires careful performance optimization as tenant numbers grow.
- **Tracking**: Timestamps (`created_at`, `updated_at`) enable auditing and analytics.
- **Advanced Features**: The `embedding` field in `newsletters_topics` supports machine learning or semantic search.
- **Flexibility**: The `config` table allows toggling features like personal or team accounts.
- **Billing**: Detailed subscription management supports various states (e.g., trials, cancellations) and multiple providers, scoped to each tenant.

![supabase-schema-aahazsajyfzvlqguyjmj](https://github.com/user-attachments/assets/5de16355-c1c1-4ee4-8dd9-834c3a8bacda)
![supabase-schema-aahazsajyfzvlqguyjmj](https://github.com/user-attachments/assets/591fbf46-17e2-4dd6-9b1a-3dff1a49ccd1)


# SUPABASE SETUP

## Update
Update the Supabase package to the latest version:

```bash
npm update supabase --save-dev
```

## Test
Run database tests with Supabase. Use the `--help` flag for more options:

```bash
npx supabase test db --help
```

### pgTAP Extension
The test command includes support for the pgTAP extension.

## Generate Types
Generate TypeScript types from your local database schema:

```bash
npx supabase gen types typescript --local > schema.gen.ts
```

## Start
Start the Supabase services, ignoring health checks:

```bash
npx supabase start --ignore-health-check
```
