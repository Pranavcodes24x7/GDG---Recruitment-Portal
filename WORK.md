# GDG VITC RECRUITMENT PORTAL

👉 Deployed Live Recruitment Portal Website - https://gdg-portal-phi.vercel.app/

How was the backend error fixed :

The Error Was:
The original form displayed the required question: “Why do you want to join Organization Name?”
But when submitting, it never added that answer to basicDetails or Questions.
The backend therefore accepted the application but permanently discarded that response.

It was fixed in three layers:
1. The form now explicitly sends the answer as profile.motivation when the user submits
2. The backend validates it using Zod. A missing or too-short motivation answer is rejected before anything is saved.
3. The backend stores the complete profile object—including motivation—inside every submitted application record, in the same atomic transaction as the department answers.

## What I Improved in short :

Rebuilt the portal into a polished, responsive GDG on Campus VIT Chennai recruitment experience with a clear candidate journey from discovery to submission.

Added Google OAuth and email/password authentication, with credentials securely kept outside the codebase.

Implemented an accessible Day / Night mode that remembers each user’s preference.

Expanded the platform to support all 12 official departments with tailored descriptions, skills, and application questions.

Fixed the hidden backend data-loss bug: the required motivation response was shown in the form but never stored; it is now validated and persisted.

Reworked application submission into one atomic operation, preventing partial saves when applying to multiple departments.

Added deterministic application IDs and idempotent requests to prevent duplicate submissions and double-click race conditions.

Secured the backend with server-side session checks, role-protected admin routes, Zod validation, and deny-by-default Firestore rules.

Built a protected admin review workflow with applicant search, filters, shortlist actions, and safer email-delivery controls.

Verified the complete local application journey end-to-end: authentication, department selection, form validation, successful submission, saved submission status, and production build.
## IN DETAIL

## Follow-up branding and authentication changes

The following requested refinements were applied after the initial upgrade:

- Replaced the placeholder campus name with **VIT Chennai**.
- Added the supplied GDG logo as `public/assets/gdg-logo.jpeg` and use it in the navigation and sign-in brand lock-up.
- Added a persistent, accessible Day / Night toggle in the primary navigation. It remembers the user’s choice through `next-themes`, supports keyboard activation, and has dedicated dark-mode colour tokens for navigation, content cards, forms, tables, and calls to action.
- Updated public-facing wording from “team(s)” to “department(s)”, while preserving the requested headline: **“A team is a place to start.”**
- Enabled the “Continue with Google” path in the local configuration. The credential values remain only in the ignored local environment file; a deployment must add the same values as protected environment variables and allow its OAuth callback URL in Google Cloud.
- Corrected a local-origin edge case in the submission guard. It now accepts the configured `BETTER_AUTH_URL` as well as the request origin, so local `127.0.0.1` development is not confused with Next.js’s internal `localhost` URL; unknown external origins remain blocked.
- Completed the credential-free preview path with an isolated in-memory submission store. When `AUTH_LOCAL_DEMO=true`, validated applications, duplicate prevention, submission limits, and submitted-department status work without Firebase credentials. It is intentionally cleared when the local server restarts and is never a production storage replacement.
- Fixed local email sign-up/sign-in with an opt-in `AUTH_LOCAL_DEMO=true` adapter. It is deliberately volatile and intended only for credential-free visual / authentication testing. Real deployment continues to use Firestore credentials, as documented in `.env.example` and `README.md`.
- Updated the department catalogue and the matching canonical application questions to all 12 departments: Management, Publicity, Outreach, UI/UX, Creatives, Web Dev, App Dev, Game Dev, Data Science, Blockchain, Cloud & DevOps, and Competitive Programming.

## What I changed

### 1. A complete visual and experience redesign

The old homepage was essentially unstyled text despite having unused assets and components. It is now an editorial landing page with a deliberate visual hierarchy:

