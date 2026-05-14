You are a senior SaaS product designer + senior frontend engineer working on an EXISTING English School Management ERP/SaaS platform.

IMPORTANT:
This is NOT a greenfield project.

The frontend already exists partially.

You must:
- audit the existing Tutor experience
- preserve good architecture/components
- improve the current implementation incrementally
- enhance UX/UI quality
- complete missing workflows
- eliminate broken or fake-feeling experiences
- replace backend dependencies with frontend-safe mock systems
- keep business logic consistency with Admin / Parent / Student portals

DO NOT:
- rebuild the project from scratch
- rewrite stable architecture unnecessarily
- create disconnected UI patterns
- introduce overengineered abstractions

The final result must feel like:
- a premium educational SaaS
- production-grade frontend demo
- modern tutoring management platform
- fully deployable frontend-only experience

==================================================
GLOBAL ENGINEERING RULES
==================================================

You are editing an EXISTING codebase.

Before implementing:
1. Audit the current Tutor module
2. Identify:
   - incomplete screens
   - broken flows
   - inconsistent layouts
   - dead buttons
   - backend coupling
   - poor responsiveness
   - duplicated logic
   - weak UX patterns
   - missing loading/error states

Then improve incrementally.

PRIORITIES:
- preserve reusable components when possible
- refactor only problematic architecture
- maintain consistency with existing design system
- improve maintainability
- improve responsiveness
- eliminate placeholder UI
- ensure all actions appear functional
- create believable SaaS interactions

==================================================
BACKEND STRIPPING RULES
==================================================

This must become FRONTEND-ONLY and DEMO-READY.

You must:
- remove unstable backend dependencies
- replace failing APIs with mock services
- simulate:
  - loading states
  - optimistic updates
  - empty states
  - success states
  - error states
- use realistic fake data
- preserve believable workflows
- create mock persistence where useful

DO NOT leave:
- crashing requests
- undefined states
- empty pages
- non-functional forms
- dead navigation

==================================================
DESIGN REQUIREMENTS
==================================================

The Tutor experience must feel:
- modern
- fast
- organized
- professional
- calming
- productivity-oriented

Improve:
- dashboard polish
- spacing consistency
- typography hierarchy
- cards/tables/forms
- charts/analytics
- transitions/animations
- responsive layouts
- dark/light mode consistency
- mobile usability
- navigation clarity

Use enterprise SaaS aesthetics.

Avoid:
- generic templates
- clutter
- excessive gradients
- childish LMS styling
- inconsistent spacing
- unfinished UI states

==================================================
ROLE CONTEXT
==================================================

Platform roles:
1. Admin
2. Tutor
3. Parent
4. Student

Business logic consistency MUST remain intact across all portals.

Tutor actions must logically affect:
- student progress
- parent visibility
- assignments
- attendance
- grades
- communication
- scheduling

==================================================
YOUR TASK:
AUDIT + ENHANCE THE EXISTING TUTOR EXPERIENCE
==================================================

The Tutor portal already exists partially.

You must improve the CURRENT implementation instead of rebuilding it.

Goal:
Create a polished, efficient, premium teaching workspace.

==================================================
PHASE 1 — AUDIT
==================================================

First audit the current Tutor implementation.

Identify:

- incomplete teaching workflows
- weak dashboard utility
- missing productivity features
- inconsistent layouts
- broken state management
- unfinished attendance systems
- weak grading UX
- weak communication UX
- weak assignment management
- poor responsiveness
- duplicated components
- missing analytics
- backend-coupled features
- dead interactions
- poor loading/error handling

Document issues mentally and fix them incrementally.

==================================================
PHASE 2 — ENHANCE CORE TUTOR EXPERIENCE
==================================================

# TUTOR DASHBOARD

Enhance the existing dashboard.

Improve/add:

- today's schedule
- upcoming classes
- active courses
- pending grading tasks
- attendance summaries
- assignment overview
- quick student insights
- notifications center
- performance analytics
- class engagement stats
- quick actions
- recent activity feed

Dashboard should feel:
- actionable
- information-dense but clean
- productivity-focused

