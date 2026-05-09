---
name: prisma-db-schema
description: >
  Use when the user wants to define or change a PostgreSQL schema in a Prisma
  project: new models, fields, relations, indexes, or constraints. Accepts plain
  language or ERD diagrams. Do NOT use for queries, migrations, or app logic.
tags: [prisma, postgresql, schema]
---

# Prisma DB Schema

## Workflow

### 1. Understand
- Auto-read `schema.prisma` (try `prisma/schema.prisma`, `src/prisma/schema.prisma`).
- Restate intent as a short list. **Wait for user confirmation before continuing.**

### 2. Validate
Check and surface issues before drafting:
- Conflicts with existing models/fields/relations.
- Missing `@id`, unnamed `@relation`, missing referential actions (`onDelete`/`onUpdate`).
- Unbounded types where an enum fits; missing `createdAt`/`updatedAt` where appropriate.

### 3. Draft & Iterate
- Show only new/changed models, with inline `//` comments for non-obvious decisions.
- Ask for approval. Iterate until confirmed, then apply to `schema.prisma`.

### 4. Optimize (opt-in, offer separately)
- **Indexes:** suggest for unindexed FKs and common filter patterns. Note: Prisma does not auto-index foreign keys in PostgreSQL.
- **Normalization:** ask about query patterns first. Only suggest where redundancy is clear and trade-offs are acceptable.

---

##  Breaking Changes — Always Audit

Before applying any of the following, describe the risk and require explicit user confirmation:

- **Drop** column/model → data loss warning.
- **Type change** → cast failure risk.
- **Rename** → clarify shadow rename vs. direct (direct = destructive migration).
- **Relation/cascade change** → check downstream impact.