- A custom four-colour brand mark inspired by the Google palette, without copying a Google logo.
- An original CSS illustration in the hero, made from geometric shapes and a translucent “window” card. This keeps the page visually distinctive without a heavy image download.
- Serif display typography paired with a neutral UI sans-serif, generous spacing, carefully limited colour, and high-contrast calls to action.
- A responsive layout that collapses cleanly from desktop to mobile.
- A `prefers-reduced-motion` fallback so interactions do not create unnecessary motion for users who opt out.
- A page structure with useful content rather than decorative filler: introduction, team exploration, principles, and a clear application call-to-action.

The design avoids the common “template” look by using a restrained palette, real content hierarchy, custom shapes, disciplined spacing, and typography-led composition instead of stacking gradients and generic cards.

### 2. A usable candidate application journey

The application flow now has three coherent stages:

1. **Choose teams** — candidates can choose up to two teams, see their selected choices, and cannot choose teams they have already submitted for.
2. **Tell their story** — candidates get a structured profile section followed by questions specific to their selected teams.
3. **Submit confidently** — field validation, an accessible error summary, protected identity via authenticated email, a saved browser draft, and a clear success state.

Specific improvements:

- Twelve understandable departments with descriptions and skill tags replaced corrupted / unreadable source data.
- Every question has a stable identifier (`web-build`, `design-work`, etc.) rather than using the human-readable question text as a database key.
- A browser-session draft is saved with a small debounce. It does **not** save the verified email address in browser storage.
- Client-side validation provides immediate feedback for registration number, phone, year, general motivation, and required department answers.
- All information is revalidated on the server; browser validation is for usability only, not security.
- Users receive an explicit confirmation after a successful submission.

### 3. Hidden response-storage bug fixed

The original UI rendered the required general question:

> “Why do you want to join Organization Name?”

However, that value was never added to either `basicDetails` or the outgoing `Questions` object. The UI accepted the response and the server silently discarded it.

The new implementation carries the field as `profile.motivation`, validates it on both client and server, and stores it inside every application document’s profile data. This makes the answer available to reviewers and impossible to lose through the old omission.

### 4. Submission consistency and duplicate prevention

The original form submitted each selected department through a separate request using `Promise.allSettled`. It checked eligibility with a read and then created documents with `.add()`.

That caused three serious integrity problems:

- A candidate could end up with only one application if one parallel write failed.
- Two simultaneous requests could both pass the “maximum two applications” read check before either wrote data.
- Retrying after a timeout could create duplicates because autogenerated document IDs provide no idempotency.

The new `POST /api/submit-form` receives **one** validated payload containing all chosen departments. It uses a Firestore transaction to:

- Read the applicant profile and all deterministic application documents before writing.
- Enforce the two-team limit within the same transaction.
- Reject duplicate departments.
- Save the candidate profile and every chosen team together, or save none of them.
- Use a deterministic document ID based on a SHA-256 hash of `userId:departmentId`.
- Accept an idempotency UUID (`requestId`): a retry of the already-successful same request returns success rather than creating another record.

This is a strong interview point: **the server is now the source of truth and the transaction makes the constraint correct under concurrency.**

### 5. Data model redesigned for lower cost and clearer queries

The single open `formData` collection was replaced by a small, purpose-built model:

```text
applicationProfiles/{userId}
  - email
  - departmentIds, departmentNames
  - createdAt, updatedAt

applications/{sha256(userId:departmentId)}
  - userId, email
  - profile (name, registration number, phone, year, motivation)
  - departmentId, department
  - answers[]
  - status, shortlisted, formVersion
  - requestId, createdAt, updatedAt

adminAudit/{generatedId}
  - actorId, action, target application IDs, timestamp
```

Why it is better:

- One profile read can tell the candidate which departments they have submitted for; the UI does not need to query an entire collection repeatedly.
- Deterministic IDs enforce one application per person/team without an extra duplicate query.
- The admin route orders and limits applicant records instead of fetching an unbounded collection.
- Stable question IDs preserve the meaning of answers when copy changes later.
- `formVersion` makes future questionnaire migrations traceable.

### 6. Security fixes

