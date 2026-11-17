# AGENTS.md — TabeebCare Implementation Guide

This file is the authoritative reference for any AI agent implementing this project.
Read this fully before writing a single line of code.

---

## Project Identity
- **Name**: TabeebCare (طبیب کیئر)
- **Purpose**: SDG 3 Hackathon — AI health literacy, prescription demystifier, symptom triage
- **Stack**: Next.js 15 (App Router, TypeScript), Tailwind CSS, Groq SDK, better-sqlite3
- **Repo**: https://github.com/muhammadali382/SDG_03

---

## Hard Constraints — Never Violate These

1. **NO external database services** — SQLite only (`tabibcare.db` in project root). No Supabase, Firebase, Mongo, Postgres.
2. **NO external auth library** — Prototype auth only. `localStorage` stores `{id, name, email}` as `tabibcare_user`. `/api/auth/*` reads/writes the SQLite `users` table in plain text. No NextAuth, no JWT, no bcrypt.
3. **NO extra paid APIs** — Groq only. Model: `llama-3.1-8b-instant`. No OpenAI, no Gemini, no Anthropic.
4. **NO vector databases** — RAG uses keyword matching over TypeScript objects in `clinical_protocols.ts`. No Pinecone, no Chroma, no embeddings API.
5. **NO CSS libraries beyond Tailwind** — No MUI, no Chakra, no Bootstrap. Use Tailwind classes + Lucide icons only.
6. **NO pages beyond the defined scope** — Only: `/`, `/login`, `/signup`, `/dashboard`, `/meds`, `/triage`, `/profile`, and `/api/*` routes.
7. **`docs/` is gitignored** — Never read, reference, or commit anything from the `docs/` folder.
8. **ALWAYS work on `dev` branch** — Never push application code directly to `main`. `main` is protected and only receives merges via PR.

---

## Git Branching Strategy

```
main   ← Protected. Only receives merge from dev when feature-complete.
         Contains: .github/workflows/ci.yml, README.md, .env.example, .gitignore
dev    ← All development happens here. This is your working branch.
         Contains everything main has + all application source code.
```

- **Never** commit `tabibcare.db`, `.env`, `.env.local`, or `docs/` to any branch.
- Always `git checkout dev` before starting any coding session.
- Commit messages: present tense, e.g. `"Add Groq triage API route with RAG context"`.

---

## Implementation Order — Follow Exactly

Implement files in this strict order on the `dev` branch. Do not jump ahead.

```
1.  next.config.ts + tailwind.config.ts + tsconfig.json + .env.example + package.json
2.  src/lib/db.ts           ← SQLite singleton connection
3.  src/lib/schema.ts       ← All CREATE TABLE statements, run on first import
4.  src/lib/rag/clinical_protocols.ts  ← 15 protocol chunk objects
5.  src/lib/rag/retriever.ts           ← Keyword scorer function
6.  src/lib/groq.ts                    ← Groq client setup
7.  src/lib/prompts/triage_prompt.ts   ← Triage system prompt builder
8.  src/lib/prompts/meds_prompt.ts     ← Meds parsing prompt builder
9.  src/lib/memory/context_builder.ts  ← Assembles final system prompt
10. src/app/api/auth/signup/route.ts
11. src/app/api/auth/login/route.ts
12. src/app/api/auth/demo/route.ts
13. src/app/api/profile/route.ts
14. src/app/api/meds/route.ts
15. src/app/api/triage/route.ts
16. src/context/UserContext.tsx         ← Global auth + profile state
17. src/components/ui/Button.tsx
18. src/components/ui/Card.tsx
19. src/components/ui/Input.tsx
20. src/components/ui/Badge.tsx
21. src/components/layout/Navbar.tsx
22. src/components/layout/MedicalDisclaimer.tsx
23. src/components/triage/ChatBubble.tsx
24. src/components/triage/TriageBadge.tsx
25. src/components/triage/EmergencyBanner.tsx
26. src/components/triage/SbarCard.tsx
27. src/components/meds/MedicineCard.tsx
28. src/app/layout.tsx
29. src/app/page.tsx                    ← Landing
30. src/app/login/page.tsx
31. src/app/signup/page.tsx
32. src/app/dashboard/page.tsx
33. src/app/meds/page.tsx
34. src/app/triage/page.tsx
35. src/app/profile/page.tsx
36. README.md (final)
```

---

## SQLite Rules

- **Connection**: `better-sqlite3` is synchronous. Import the singleton from `src/lib/db.ts`.
- **Schema init**: `schema.ts` exports `initDB()`. Call it at the top of `db.ts` so tables are created on first run.
- **In API routes**: Import `db` from `@/lib/db`. All queries are synchronous — no `await` needed.
- **JSON fields**: `conditions`, `allergies`, `current_medications`, `messages`, `schedule_result` are stored as `JSON.stringify(array)` and parsed with `JSON.parse()` on read.
- **Database file location**: Project root `./tabibcare.db` — it is in `.gitignore`.

```ts
// db.ts pattern
import Database from 'better-sqlite3';
const db = new Database('./tabibcare.db');
export default db;
```

