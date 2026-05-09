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