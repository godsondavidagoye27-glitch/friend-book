# Phase 1 build prompt archive

This file preserves the original build guidance and the current hardening checkpoint for Amiora.

## Original app foundation task
- Keep the warm orange visual identity and mobile-first layout.
- Prioritize a safe, fast, one-handed experience before feature expansion.
- Do not implement Stripe, chat, maps, or push notifications yet.
- Use Supabase and Postgres RLS before broad feature work.

## Current review checkpoint
- Step 0: audit the repo, clean the stray log file, and document the known issues.
- Step 1: harden the mobile shell, remove unicode-only icons, and prepare the security migration for approval.
- Stop before applying any database migration. Only show the SQL for review first.