---

## Auth Rules

- **Signup flow**: POST `/api/auth/signup` → INSERT user → INSERT empty health_profile → return `{id, name, email}`.
- **Login flow**: POST `/api/auth/login` → SELECT user WHERE email+password match → return `{id, name, email}` or 401.
- **Demo flow**: POST `/api/auth/demo` → return hardcoded demo user object (id: 999, name: "Ahmad Khan", age: 54, conditions: ["Type 2 Diabetes","Hypertension"], allergies: ["Sulfa","Penicillin"], medications: ["Metformin 500mg","Amlodipine 5mg"]). Do NOT write this to the database.
- **Client session**: After any successful auth response, client does `localStorage.setItem('tabibcare_user', JSON.stringify(user))`.
- **Protected pages**: Every protected page (`/dashboard`, `/meds`, `/triage`, `/profile`) must check localStorage on mount. If `tabibcare_user` is null → `router.push('/login')`.
- **Logout**: Simply `localStorage.removeItem('tabibcare_user')` → redirect to `/`.

---

## Groq API Rules

- **Model**: Always `llama-3.1-8b-instant`. Never change this.
- **Client**: Import from `src/lib/groq.ts`. Use the official `groq-sdk` package.
- **API key**: Read from `process.env.GROQ_API_KEY`. Never hardcode.
- **Request format**: Use `groq.chat.completions.create()`.
- **JSON mode**: For `/api/meds`, set `response_format: { type: "json_object" }` to get structured schedule output.
- **Streaming**: For `/api/triage`, use `stream: true` and pipe the stream to the client using `ReadableStream`.
- **Max tokens**: 800 for triage, 1200 for meds schedule.
- **Temperature**: 0.3 for triage (consistent, clinical), 0.5 for meds explanations (friendlier).

---

## RAG Rules

- `clinical_protocols.ts` exports an array of objects, each with shape:
  ```ts
  { id: string, title: string, keywords: string[], protocol: string, severity: 'emergency'|'urgent'|'routine' }
  ```
- `retriever.ts` exports `retrieveContext(userMessage: string): string`:
  - Lowercase the message
  - Score each chunk by counting how many of its keywords appear in the message
  - Return the top 1–2 chunks' `protocol` text concatenated
  - Return empty string if no keywords match (no hallucinated context)

---

## Context Assembly Rules (`context_builder.ts`)

Builds the system message string in this order:
1. Role definition and safety rules (always present)
2. `[PATIENT PROFILE]` block from `health_profiles` row (if logged in)
3. `[CLINICAL PROTOCOL CONTEXT]` block from RAG retriever (if matched)
4. `[SAFETY RULES]` enforcement block (always present, never removable)

The assembled string is the `system` message. The user's conversation history is the `messages` array.

---

## UI / Design Rules

- **Color palette**:
  - Primary: `teal-600` / `teal-700`
  - Emergency: `red-500` / `red-600`
  - Warning: `amber-500`
  - Success/Safe: `green-500`
  - Background: `slate-50`
  - Text: `slate-800`
- **Layout**: All pages use a centered `max-w-4xl` container with Navbar at top.
- **Mobile-first**: All components must be responsive. Use Tailwind responsive prefixes (`sm:`, `md:`).
- **Icons**: Lucide React only. No other icon libraries.
- **No dark mode** — single light theme only.

---

## Emergency Escalation Rule (Critical — Must Implement)

If `triage_level === 'emergency'` in any API response:
- Render `<EmergencyBanner />` component at the **top of the chat**, full-width, red background
- Display: "🚨 This may be a medical emergency. Call 1122 immediately."
- Include a large `<a href="tel:1122">` button styled as red CTA
- For mental health crisis keywords: show Umang helpline: 0317-4288665
- This banner is **not dismissible**

---

## Medical Disclaimer Rule

- Must appear in the footer of every page
- Must appear as a modal on first visit to `/triage` and `/meds`
- Text: *"TabeebCare is an educational health literacy and clinical triage navigation tool. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional."*

---

## Demo Preset Rules

The `/meds` page must have 3 quick-fill preset buttons:
1. **"Diabetes Prescription"** → `"Metformin 500mg, Glibenclamide 5mg, Aspirin 75mg"`
2. **"Antibiotic Course"** → `"Augmentin 625mg, Panadol 500mg"`
3. **"Blood Pressure"** → `"Amlodipine 5mg, Losartan 50mg, Hydrochlorothiazide 25mg"`

The `/triage` page must have 3 starter prompt chips:
1. `"Mujhe 2 din se tez bukhar hai"`
2. `"I have chest pain and shortness of breath"`
3. `"Mere bacha ko ulti aur dast ho rahe hain"`

---

## What NOT to Build (Out of Scope)

- No voice/audio input
- No image/prescription photo upload
- No email verification or password reset
- No real-time features or WebSockets
- No charts or data visualization libraries
- No i18n library — just a simple `lang` state toggle between EN/UR displayed strings
- No unit tests for the hackathon deadline
- No deployment — runs on `localhost:3000` only for the demo
