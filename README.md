# TabeebCare (طبیب کیئر) — AI for Accessible Healthcare & Well-Being

[![UN SDG 3: Good Health & Well-Being](https://img.shields.io/badge/UN%20SDG-03%20Good%20Health%20%26%20Well--Being-009688.svg?style=for-the-badge&logo=un)](https://sdgs.un.org/goals/goal3)
[![Next.js 15](https://img.shields.io/badge/Next.js-15%20App%20Router-black.svg?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Groq Cloud](https://img.shields.io/badge/Groq%20Cloud-llama--3.1--8b--instant-f55036.svg?style=for-the-badge)](https://groq.com/)
[![SQLite](https://img.shields.io/badge/SQLite-node%3Asqlite-003B57.svg?style=for-the-badge&logo=sqlite)](https://sqlite.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Light%20Theme-38bdf8.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

> **Minhaj University Lahore • Seekers Tech & Computing Society (STCS)**  
> **Student Week 2026 • AI Hackathon & Startup Pitch**  
> Challenge Niche: **AI for Accessible Healthcare & Well-Being (United Nations SDG 3)**  
> Live Code Freeze: **3:55 PM, Tuesday, 17 November 2026**

---

## 📑 Table of Contents
1. [Executive Summary & Problem Statement (SDG 3)](#-1-executive-summary--problem-statement-sdg-3)
2. [Complete & Exhaustive Feature Matrix](#-2-complete--exhaustive-feature-matrix)
3. [AI Integration & Technical Architecture](#-3-ai-integration--technical-architecture)
4. [Startup Pitch & Business Model (25% Weight)](#-4-startup-pitch--business-model-25-weight)
5. [Clinical RAG Knowledge Base (15 Protocols)](#-5-clinical-rag-knowledge-base-15-protocols)
6. [UI/UX Design System & Accessibility](#-6-uiux-design-system--accessibility)
7. [Safety, Ethical Guardrails & Compliance](#-7-safety-ethical-guardrails--compliance)
8. [60-Second Live Demo Script for Judges](#-8-60-second-live-demo-script-for-judges)
9. [Local Setup & Verification Guide](#-9-local-setup--verification-guide)
10. [Submission & Repository Information](#-10-submission--repository-information)

---

## 🏥 1. Executive Summary & Problem Statement (SDG 3)

In Pakistan and developing healthcare ecosystems across South Asia, accessible and safe healthcare is constrained by three structural bottlenecks:

1. **Prescription Misunderstanding & Medication Non-Adherence**:
   * Over **65% of Pakistani outpatients** struggle to read handwritten prescriptions, comprehend English brand names, or understand dosage timing.
   * This leads to missed antibiotic doses, dangerous drug clashes, accidental overdoses, and antibiotic resistance (AMR).
2. **Delayed Emergency Triage & Triage Misdirection**:
   * Patients cannot reliably distinguish between self-limiting symptoms (e.g., viral fatigue, common cold) and life-threatening red flags (e.g., atypical cardiac ischemia, ischemic stroke FAST indicators, pediatric dehydration, or high-fever sepsis).
   * Overburdened tertiary emergency rooms are flooded with routine cases while critical emergencies arrive too late.
3. **The 3-Minute Consultation Gap**:
   * Due to an extreme doctor-to-patient deficit (approximately 1 doctor per 1,300 people), primary care outpatient consultations frequently last **under 3 minutes**.
   * Rushed doctors lack time to capture comprehensive longitudinal medical histories, and patients struggle to clearly summarize symptom timelines.

### The Solution: TabeebCare (طبیب کیئر)
TabeebCare is an intelligent, bilingual, and culturally-attuned healthcare literacy and triage navigation assistant designed to democratize primary care navigation, demystify complex prescriptions into visual 24-hour schedules, and bridge communication between patients and physicians.

---

## ⚡ 2. Complete & Exhaustive Feature Matrix

Below is the complete inventory of **all major, minor, backend, frontend, safety, and algorithmic features** implemented in the project:

### 💊 Module 1: Medicine Demystifier & Prescription Literacy (`/meds`)
* **Free-Text Prescription Ingestion**: Accepts comma-separated brand or generic medicine names (e.g., *"Augmentin 625mg, Panadol 500mg, Glucophage"*).
* **24-Hour Visual Schedule Generator**: Dynamically categorizes each drug into an intuitive four-phase visual routine:
  * 🌅 **Morning (صبح)**
  * ☀️ **Afternoon (دوپہر)**
  * 🌇 **Evening (شام)**
  * 🌙 **Night (رات)**
* **Bilingual Drug Explanations**: Generates clear, non-jargon explanations of each drug's purpose in both simple English and natural Urdu script (اردو).
* **Generic Compound Identification**: Identifies the generic chemical compounds behind commercial brand names (e.g., *Augmentin* $\rightarrow$ *Co-amoxiclav / Amoxicillin + Clavulanic Acid*).
* **Critical Food & Drink Precautions**: Specifies exact dietary interactions (e.g., *"Take strictly after meals to prevent gastric upset"*, *"Avoid taking with milk or dairy products"*).
* **Automated Allergy Conflict Sentinel**: Cross-references every analyzed medication against the patient's recorded drug allergies in their profile (e.g., Penicillin, Sulfa) and fires bold red conflict warning alerts.
* **Chronic Condition Contraindication Checking**: Evaluates if prescribed medicines conflict with pre-existing conditions like Hypertension or Type-2 Diabetes.
* **One-Click Quick-Fill Demo Presets**:
  * 1️⃣ *Diabetes Prescription*: `Metformin 500mg, Glibenclamide 5mg, Aspirin 75mg`
  * 2️⃣ *Antibiotic Course (Allergy Conflict Test)*: `Augmentin 625mg, Panadol 500mg` (triggers Penicillin alert)
  * 3️⃣ *Blood Pressure Routine*: `Amlodipine 5mg, Losartan 50mg, Hydrochlorothiazide 25mg`
* **Loading Spinner & Error Resilience**: Interactive UI states providing clear feedback during AI generation.
* **Persistent Medication Audit Logging**: Automatically writes completed medication checks and JSON schedules into the SQLite `medication_checks` table for authenticated users.

---

### 🩺 Module 2: Multilingual Clinical Symptom Triage (`/triage`)
* **Multilingual Natural Language Intake**: Users can describe symptoms freely in **Urdu script (اردو)**, **Roman Urdu** (*"Mujhe 2 din se tez bukhar hai"*), or **English**.
* **Zero-Latency First-Token Streaming**: Server-Sent Events (SSE) readable stream powered by Groq LPU inference, delivering instant real-time response generation.
* **4-Tier Urgency Stratification Engine**: Classifies patient conditions into exact clinical categories:
  * 🚨 **Emergency (Levels 1–2)**: Immediate life hazard requiring emergency transfer.
  * ⚠️ **Urgent Care (Level 3)**: High-priority symptoms requiring same-day clinic consultation.
  * ℹ️ **Routine Care (Level 4)**: Non-critical symptoms suitable for an outpatient clinic visit in 2–3 days.
  * 🟢 **Home Care (Level 5)**: Self-limiting minor illness managed with rest, hydration, and monitoring.
* **Automated `TRIAGE_LEVEL` Header Extraction**: Stream parser captures line-1 urgency tags dynamically and updates the UI state in real-time.
* **Four Clinical Scenario Starter Chips**:
  * 🚨 *Cardiac Emergency*: "Crushing Chest Pain & Shortness of Breath"
  * ⚠️ *Urgent Infection*: "Tez Bukhar aur Thand (2 din se)"
  * ⚠️ *Pediatric Emergency*: "Mere bacha ko ulti aur dast ho rahe hain"
  * 💚 *Crisis Intervention*: "Severe Emotional Crisis Support"
* **In-Memory Keyword-Scored RAG Retriever**: Scans 15 clinical primary care protocol chunks with weighted multi-word scoring to ground every consultation in evidence.
* **Dynamic Context Injection Pipeline**: Automatically injects patient medical profile (chronic diseases, allergies, active prescriptions) and RAG protocols into system prompts.
* **Cultural Clinical Guidance**: Tailored to Pakistani endemic conditions (e.g., warning against NSAIDs/Aspirin when Dengue fever is suspected).
* **Conversation Reset & State Refresh**: One-click button to clear current chat history and restart triage consultations.
* **Auto-Scrolling Chat Window**: Maintains view focus at the bottom of the conversation as streaming tokens arrive.
* **Session Persistence Engine**: Stores full multi-turn transcripts, triage levels, and summaries into the SQLite `triage_sessions` table.

---

### 🚨 Module 3: Pre-Inference Safety Guardrails (`src/lib/guardrails.ts`)
* **Zero-Latency Client-Side Regex Interceptor**: Evaluates user input before network transmission to catch emergencies and crisis signals immediately.
* **Trilingual Self-Harm & Mental Crisis Patterns**:
  * English: `suicide`, `kill myself`, `end my life`, `self harm`, `overdose`
  * Roman Urdu: `khudkushi`, `khud ko marna`, `jaan de donga`, `zindagi khatam`, `zeher`
  * Native Urdu: `خودکشی`, `مرنا چاہتا`, `زندگی ختم`, `جان دے دوں`, `زہر کھا`
* **Trilingual Acute Physical Emergency Patterns**:
  * English: `chest pain`, `heart attack`, `cannot breathe`, `stroke`, `unconscious`
  * Roman Urdu: `seene mein dard`, `saans lene mein takleef`, `behosh`, `falij`, `khoon beh`
  * Native Urdu: `سینے میں درد`, `سانس لینے میں دشواری`, `بے ہوش`, `فالج`
* **Direct Emergency Hotline Escalation Banner**: Full-width alert linking directly to **Rescue 1122** (`<a href="tel:1122">`).
* **Dedicated Crisis Safety Guardrail Banner**: Prominently displays the Pakistan Mental Health Helpline **Umang (`0317-4288665`)** for 24/7 confidential crisis support.
* **Non-Diagnostic System Prompt Boundaries**: Prevents the AI from diagnosing diseases; mandates framing advice as educational triage recommendations.
* **Mandatory Medical Disclaimer Modal**: Triggered on the first visit to `/triage` and `/meds` with `localStorage` acceptance persistence (`tabibcare_disclaimer_accepted`).
* **Universal Legal Disclaimer Footer**: Embedded across every page layout.

---

### 📋 Module 4: Doctor Handover Card — SBAR Clinical Summary (`src/components/triage/SbarCard.tsx`)
* **Standard SBAR Clinical Format**: Translates the consultation into the recognized medical intake framework:
  * **S (Situation)**: Primary presenting complaint, onset duration, and triage urgency level.
  * **B (Background)**: Known chronic illnesses, recorded drug allergies, and current medications.
  * **A (Assessment)**: Detailed symptom progression, vital indicator notes, and fever timeline.
  * **R (Recommendation)**: Clinical focus recommendations for the examining physician.
* **One-Click Instant Generation**: Automatically compiled from active triage conversation messages and user profile.
* **Print-Ready Optimized Styling**: Integrates with `window.print()` and `@media print` CSS rules to hide UI chrome and format a clean A4 sheet.
* **Patient Demographics Header**: Displays patient name, age, gender, consultation timestamp, and ID.
* **Doctor Notes & Signature Box**: Dedicated space on the printed card for physician annotations.

---

### 📊 Module 5: Patient Dashboard & Health Hub (`/dashboard`)
* **Personalized Patient Header**: Greets the user with active session identity and demo status badge.
* **Chronic Conditions Health Snapshot**: Visual chips highlighting persistent chronic diseases (e.g., Type 2 Diabetes, Hypertension).
* **Drug Allergies Sentinel Badges**: Red alert badges highlighting active drug allergies for constant visibility.
* **Active Prescriptions List**: Displays all ongoing long-term medications.
* **Direct Module Quick Actions**: Large touch cards navigating directly to **Check Meds**, **Live Symptom Triage**, and **Medical Profile**.
* **Emergency Quick-Dial Bar**: Always-accessible emergency dialer for Rescue 1122 and Umang.
* **Route Authentication Protection**: Redirects unauthenticated visitors to `/login` immediately.

---

### 👤 Module 6: Medical Profile Manager (`/profile`)
* **Interactive Tag Management**:
  * Add and remove **Chronic Medical Conditions** chips.
  * Add and remove **Drug Allergies** chips with danger highlights.
  * Add and remove **Active Prescriptions** chips.
* **Demographics Editor**: Edit patient age, gender, and personal information.
* **RESTful Synchronization**: Syncs updates instantly to SQLite via `PUT /api/profile` and `GET /api/profile`.
* **Instant React Context Propagation**: Profile updates reflect immediately across the navbar, dashboard, triage, and meds modules without requiring page reload.
* **Safe Sandbox for Demo User**: Demo user (Ahmad Khan) profile changes operate safely in memory without corrupting database state.

---

### 🔑 Module 7: Authentication & Instant Judge Sandbox (`/login`, `/signup`)
* **Lightweight Prototype Authentication**: Zero external vendor lock-in; operates completely offline on local SQLite.
* **`⚡ Instant Judge Demo Login` Button**: One-click bypass button on `/login` that logs in immediately as **Ahmad Khan** (54yo male, Diabetes, Hypertension, Penicillin & Sulfa allergies).
* **Medical Profile Onboarding during Signup**: Registration form captures name, email, password, age, gender, conditions, allergies, and medications in a single unified flow.
* **Duplicate Email Detection**: Validates email uniqueness in SQLite before creating accounts.
* **Session Storage Management**: Hydrates user identity (`id`, `name`, `email`) in `localStorage` (`tabibcare_user`).
* **Secure Logout Flow**: Clears local session state and redirects safely to the landing page.

---

### 🌐 Module 8: Bilingual Internationalization Engine (`src/lib/i18n/`)
* **Full Bilingual Support**: Instant toggle between **English** and **Urdu (اردو)**.
* **Persistent Language Toggle**: Accessible directly from the navigation bar.
* **Context-Aware Typography**: Automatically applies appropriate line-heights and font hierarchies for Urdu script rendering.
* **Complete Translation Dictionary**: 100+ translation keys covering navigation, buttons, badges, emergency banners, error toasts, and explanations.

---

### 🎨 Module 9: Custom Markdown & UI Component Suite (`src/components/ui/`)
* **Custom Markdown Renderer (`MarkdownRenderer.tsx`)**: Formats bold text, bullet points, numbered lists, and paragraphs with automatic emergency keyword highlighting (`1122`, `emergency`, `warning`).
* **Strict Light Theme UI**:
  * Primary Teal (`teal-600` / `teal-700`)
  * Primary Light (`teal-50` / `teal-100`)
  * Clean Medical Page Background (`slate-50`)
  * Crisp Card Backgrounds (`white` with `slate-200` borders)
  * High-Contrast Text (`slate-800` headings, `slate-700` body)
* **Custom Button Component (`Button.tsx`)**: Supports primary, secondary, outline, and danger variants with built-in loading spinners.
* **Status Badges (`Badge.tsx`, `TriageBadge.tsx`)**: Color-coded badges for Emergency (red), Urgent (amber), Routine (sky), and Home Care (emerald).
* **Responsive Layout & Navigation (`Navbar.tsx`)**: Mobile hamburger menu, active link detection, user profile indicator, and language toggle.

---

### 🗄️ Module 10: Backend Architecture & SQLite Auto-Migrations (`src/lib/`)
* **High-Performance SQLite Singleton (`src/lib/db.ts`)**: Built on Node 22's native `node:sqlite` (`DatabaseSync`), offering synchronous, zero-latency database transactions.
* **Auto-Schema Initializer (`src/lib/schema.ts`)**: Automatically creates and verifies all 4 relational tables on server startup:
  * `users` (id, name, email, password, created_at)
  * `health_profiles` (id, user_id, age, gender, conditions, allergies, current_medications, updated_at)
  * `triage_sessions` (id, user_id, messages, triage_level, summary, created_at)
  * `medication_checks` (id, user_id, medications_input, schedule_result, created_at)
* **Groq SDK Integration (`src/lib/groq.ts`)**: Cloud LLM execution via `llama-3.1-8b-instant`.
* **Structured Output Enforcement**: Uses Groq's `response_format: { type: "json_object" }` for rigid medication schedule validation.

---

## 🛠️ 3. AI Integration & Technical Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      Client Browser (React 19 / Next.js 15)             │
│               Light Theme • Tailwind CSS • Lucide Icons • Bilingual     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP (JSON / SSE Stream)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Next.js 15 Serverless API Routes                    │
│   /api/auth/*        /api/meds         /api/triage       /api/profile   │
└────────────┬───────────────────────────────┬────────────────────────────┘
             │                               │
             ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────────────────┐
│    Embedded Database    │     │       AI & RAG Knowledge Engine         │
│   (node:sqlite local)   │     │                                         │
│ - users                 │     │  1. In-Memory RAG Scorer (retriever.ts) │
│ - health_profiles       │     │     15 WHO Clinical Protocol Chunks     │
│ - triage_sessions       │     │  2. Dynamic Context Assembly            │
│ - medication_checks     │     │     Long-Term Profile + Guidelines      │
└─────────────────────────┘     │  3. Groq LPU Inference Cloud            │
                                │     - Model: llama-3.1-8b-instant       │
                                │     - Structured JSON Mode (/api/meds)  │
                                │     - SSE Text Stream (/api/triage)     │
                                └─────────────────────────────────────────┘
```

### Dual-Layer Memory Architecture
1. **Short-Term Memory**: Multi-turn conversation context preserved across triage interactions so follow-up symptoms and clarifications are understood within context.
2. **Long-Term Memory**: Persistent SQLite medical profile (`health_profiles` table) storing chronic conditions, allergies, and active prescriptions. Injected into every system prompt prior to inference.

---

## 🚀 4. Startup Pitch & Business Model (25% Weight)

TabeebCare is architected as a scalable, commercially viable digital health literacy enterprise.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         TabeebCare Ecosystem                            │
├────────────────────┬───────────────────────────────┬────────────────────┤
│   B2C (Freemium)   │     B2B (Telehealth APIs)     │ B2B2C (Pharmacies) │
│  Free Triage &     │ Licensing SBAR Handover Card  │ Co-branded digital │
│  Medicine Schedule │  to Sehat Kahani, Marham,     │ schedules with     │
│  Family Sub ($2/mo)│  Oladoc, & EMR hospital apps  │ Servaid & FazalDin │
└────────────────────┴───────────────────────────────┴────────────────────┘
```

### 1. Market Opportunity (Pakistan)
* **240M+ Population**: 60M+ chronic disease patients (Diabetes, Hypertension, Cardiovascular).
* **130M+ Smartphones**: Rapid 4G penetration across Tier-2 and Tier-3 cities.
* **$3.5B Annual Out-of-Pocket Healthcare Spend**: Most of which is wasted on improper drug adherence and late-stage emergency admissions.

### 2. Revenue Streams
| Stream | Description | Pricing Model |
|:---|:---|:---|
| **B2C Freemium App** | Free core triage and medication schedules. Premium tier includes multi-profile family accounts, WhatsApp medication reminders, and monthly health reports. | PKR 500 / month ($1.80/mo) |
| **B2B Telehealth Licensing** | Integrating TabeebCare’s pre-consultation SBAR intake into telehealth apps (Sehat Kahani, Marham, Oladoc) to double doctor throughput. | Per-consultation API fee |
| **Pharmacy Retail Integration** | Partnering with retail pharmacy chains (Servaid, Fazal Din) to print QR codes on prescription bags leading directly to TabeebCare's 24-hr visual schedule. | B2B SaaS subscription |
| **Public Health & NGO Impact** | Deploying low-bandwidth triage tools to Community Lady Health Workers (LHWs) in rural districts. | Subsidized grant / G2B contracts |

---

## 📚 5. Clinical RAG Knowledge Base (15 Protocols)

TabeebCare uses a zero-latency in-memory keyword-scored RAG retriever (`src/lib/rag/retriever.ts`) grounded in 15 primary care clinical protocols:

1. **Cardiac Emergency & Acute Chest Pain** (ACS, angina, jaw/arm pain, chewable aspirin guidance)
2. **Acute Respiratory Distress & Asthma Exacerbation** (Dyspnea, inhaler spacer guidance, 1122 escalation)
3. **Acute Stroke & Neurological Deficit** (FAST protocol: Face, Arm, Speech, Time)
4. **High Fever, Rigors & Sepsis Warning** (Temperature >39°C, rigors, dengue/malaria endemic cautions)
5. **Acute Abdomen & Severe Abdominal Pain** (Appendicitis, perforation, peritoneal signs)
6. **Head Trauma, Concussion & Intracranial Pressure** (Loss of consciousness, vomiting, pupillary asymmetry)
7. **Severe Allergic Reaction & Anaphylaxis** (Stridor, angioedema, epinephrine referral)
8. **Diabetic Ketoacidosis & Severe Hypoglycemia** (Blood sugar collapse, fruity breath, disorientation)
9. **Hypertensive Urgency and Crisis** (BP >180/120 with target organ symptoms)
10. **Poisoning, Chemical Ingestion & Drug Overdose** (Toxin exposure, antidotes, no vomiting induction)
11. **Pediatric High Fever & Febrile Convulsion** (Infant seizures, hydration, cooling measures)
12. **Acute Psychological Distress & Crisis Intervention** (Umang Mental Health Helpline 0317-4288665)
13. **Acute Traumatic Wound & Uncontrolled Bleeding** (Direct pressure, tourniquet, shock prevention)
14. **Urinary Tract Infection & Renal Colic** (Flank pain, dysuria, hematuria)
15. **Common Cold, Viral Pharyngitis & Flu** (Conservative home care, hydration, honey/steam)

---

## 🎨 6. UI/UX Design System & Accessibility

* **Strict Light Theme**: Medical White (`#ffffff`), Clean Slate Background (`#f8fafc`), Soft Border (`#e2e8f0`).
* **Medical Primary Palette**: Deep Clinical Teal (`#0d9488` / `teal-600`) and Fresh Teal (`#f0fdfa` / `teal-50`).
* **Emergency Palette**: Alert Crimson (`#ef4444` / `red-500`) and Muted Rose (`#fef2f2` / `red-50`).
* **Warning / Urgent Palette**: Warm Amber (`#f59e0b` / `amber-500`) and Soft Amber (`#fffbeb` / `amber-50`).
* **Safe / Home Care Palette**: Reassuring Emerald (`#10b981` / `emerald-500`).
* **Bilingual Switcher**: Instant one-click toggle between English and Urdu script (اردو).
* **Responsive Layout**: Optimized for mobile phones (key for rural users and on-the-go patient intake).

---

## 🛡️ 7. Safety, Ethical Guardrails & Compliance

1. **Prominent Medical Disclaimer**: Displayed globally in the footer and via mandatory modal before accessing triage or medication features:
   > *"TabeebCare is an educational health literacy and clinical triage navigation tool. It does not replace professional medical advice, diagnosis, or treatment."*
2. **Emergency Red-Flag Escalation**: Whenever life-threatening symptoms are detected, normal conversation is superseded by a full-width **Rescue 1122** calling button.
3. **Mental Health Crisis Interceptor**: Any detected distress or self-harm triggers compassionate empathy and immediate referral to Pakistan’s mental health crisis line: **Umang Helpline (0317-4288665)**.
4. **Synthetic Data Only**: 100% compliant with hackathon privacy rules. No real patient records are stored or transmitted.

---

## ⏱️ 8. 60-Second Live Demo Script for Judges

To demonstrate TabeebCare's complete end-to-end journey in under 60 seconds:

```
Step 1: Open http://localhost:3000/login
        Click "⚡ Instant Judge Demo Login"
        → Logged in immediately as Ahmad Khan (54yo, Diabetes, Hypertension, Penicillin Allergy).

Step 2: Go to Check Meds (/meds)
        Click "Antibiotic Course (الرجی ٹیسٹ)" preset (Augmentin 625mg + Panadol)
        Click "Analyze Prescriptions"
        → Watch AI generate 24-hr timetable (Morning/Afternoon/Evening/Night) with Urdu translations.
        → Observe RED ALLERGY ALERT: "Warning: You are allergic to Penicillin. Augmentin contains amoxicillin."

Step 3: Go to Symptom Triage (/triage)
        Click starter chip: "Crushing Chest Pain & Breathing"
        → Observe instant sub-second streaming response.
        → Red 🚨 Emergency Banner appears with 1-click "Call 1122 (Rescue)" button.

Step 4: Click "Doctor Card (SBAR)"
        → Instant clinical handover card ready to print or show to the physician.
```

---

## 💻 9. Local Setup & Verification Guide

### Prerequisites
* Node.js v20+ or v22+
* Groq Cloud API Key ([console.groq.com](https://console.groq.com))

### 1. Clone & Install
```bash
git clone https://github.com/muhammadali382/SDG_03.git
cd SDG_03

# Ensure you are on the dev branch
git checkout dev

# Install dependencies
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```
Edit `.env.local` with your Groq API key:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build & Type Check Verification
```bash
# TypeScript verification
npx tsc --noEmit

# Production build
npm run build
```

---

## 👥 10. Submission & Repository Information

* **Competition**: AI Hackathon & Startup Pitch — Seekers Tech & Computing Society (STCS)
* **Venue**: Minhaj University Lahore
* **Date**: Tuesday, 17 November 2026 (Live Freeze at 3:55 PM)
* **Official Repository**: [https://github.com/muhammadali382/SDG_03](https://github.com/muhammadali382/SDG_03)
* **Required Collaborators Invited**:
  * `@httpsharis` (https://github.com/httpsharis)
  * `@anamta-JINX` (https://github.com/anamta-JINX)
* **Active Working Branch**: `dev`
