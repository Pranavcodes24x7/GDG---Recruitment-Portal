# GDG on Campus VIT Chennai — Recruitment Portal

👉 Deployed Live Link of the Recruitment Portal Website - https://gdg-portal-phi.vercel.app/

A production-minded recruitment portal for **GDG on Campus, VIT Chennai**. The project turns a basic application site into a polished, accessible candidate experience with reliable application storage, protected review workflows, and a clear path to deployment.

The portal supports 12 departments: Management, Publicity, Outreach, UI/UX, Creatives, Web Dev, App Dev, Game Dev, Data Science, Blockchain, Cloud & DevOps, and Competitive Programming.

## What I improved

 - Rebuilt the portal into a polished, responsive GDG on Campus VIT Chennai recruitment experience with a clear candidate journey from discovery to submission.
- Added Google OAuth and email/password authentication so that students can sign in with Google easily, keeping credentials securely outside the codebase.
- Implemented an accessible Day / Night mode that remembers the user’s preference.
- Expanded the platform to support all 12 official departments with tailored descriptions, skills, and application questions.
- Fixed the hidden backend data-loss bug: the required motivation response was shown in the form but never stored; it is now validated and persisted.
- Reworked application submission into one atomic operation, preventing partial saves when applying to multiple departments.
- Added deterministic application IDs and idempotent requests to prevent duplicate submissions and double-click race conditions.
- Secured the backend with server-side session checks, role-protected admin routes, validation through Zod, and deny-by-default Firestore rules.
- Built a protected admin review workflow with applicant search, filters, shortlist actions, and safer email delivery controls.
- Verified the full local application journey end-to-end: authentication, department selection, form validation, successful submission, saved submission status, and production build.

## A quick look at the engineering decisions

The original implementation sent one request per selected department. If one request failed, a candidate could be left with an incomplete application; two simultaneous requests could also bypass the two-department limit. The upgraded flow validates the complete application once and commits it atomically.

This project deliberately treats security and data consistency as product features, not afterthoughts. A candidate should never lose a response they were asked to write, and a reviewer should never need to guess whether a record is complete.

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router), React 18 |
| Authentication | Better Auth, Google OAuth, email/password |
| Data layer | Cloud Firestore via Firebase Admin SDK |
| Validation | Zod, server-side canonical question validation |
| UI | Custom responsive CSS, Lucide icons, `next-themes` |
| Admin communication | Nodemailer |
| Local preview | In-memory demo adapter when Firebase credentials are unavailable |

## Project structure

```text
app/
├── page.jsx                         # Landing page
├── (pages)/departments/             # Department selector
├── (pages)/join/[...joinIds]/       # Candidate application journey
├── (pages)/admin/                   # Server-protected review desk
├── auth/                            # Sign-in and sign-out routes
└── api/                             # Authenticated server endpoints
    ├── submit-form/                 # Validation + atomic persistence
    ├── check-applications/          # Candidate submission status
    ├── admin/applicants/            # Protected applicant data
    └── shortlist/ + send-email/     # Protected review actions

components/                          # Candidate UI, admin UI, theme controls
constants/index.js                   # 12 departments + canonical questions
lib/auth.js                          # Better Auth and Google provider setup
lib/server-auth.js                   # Shared session and role guards
lib/local-demo-store.js              # Local-only preview persistence
firestore.rules                      # Deny-by-default Firestore policy
WORK.md                              # Detailed technical change log
```

## Run locally

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
npm run dev
```

For a production-like data setup, add Firebase service-account credentials in `.env.local`. For a credential-free local preview, the documented local demo configuration keeps submissions only in server memory; it is intentionally cleared when the server restarts.

## What was the Hidden backend Error which was solved 
- The original form displayed the required question: “Why do you want to join Organization Name?”
- But when submitting, it never added that answer to basicDetails or Questions.
- The backend therefore accepted the application but permanently discarded that response.
- This was fixed

## For reviewers

`WORK.md` contains the full implementation rationale, the original hidden bug analysis, data model, security model, and verification notes. It is intended to make the trade-offs in this project easy to inspect and discuss.
