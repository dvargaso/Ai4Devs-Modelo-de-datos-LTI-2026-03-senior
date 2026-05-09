---
name: prisma-db-schema
description: >
  Use  when the user wants to define, update, or evolve a PostgreSQL database schema in a Prisma project. Triggers: adding/modifying models, columns, or relations; pasting an ERD; asking about normalization or indexes; requesting any structural DB change.
tags: [prisma, postgresql, schema, db, database, SQL, DDL]
---

# Prisma DB Schema

## Context
- Schema: `backend/prisma/schema.prisma`
- DB MCP: use `dv-lti-db-hw` (`execute_sql`, `search_objects`) to validate real DB state before and after changes

## Workflow

### 1. Understand
- Read `backend/prisma/schema.prisma`.
- Query live DB via MCP to confirm actual state matches schema.
- Restate intent as a short list. **Wait for user confirmation before continuing.**

### 2. Validate
Surface issues before drafting:
- Conflicts with existing models/fields/relations (cross-check schema + MCP).
- Missing `@id`, unnamed `@relation`
- Unindexed FKs — Prisma does **not** auto-index foreign keys in PostgreSQL.

### 3. Draft & Iterate
- Show only new/changed models with `//` comments for non-obvious decisions.
- Ask for approval. Iterate until confirmed, then apply to `schema.prisma`.
- After applying: `npx prisma migrate dev --name <name>` → `npx prisma generate`.\
- Enforce ACID: atomic migrations, DB-level consistency constraints, isolation-aware locking on large tables.

### 4. Optimize (opt-in)
- **Indexes:** suggest for unindexed FKs and common filter patterns.
- **Normalization:** ask about query patterns first; suggest only where trade-offs are clear.

---

## Breaking Changes — Always Audit

Require explicit confirmation before applying:
- **Drop** column/model → data loss.
- **Type change** → cast failure risk.
- **Rename** → shadow rename vs. direct (direct = destructive migration).
- **Cascade/relation change** → check downstream impact.
- Use MCP to verify no live data is affected before proceeding.
