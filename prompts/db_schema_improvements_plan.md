# DB Schema Improvements Plan

## Overview

This document tracks the normalization and structural improvements applied to the ATS database schema. Each item follows a bottom-up approach: **DB layer → domain model → validator → tests**, with a mandatory self-audit loop (generate → compile → test) after every item.

---

## Item 1 — Move `companyDescription` to `Company` (3NF fix)

**Problem:** `Position.companyDescription` is a transitive dependency (`positionId → companyId → companyDescription`). A company's description duplicates across every position it owns; a single update requires touching all rows.

**Fix:** Remove `companyDescription` from `Position`. Add `description String? @db.Text` to `Company`.

| Layer | Change |
|---|---|
| DB | Migration `move_company_description` |
| Domain model | New `src/domain/models/Company.ts` |
| Validator | N/A (no existing Position/Company service) |
| Tests | New `src/domain/models/Company.test.ts` |

---

## Item 2 — Enum constraints for domain strings

**Problem:** `Position.status`, `Position.employmentType`, `Application.status`, and `Interview.result` are free-text strings with no enforced value set. Inconsistencies like `"Rejected"` vs `"rejected"` are silently accepted.

**Fix:** Replace with Prisma-native enums backed by PostgreSQL enum types.

| Enum | Values |
|---|---|
| `PositionStatus` | `Draft`, `Open`, `Closed`, `Archived` |
| `EmploymentType` | `Full_time`, `Part_time`, `Contract`, `Internship` |
| `ApplicationStatus` | `Pending`, `Reviewing`, `Interview`, `Offered`, `Rejected` |
| `InterviewResult` | `Pass`, `Fail`, `No_show` |

| Layer | Change |
|---|---|
| DB | Migration `add_domain_enums` |
| Domain model | N/A |
| Validator | Add `validatePositionStatus`, `validateEmploymentType`, `validateApplicationStatus`, `validateInterviewResult` to `validator.ts` |
| Tests | New cases in `validator.test.ts` |

---

## Item 3 — `InterviewStep` ordering uniqueness

**Problem:** Two steps in the same `InterviewFlow` can share the same `orderIndex`, silently corrupting the ordering logic.

**Fix:** Add `@@unique([interviewFlowId, orderIndex])` to `InterviewStep`.

| Layer | Change |
|---|---|
| DB | Migration `interviewstep_unique_order` |
| Validator | N/A |
| Tests | New `src/domain/models/InterviewStep.test.ts` |

---

## Item 4 — `Application` duplicate prevention

**Problem:** A candidate can submit multiple applications to the same position with no DB-level guard.

**Fix:** Add `@@unique([candidateId, positionId])` to `Application`. Policy: one application per candidate per position (no reapplying).

| Layer | Change |
|---|---|
| DB | Migration `application_unique_candidate_position` |
| Validator | N/A |
| Tests | New `src/domain/models/Application.test.ts` |

---

## Item 5 — `InterviewFlow` add `name` field

**Problem:** `InterviewFlow` only has a `description` (non-nullable VarChar(255)), making it serve as both identifier and description. Listing flows in a UI degrades to showing long description blobs.

**Fix:** Add `name String @db.VarChar(100)`. Make `description` optional.

| Layer | Change |
|---|---|
| DB | Migration `interviewflow_add_name` |
| Validator | N/A |
| Tests | New `src/domain/models/InterviewFlow.test.ts` |

---

## Item 6 — `Interview.score` bounded constraint (1–10)

**Problem:** `Interview.score` is an unbounded `Int?`. A score of `999` is as valid as `5` at the DB level.

**Fix:** Add a PostgreSQL `CHECK` constraint via raw SQL migration (Prisma has no native CHECK support). Add `validateScore` to the validator layer.

| Layer | Change |
|---|---|
| DB | Migration `interview_score_check` with raw SQL `CHECK (score IS NULL OR (score >= 1 AND score <= 10))` |
| Validator | Add `validateScore` to `validator.ts` |
| Tests | New cases in `validator.test.ts` |

---

## Items Deferred

| Item | Reason |
|---|---|
| `Position.contactInfo` → FK to `Employee` | Named relation complexity with multiple Employee→Position paths; deferred to reduce risk |
| `Candidate.address` → `city`/`state`/`country` | Touches existing production code and 4 test files; deferred for a dedicated refactor |
