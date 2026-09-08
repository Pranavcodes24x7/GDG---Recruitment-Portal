# GDG on Campus VIT Chennai — Recruitment Portal

A production-minded recruitment portal for **GDG on Campus, VIT Chennai**. The project turns a basic application site into a polished, accessible candidate experience with reliable application storage, protected review workflows, and a clear path to deployment.

The portal supports 12 departments: Management, Publicity, Outreach, UI/UX, Creatives, Web Dev, App Dev, Game Dev, Data Science, Blockchain, Cloud & DevOps, and Competitive Programming.

## What I improved

- **Designed a complete candidate experience** — responsive landing page, department discovery, focused application flow, confirmation state, and an accessible Day / Night theme.
- **Added a real authentication journey** — email/password sign-in plus Google OAuth support, with configuration kept outside source control.
- **Fixed the hidden response-storage bug** — the old form showed a required motivation question but never included its answer in the submitted payload. It is now validated and stored as `profile.motivation`.
- **Made submission reliable** — selected departments are submitted as one validated request in a Firestore transaction, preventing partial saves and race conditions.
- **Prevented duplicates safely** — deterministic application IDs and request IDs make retries idempotent and enforce one application per candidate/department.
- **Protected sensitive operations** — applicant identity comes from the server session, admin tools require an admin role, and Firestore denies direct browser reads/writes.
- **Built an admin review foundation** — protected applicant listing, searching, filters, shortlist status, and audited email delivery.
- **Improved performance and maintainability** — removed wasteful render work, used stable React keys and derived state, and kept a canonical department/question catalogue.

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

## Deployment notes

- Set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`.
- Set a long random `BETTER_AUTH_SECRET` and the exact deployed `BETTER_AUTH_URL`.
- If using Google sign-in, configure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and the deployment callback URL: `/api/auth/callback/google`.
- Deploy the included `firestore.rules` before collecting real applications.
- Create an account with the Better Auth `admin` role before using `/admin`.

## For reviewers

`WORK.md` contains the full implementation rationale, the original hidden bug analysis, data model, security model, and verification notes. It is intended to make the trade-offs in this project easy to inspect and discuss.