The original code had severe authorization issues. For example, the admin applicants API, shortlist API, and email API did not validate a session or admin role. The Firestore rules allowed every client to read and write every document.

The upgrade introduces server-side security boundaries:

- `lib/server-auth.js` centralises session lookup, required-user checks, required-admin checks, and safe API errors.
- `/admin` verifies the admin role **on the server** before fetching applicants.
- `/api/admin/applicants`, `/api/shortlist/[id]`, and `/api/send-email` all require the Better Auth `admin` role.
- Candidate status and submission routes resolve identity from the session; they no longer trust a caller-provided `?email=` parameter.
- `firestore.rules` now denies direct browser reads and writes. The browser interacts only with validated server routes using the Admin SDK.
- Submission payloads have strict Zod schemas and are checked against the canonical department/question definitions.
- The submit endpoint checks cross-origin requests when an `Origin` header is supplied.
- The mail endpoint accepts stored **application IDs**, not arbitrary recipient emails supplied by the browser.
- Email message content is escaped before it becomes HTML, preventing basic HTML injection.
- Email sends create an `adminAudit` record.
- Production requires `BETTER_AUTH_SECRET`; there is no silent default secret in deployment.

### 7. Admin review desk

The new admin page is an actual review workspace rather than an exposed table:

- Server-protected route and API access.
- KPI cards for total applications, shortlisted candidates, and active teams.
- Search by name, email, registration number, or team.
- Team and status filters.
- Shortlist / remove-shortlist actions that persist to the secured server route.
- Clear status pills and clean, readable tabular hierarchy.
- The API limits the initial result set to at most 100 entries to avoid accidentally expensive reads.

The admin page requires an account whose Better Auth role is `admin`. See the deployment checklist in `README.md`.

### 8. Performance work

Several files in the original project contained artificial or accidental expensive work on every render. Examples included:

- A 300,000-iteration trigonometry loop on the home page.
- A nested 50,000 × 20 loop in the hero.
- A 200,000-iteration regex loop in the form.
- A 100,000-iteration department check on the selection page.
- Random React keys that remounted cards on every render.
- Chains of effects used to calculate values that could be derived directly.

These were removed from the active experience. The replacement uses direct derived state, stable keys, small client components only where interaction is needed, and no decorative JavaScript animation library. The production build’s initial JavaScript load is approximately **110 kB** for the redesigned public routes.

### 9. Configuration and deployment readiness

- `.env.example` documents the Firestore service account, Better Auth configuration, optional Google OAuth, optional email credentials, and optional `RECRUITMENT_DEADLINE`.
- `README.md` contains local setup, Firestore emulator guidance, the data model, a deployment checklist, and short interview talking points.
- The legacy `/development` route is retained as a safe redirect to the team selector so old links do not lead to broken / corrupted content.
- Deprecated direct-database helper modules that wrote to the old unsecured `formData` collection have been removed.

## Files worth reading before an interview

| File | Why it matters |
| --- | --- |
| `app/api/submit-form/route.js` | Atomic transaction, deterministic IDs, idempotency, server validation. |
| `components/FormComp.jsx` | Candidate flow, accessible validation, local draft, payload creation. |
| `lib/server-auth.js` | Reusable server-side access control. |
| `firestore.rules` | Direct client access is intentionally denied. |
| `app/(pages)/admin/page.jsx` | Server-protected admin route. |
| `app/api/send-email/route.js` | Protected delivery, recipient lookup, escaping, audit record. |
| `constants/index.js` | Canonical team and stable-question metadata. |
| `app/globals.css` | Original responsive visual system and component styling. |

## Verification performed

- `next build` completed successfully in production mode.
- `/`, `/departments`, and `/auth/signin` each returned HTTP `200` locally.
- A complete authenticated local-demo application was submitted successfully and was returned by the follow-up submission-status request.
- The home page and mobile team-selector experience were visually reviewed in the local browser.
- Requests to `/api/admin/applicants`, `/api/check-applications`, and `/api/submit-form` without a session each returned HTTP `401`.

