# Skill set up 


You are an expert in DB related skills for JS based project with the prisma ORM  and postgres DB

I created a base skill for my relational DB schema management. I added what's important to me

I want you to audit it and propose improvements based on the project structure. Review the readme.md for guidance

I want to use the "dv-lti-db-hw" db mcp for validatipn and performing actual operations in the db

I want to keep the skill simple and short


Goals:

Identify gaps, risks, and unnecessary complexity
Propose concise improvements
Keep the skill simple and short
Use the dv-lti-db-hw DB MCP to validate findings and perform real DB operations when needed

Return:

Key issues
Recommended improvements
A revised short version of the skill



# Initial request: 

I want to update my db definition acoording to the following erDiagram:

"erDiagram
COMPANY {
int id PK
string name
}
EMPLOYEE {
int id PK
int company_id FK
string name
string email
string role
boolean is_active
}
POSITION {
int id PK
int company_id FK
int interview_flow_id FK
string title
text description
string status
boolean is_visible
string location
text job_description
text requirements
text responsibilities
numeric salary_min
numeric salary_max
string employment_type
text benefits
text company_description
date application_deadline
string contact_info
}
INTERVIEW_FLOW {
int id PK
string description
}
INTERVIEW_STEP {
int id PK
int interview_flow_id FK
int interview_type_id FK
string name
int order_index
}
INTERVIEW_TYPE {
int id PK
string name
text description
}
CANDIDATE {
int id PK
string firstName
string lastName
string email
string phone
string address
}
APPLICATION {
int id PK
int position_id FK
int candidate_id FK
date application_date
string status
text notes
}
INTERVIEW {
int id PK
int application_id FK
int interview_step_id FK
int employee_id FK
date interview_date
string result
int score
text notes
}

     COMPANY ||--o{ EMPLOYEE : employs
     COMPANY ||--o{ POSITION : offers
     POSITION ||--|| INTERVIEW_FLOW : assigns
     INTERVIEW_FLOW ||--o{ INTERVIEW_STEP : contains
     INTERVIEW_STEP ||--|| INTERVIEW_TYPE : uses
     POSITION ||--o{ APPLICATION : receives
     CANDIDATE ||--o{ APPLICATION : submits
     APPLICATION ||--o{ INTERVIEW : has
     INTERVIEW ||--|| INTERVIEW_STEP : consists_of
     EMPLOYEE ||--o{ INTERVIEW : conducts
"



# Optimization Round

Plan and implement the fixes below one item at a time.

Approach:

Start at the data model layer
Propagate changes to validation and business logic
Update meaningful tests to match DB and logic changes
Do not change production code or DB definitions while writing tests
Run validation and tests after each item
Self-audit, fix issues, and repeat until the item is fully working

Process each task completely before moving to the next.

Tasks:

1. 3NF Violation — Position.companyDescription

Position.companyDescription is a transitive dependency: positionId → companyId → companyDescription. A company's description is a property of Company, not of each job posting. If a company has 10 positions, this text duplicates 10 times and any
update requires touching all rows.

Fix: move companyDescription to Company.

  ---
2. Uncontrolled domain strings (domain integrity)

Three string fields have no enforced value set, allowing silent inconsistencies like "Rejected" vs "rejected" vs "REJECTED":

┌─────────────┬────────────────┬───────────────────────────────────────┐
│    Table    │     Column     │            Example values             │
├─────────────┼────────────────┼───────────────────────────────────────┤
│ Position    │ status         │ Draft, Open, Closed, Archived         │
├─────────────┼────────────────┼───────────────────────────────────────┤
│ Position    │ employmentType │ Full-time, Part-time, Contract        │
├─────────────┼────────────────┼───────────────────────────────────────┤
│ Application │ status         │ Pending, Reviewing, Offered, Rejected │
├─────────────┼────────────────┼───────────────────────────────────────┤
│ Interview   │ result         │ Pass, Fail, No-show                   │
└─────────────┴────────────────┴───────────────────────────────────────┘

Fix: PostgreSQL enums or lookup tables. Prisma supports native enum declarations.

  ---
3. Type mismatch — Education and WorkExperience dates

Education.startDate, Education.endDate, WorkExperience.startDate, WorkExperience.endDate are all TIMESTAMP WITHOUT TIME ZONE — but a graduation date or job start has no meaningful time component. Should be DATE.

┌─────────────┬────────────────┬───────────────────────────────────────┐
│    Table    │     Column     │            Example values             │
├─────────────┼────────────────┼───────────────────────────────────────┤
│ Position    │ status         │ Draft, Open, Closed, Archived         │
├─────────────┼────────────────┼───────────────────────────────────────┤
│ Position    │ employmentType │ Full-time, Part-time, Contract        │
├─────────────┼────────────────┼───────────────────────────────────────┤
│ Application │ status         │ Pending, Reviewing, Offered, Rejected │
├─────────────┼────────────────┼───────────────────────────────────────┤
│ Interview   │ result         │ Pass, Fail, No-show                   │
└─────────────┴────────────────┴───────────────────────────────────────┘

Fix: PostgreSQL enums or lookup tables. Prisma supports native enum declarations.

  ---
3. Type mismatch — Education and WorkExperience dates

Education.startDate, Education.endDate, WorkExperience.startDate, WorkExperience.endDate are all TIMESTAMP WITHOUT TIME ZONE — but a graduation date or job start has no meaningful time component. Should be DATE.

  ---
4. Missing uniqueness constraints

- InterviewStep (interviewFlowId, orderIndex) — two steps in the same flow can have the same orderIndex, which would silently corrupt the ordering logic. Needs @@unique([interviewFlowId, orderIndex]).
- Application (candidateId, positionId) — a candidate can submit duplicate applications to the same position. Whether this is intentional (reapplying after rejection) or a bug depends on your business rules — worth deciding explicitly.

  ---
5. Structural gaps for ATS use

- Position.contactInfo (free text VarChar(255)) — in an ATS the contact for a position is an Employee. This should be a nullable FK contactEmployeeId → Employee.
- InterviewFlow has no name — only description (non-nullable VarChar(255)). Listing flows in a UI means showing long descriptions. A short name field is missing.
- Interview.score (unbounded Int) — no CHECK constraint on valid range (e.g., 1–10). A score of 999 is as valid as 5 at the DB level.
- Candidate.address (single VarChar(100)) — unqueryable for geographic filtering. For ATS use (filter candidates by city/country), this should be split into city, state, country.
