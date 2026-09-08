# GDG on Campus — Recruitment Portal

A redesigned recruitment portal built with Next.js, Better Auth, and Cloud Firestore.

## Run locally

1. Copy `.env.example` to `.env.local` and fill in a Firebase service account plus a long `BETTER_AUTH_SECRET`.
2. Install with `npm install --legacy-peer-deps` (the supplied lockfile is for Bun) or `bun install`.
3. Run `npm run dev`.

For an emulator, set `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080` in `.env.local` before starting the app.

## Data model

- `applicationProfiles/{userId}` stores the candidate's two allowed department IDs and names.
- `applications/{sha256(userId:departmentId)}` stores one immutable application per candidate/team pair.
- `adminAudit/{autoId}` records high-impact administrative actions such as email sends.

The deterministic application ID and Firestore transaction make duplicate submissions, concurrent double-clicks, and partial two-team saves impossible. A repeated request with the same `requestId` is safely idempotent.

## Security choices

- Firestore client rules deny all direct browser access; the browser only uses authenticated server routes.
- Every applicant route resolves identity from the server session, never from an email query parameter.
- The admin page and admin APIs enforce the Better Auth `admin` role on the server.
- Email delivery accepts only stored application IDs, not caller-provided recipient emails; template content is escaped before rendering.
- Server validation checks department/question IDs against the canonical questionnaire.

## Deployment checklist

- Set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`.
- Set a random `BETTER_AUTH_SECRET`, production `BETTER_AUTH_URL`, and Google OAuth credentials if Google sign-in is enabled.
- Deploy `firestore.rules`.
- Set `RECRUITMENT_DEADLINE` if applications should close automatically.
- Promote at least one Better Auth user to the `admin` role before using `/admin`.

## Interview talking points

The original implementation made one write per selected department, after a read-then-write eligibility check. That permits race conditions and leaves partial data when one write succeeds and the other fails. It also rendered the general motivation field without including it in the persisted payload. The current flow fixes both by validating one complete payload and committing all selected teams, profile metadata, and the motivation answer inside one transaction.