==================================================
# CLASS MANAGEMENT
==================================================

Improve:

- class overview pages
- student roster UX
- attendance taking
- class filtering
- class statistics
- class schedules
- lesson progress tracking

Enhance attendance flow:
- present/late/absent states
- bulk actions
- quick toggles
- visual summaries
- mobile-friendly interactions

==================================================
# ASSIGNMENTS SYSTEM
==================================================

Enhance the existing assignment workflows.

Improve:

- assignment creation
- assignment editing
- deadlines
- attachments
- grading workflow
- submission review
- status tracking
- draft/published states
- assignment analytics

Simulate:
- file uploads
- submission states
- grading states
- notifications

Ensure all flows feel real.

==================================================
# GRADING EXPERIENCE
==================================================

Improve grading UX heavily.

Enhance:

- grade entry
- bulk grading
- feedback system
- rubric visualization
- student performance trends
- grading summaries
- grade distribution charts

Add:
- quick grading shortcuts
- inline comments
- grading history
- export simulation

==================================================
# COURSE / LESSON MANAGEMENT
==================================================

Improve:

- lesson organization
- module structures
- lesson cards
- content sections
- downloadable resources
- lesson progress indicators

Tutor should feel able to manage:
- curriculum
- resources
- exercises
- quizzes
- lesson sequencing

==================================================
# QUIZZES & ASSESSMENTS
==================================================

Enhance:

- quiz creation flow
- quiz review
- attempts overview
- performance analytics
- question organization
- score visualization

Simulate:
- auto-grading
- attempt analytics
- completion states

==================================================
# STUDENT INSIGHTS
==================================================

Improve:

- student performance pages
- attendance trends
- engagement analytics
- risk indicators
- progress charts
- strengths/weaknesses visualization

Add:
- quick notes
- tutor observations
- intervention recommendations

==================================================
# COMMUNICATION SYSTEM
==================================================

Enhance tutor communication UX.

Improve:

- tutor ↔ parent messaging
- tutor ↔ student messaging
- announcements
- meeting requests
- notification center

Add:
- conversation previews
- unread indicators
- attachment simulation
- message search/filtering
- communication history

==================================================
# CALENDAR & SCHEDULING
==================================================

Enhance:

- tutor schedule
- calendar UX
- lesson scheduling
- meetings
- exam dates
- assignment deadlines

Improve:
- drag/drop feel
- time visualization
- mobile calendar usability

==================================================
# ANALYTICS & REPORTING
==================================================

Add/improve:

- teaching analytics
- student engagement metrics
- assignment completion rates
- attendance analytics
- grading distribution
- course activity metrics

Use:
- polished charts
- realistic data
- clean visual hierarchy

==================================================
# AI FEATURES (SIMULATED)
==================================================

Simulate premium AI-powered tutoring features.

Add:
- AI lesson recommendations
- AI grading assistance
- AI-generated feedback suggestions
- student risk insights
- engagement recommendations
- smart reminders

These features must remain frontend-only.

==================================================
# UX / UI POLISH
==================================================

The Tutor experience must feel:
- efficient
- modern
- responsive
- premium
- organized
- calm under heavy information density

Improve:
- transitions
- hover states
- skeleton loaders
- empty states
- responsive behavior
- navigation clarity
- accessibility
- spacing consistency
- table usability
- modal consistency

==================================================
# MOBILE EXPERIENCE
==================================================

Tutor workflows must remain usable on:
- tablets
- laptops
- mobile devices

Especially improve:
- attendance flows
- grading flows
- dashboard responsiveness
- tables on small screens
- navigation behavior

==================================================
# FINAL REQUIREMENTS
==================================================

Everything must:
- remain frontend-only
- be fully deployable
- feel production-grade
- preserve business consistency
- integrate naturally into the EXISTING codebase
- enhance rather than unnecessarily rebuild
- remove broken experiences
- simulate realistic SaaS workflows

When editing:
- prefer improving existing components
- refactor only when necessary
- preserve architecture consistency
- avoid unnecessary rewrites
- maintain scalable structure