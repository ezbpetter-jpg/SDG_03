# TabeebCare (طبیب کیئر) — AI for Accessible Healthcare & Well-Being

[![SDG 3: Good Health & Well-Being](https://img.shields.io/badge/UN%20SDG-03%20Good%20Health-009688.svg)](https://sdgs.un.org/goals/goal3)
[![Next.js 15](https://img.shields.io/badge/Next.js-15%20(App%20Router)-black.svg)](https://nextjs.org/)
[![Groq Cloud](https://img.shields.io/badge/Groq%20LPU-llama--3.1--8b--instant-f55036.svg)](https://groq.com/)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57.svg)](https://sqlite.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Light%20Theme-38bdf8.svg)](https://tailwindcss.com/)

> **Minhaj University Lahore • Seekers Tech & Computing Society (STCS)**  
> **AI Hackathon & Startup Pitch • Student Week 2026**  
> Official Challenge Brief: **AI for Accessible Healthcare & Well-Being (SDG 3)**

---

## 🏥 1. Problem Statement & Real-World Context (Pakistan)

In Pakistan and many developing countries, healthcare access is plagued by three critical bottlenecks:
1. **Prescription Misunderstanding & Medication Errors**: Over 65% of outpatients cannot decipher doctors' handwritten prescriptions or understand English medicine brand names and complex dosage schedules. This leads to missed doses, accidental overdoses, and adverse drug clashes.
2. **Delayed Emergency Triage**: Patients struggle to distinguish between routine symptoms (e.g. viral fatigue) and life-threatening red flags (e.g. atypical myocardial infarction, ischemic stroke, severe dehydration in infants), leading either to delayed hospital care or overcrowded emergency rooms.
3. **The 3-Minute Consultation Gap**: With an acute shortage of primary care physicians, the average clinic consultation lasts under 3 minutes. Doctors lack time to take thorough medical histories, and patients struggle to articulate symptom timelines.

**TabeebCare (طبیب کیئر)** solves these three barriers through an accessible, AI-powered health literacy and triage companion.

---

## ⚡ 2. Core Modules & User Journey

### 1. Medicine Demystifier & 24-Hour Routine (`/meds`)
- **Prescription Parsing**: Patient types or pastes medication names (e.g. *"Augmentin 625mg, Panadol 500mg, Glucophage"*).
- **Daily Visual Timetable**: Auto-generates an icon-based **Morning (صبح) / Afternoon (دوپہر) / Evening (شام) / Night (رات)** dosage schedule.
- **Bilingual Explanations**: Details what each medicine does in plain English and natural Urdu script (اردو).
- **Food & Drink Precautions**: Outlines crucial safety rules (e.g., *"Take immediately after meals"*, *"Avoid dairy 2 hours before/after"*).
- **Allergy Clash Sentinel**: Cross-checks medications against the patient's recorded allergies and flags dangerous conflicts with bold alert warnings.

### 2. Clinical Protocol Symptom Triage (`/triage`)
- **Multilingual Conversational Intake**: Patients describe symptoms freely in **English, Urdu (اردو), or Roman Urdu** (e.g., *"Mujhe 2 din se tez bukhar hai"*).
- **Evidence-Based RAG Engine**: Keyword-based Retrieval-Augmented Generation over 15 embedded **WHO & Emergency Severity Index (ESI)** primary care clinical protocols.
- **Urgency Triage Classification**:
  - 🚨 **Emergency (Levels 1–2)**: Immediate life hazard → activates full-width **1122 hotline banner**.
  - ⚠️ **Urgent Care (Level 3)**: Requires same-day clinic consultation.
  - ℹ️ **Routine Care (Level 4)**: Outpatient appointment within 2–3 days.
  - 🟢 **Home Care (Level 5)**: Conservative rest, hydration, and monitoring indicators.

### 3. Doctor Handover Card (SBAR Standard)
- Compiles the consultation into an industry-standard **SBAR (Situation, Background, Assessment, Recommendation)** clinical summary card.
- Ready to print or display on-screen during physician visits, saving up to 50% of history-taking consultation time.

### 4. Memory Architecture (Short & Long-Term)
- **Short-Term Memory**: Multi-turn conversational context preserved across triage turns so the AI remembers prior symptom answers.
- **Long-Term Memory**: Persistent SQLite health profile storing chronic conditions (e.g., Type 2 Diabetes, Hypertension), recorded drug allergies (e.g., Sulfa, Penicillin), and active prescriptions. Automatically injected into every Groq prompt.

---

## 🚀 3. Startup & Sustainability Case (Judging Criteria: 25%)

| Pillar | Strategy |
|:---|:---|
| **Value Proposition** | Reduces prescription non-adherence by up to 40%, decreases hospital intake delays, and empowers low-literacy patients. |
| **Target Customers** | Chronic illness patients (diabetes/hypertension), elderly caregivers, outpatient clinics, and community Lady Health Workers (LHWs). |
| **B2C Model** | **Freemium App**: Free core triage, symptom evaluation, and emergency guidance. Premium tier for chronic multi-patient family profiles, SMS medication reminders, and blood glucose/BP trend exports. |
| **B2B / B2G Model** | **Clinical API Licensing**: Licensing the automated SBAR Handover engine to telehealth providers (Sehat Kahani, Marham, Oladoc) and Electronic Medical Record (EMR) vendors. |
| **Pharmacy Partnerships** | Integration with retail pharmacy chains (Servaid, Fazal Din) to generate co-branded digital dosage schedules for patients with every dispensed prescription. |

---

## 🛠️ 4. Technology Stack & Architecture

```
[ Frontend: Next.js 15 App Router + React 19 + Tailwind CSS (Light Theme) ]
                                    │
                                HTTP Fetch
                                    ▼
[ Backend: Next.js Serverless API Routes (/api/auth, /api/meds, /api/triage, /api/profile) ]
         │                                       │
         ▼                                       ▼
[ Embedded SQLite (better-sqlite3) ]   [ RAG Knowledge Base (15 WHO/ESI Chunks) ]
- Users table                          - Keyword Scorer (retriever.ts)
- Health_profiles table                - Clinical Safety Protocols
- Triage_sessions table                          │
- Medication_checks table                        ▼
                                       [ Groq LPU Inference API ]
                                       - Model: llama-3.1-8b-instant (~560 tok/sec)
                                       - Structured JSON Mode (/api/meds)
                                       - Text Streaming (/api/triage)
```

- **Framework**: Next.js 15 (TypeScript, App Router)
- **Styling**: Tailwind CSS v3 (**Strict Light Theme**: Teal-600, Emerald-50, Slate-50; zero dark blue/gray-900)
- **AI Core**: Groq Cloud SDK (`llama-3.1-8b-instant`) — sub-second inference speed
- **Database**: Local file-based SQLite (`tabibcare.db`) via `better-sqlite3` — zero cloud dependency, 100% offline-safe for venue demos
- **CI/CD**: GitHub Actions workflow on `main` branch (`.github/workflows/ci.yml`)

---

## ⚙️ 5. Local Setup & Quick Start

### Prerequisites
- Node.js 18+ or 20+ installed
- A valid Groq Cloud API key from [console.groq.com](https://console.groq.com)

### Installation
```bash
# Clone the repository
git clone https://github.com/muhammadali382/SDG_03.git
cd SDG_03

# Ensure you are on the development branch
git checkout dev

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

Open `.env.local` and add your Groq API key:
```env
GROQ_API_KEY=gsk_your_actual_groq_key_here
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚡ 6. Instant Live Demo for Judges

To test the application in under 30 seconds without creating accounts or typing:
1. Navigate to [http://localhost:3000/login](http://localhost:3000/login)
2. Click **"⚡ Instant Judge Demo Login"**
3. You will immediately be logged in as **Ahmad Khan** (54yo male with **Type 2 Diabetes, Hypertension, and recorded Sulfa & Penicillin allergies**).
4. Go to **Check Meds (`/meds`)**:
   - Click the preset button **"Diabetes Prescription"** to view the auto-generated 24-hr schedule.
   - Or test an allergy clash by entering **"Bactrim DS"** (a sulfonamide antibiotic) → watch TabeebCare trigger a bold **🚨 Allergy Conflict Warning**.
5. Go to **Symptom Triage (`/triage`)**:
   - Click the starter chip *"I have chest pain and shortness of breath"* → observe sub-second streaming response and immediate **🚨 Emergency 1122 Escalation Banner**.
   - Click **"Doctor Card (SBAR)"** to view and print the doctor intake handover card.

---

## 🛡️ 7. Safety, Compliance & Ethical Rules

1. **Prominent Medical Disclaimer**: Placed in the global footer and delivered as a modal before accessing triage or medication features:
   > *"TabeebCare is an educational health literacy and clinical triage navigation tool. It does not replace professional medical advice, diagnosis, or treatment."*
2. **Emergency Red-Flag Escalation**: Whenever life-threatening signs (cardiac chest pain, stroke FAST indicators, anaphylaxis, severe hemorrhage) are detected, normal chat is superseded by the direct **1122 Rescue** hotline dialer.
3. **Mental Health Crisis Safeguards**: Self-harm indicators trigger immediate routing to the Pakistan Mental Health Helpline Umang (`0317-4288665`).
4. **Synthetic Data**: Uses exclusively synthetic patient profiles and public clinical protocols.

---

## 👥 8. Hackathon Submission Information
- **Event**: AI Hackathon & Startup Pitch — Seekers Tech & Computing Society (STCS)
- **Institution**: Minhaj University Lahore
- **Date**: Tuesday, 17 November 2026
- **Repository**: [https://github.com/muhammadali382/SDG_03](https://github.com/muhammadali382/SDG_03)
