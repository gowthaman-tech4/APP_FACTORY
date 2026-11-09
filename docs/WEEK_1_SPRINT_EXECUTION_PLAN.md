# SPRINT 1 DETAILED EXECUTION PLAN (WEEK 1)
**Project:** APP FACTORY  
**Sprint Window:** Monday, Day 1 – Friday, Day 5 (Client Milestone 1 Review on Saturday)  
**Sprint Objective:** Lock UX Design System in Figma, finalize Database RLS infrastructure, scaffold Offline PWA Engine, and complete initial field interviews across validation shops.  
**Sprint Budget Gate:** Milestone 1 Acceptance (25% / $3,000)  

---

## 1. Squad Roster & Direct Responsibilities

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           WEEK 1 SQUAD ASSIGNMENTS                              │
├─────────────────────────┬──────────────────────┬────────────────────────────────┤
│ Role                    │ Owner Background     │ Primary Week 1 Deliverable     │
├─────────────────────────┼──────────────────────┼────────────────────────────────┤
│ Head of UI/UX Design    │ Ex-CRED / Canva      │ Clickable Figma Mobile Proto   │
│ Lead Business Analyst   │ Ex-Khatabook         │ Field Interviews & BRD Matrix  │
│ VP of Product / PM      │ Ex-Swiggy            │ Sprint Board & Velocity Gate   │
│ Principal Architect     │ Ex-Stripe / Razorpay │ PostgreSQL RLS Cloud Instance  │
│ Staff PWA Engineer      │ Ex-Flipkart Lite     │ Offline PWA Engine Scaffolding │
│ QA & DevOps Lead        │ Ex-BrowserStack      │ CI/CD Pipeline & Device Farm   │
└─────────────────────────┴──────────────────────┴────────────────────────────────┘
```

---

## 2. Day-by-Day Master Schedule (Monday to Friday)

### 🗓️ MONDAY (Day 1) — Discovery Alignment & Architecture Provisioning

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **09:30 AM** | **All Squad** | **Sprint 1 Kickoff Meeting:** Scope freeze on `autocare.json` & `retail.json`. Client priorities alignment. | Sprint 1 Linear/Jira Board locked |
| **11:00 AM** | **Lead BA** | Conduct 45-min Zoom discovery with **Karthik Multi-Brand Auto** (Cohort Alpha). Document intake volume, damage dispute stories. | Cohort Alpha Field Transcript |
| **01:30 PM** | **Principal Architect** | Provision serverless PostgreSQL on Supabase/Neon. Apply `database/init.sql`. Configure environment secrets. | Live PostgreSQL DB URL with RLS enabled |
| **02:00 PM** | **Head of Design** | Establish typography, spacing, and color tokens in Figma based on `docs/UI_UX_DESIGN_SPEC.md`. | Figma Design Token Library (Colors, 48px buttons) |
| **03:30 PM** | **Staff PWA Eng** | Initialize repository with Vite + React 19 + TypeScript + Tailwind CSS. Configure PWA manifest and service worker. | Blank PWA app running with Lighthouse PWA score 100 |
| **05:00 PM** | **DevOps/QA Lead** | Set up GitHub Actions CI/CD pipeline targeting Vercel/Cloudflare preview environments on pull requests. | Automated build & deploy pipeline live |

---

### 🗓️ TUESDAY (Day 2) — Shop Floor Wireframes & Offline Caching Setup

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **10:00 AM** | **Head of Design** | Wireframe **The 5-Second Retail Fast Bill Screen**: big numerical keypad, item chips (Atta, Oil, Sugar), Cash/UPI toggle. | Low-fidelity Figma wireframes for Retail |
| **11:30 AM** | **Lead BA** | Conduct on-site walk-in interview with **Sri Lakshmi Kirana Store** (Cohort Beta). Observe credit logging and UPI QR scans. | Udhar Khata Flow Diagrams & Edge Cases |
| **02:00 PM** | **Staff PWA Eng** | Implement `IndexedDB` storage wrapper (using `idb` / Dexie.js) to store bills and job cards locally before network calls. | Local-first storage adapter with zero-latency write |
| **03:30 PM** | **Principal Architect** | Write automated multi-tenant leak tests (verifying Tenant A's token cannot query Tenant B's records). | Test suite: `rls_isolation.test.sql` passed |
| **04:30 PM** | **VP of Product** | Review Day 2 progress, check for scope leakage, update client risk tracker. | Daily Burn-down Chart updated |
| **06:00 PM** | **DevOps/QA Lead** | Connect automated Playwright browser test runner to GitHub Actions. | Headless cross-browser smoke tests operational |

---

### 🗓️ WEDNESDAY (Day 3) — High-Fidelity UI & Deep-Link Encoding

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **09:30 AM** | **Head of Design** | High-fidelity design of **AutoCare Bay Kanban** & **Customer Live Stepper** (OLED dark and high-contrast sunlight mode). | High-Fi Figma views for AutoCare |
| **11:00 AM** | **Staff PWA Eng** | Build the **Native `wa.me` Deep-Link Engine** supporting personalized text, emojis, and NPCI dynamic UPI string. | Standalone TypeScript utility: `generateWhatsAppUri()` |
| **01:30 PM** | **Lead BA** | Interview **Om Mobile & Electronics** (Cohort Gamma). Document warranty note requirements and IMEI tracking. | Cohort Gamma Validation Report |
| **03:00 PM** | **Principal Architect** | Implement dynamic public token generator (`gen_random_bytes(16)`) for zero-login customer live bills. | API route for unauthenticated tracking tokens |
| **05:00 PM** | **Head of Design** | Link all Figma screens into a **100% Clickable Prototype** simulating mobile touch interactions. | Clickable Figma Shareable Link |

---

### 🗓️ THURSDAY (Day 4) — Cross-Vertical Engine & Real-Device Benchmarks

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **10:00 AM** | **Staff PWA Eng** | Connect dynamic JSON template parser: app dynamically re-renders based on `autocare.json` or `retail.json`. | Multi-industry schema engine working on localhost |
| **11:30 AM** | **Head of Design** | Design micro-animations: 15ms haptic vibration cues, pulsating "In Repair" badge, and instant bill print animations. | Figma interactive component variant states |
| **02:00 PM** | **DevOps/QA Lead** | Run automated cross-device tests on **BrowserStack Physical Device Farm** (Redmi Note 12, Realme C55, Samsung Galaxy A14). | Cross-Device Compatibility Report (0 visual bugs) |
| **03:30 PM** | **Lead BA & PM** | Consolidate findings from all 3 cohort shop interviews into the **Sprint 2 Ready User Story Backlog**. | Finalized Sprint 2 Jira/Linear Backlog |
| **05:30 PM** | **Principal Architect** | Conduct database query latency benchmarks (target: < 25ms response time under 100 concurrent queries). | Database Performance Audit Report |

---

### 🗓️ FRIDAY (Day 5) — Internal Freeze, Smoke Testing & Client Demo Prep

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **10:00 AM** | **DevOps/QA Lead** | Execute full regression suite: offline caching, WhatsApp deep-link generation, RLS isolation, and PWA install prompt. | QA Green Sign-Off Certificate |
| **12:00 PM** | **All Squad** | **Internal Dry-Run Demo:** Walk through both AutoCare and Kirana workflows on a real Android smartphone. | All blockers cleared before client presentation |
| **02:30 PM** | **VP of Product** | Prepare **Milestone 1 Client Review Deck**: Figma walkthrough, live staging PWA link, database latency stats, and budget report. | Client Demo Package & Executive Summary |
| **04:30 PM** | **All Squad + Client** | **OFFICIAL MILESTONE 1 CLIENT DEMO with Pugazhendhi:** Live walkthrough of clickable prototype and technical architecture. | Client Demo Complete |

---

## 3. Saturday (Day 6): Milestone 1 Sign-Off & Acceptance Gate

* **Formal Review Gate:** Client (Pugazhendhi) reviews deliverables against `docs/MASTER_IMPLEMENTATION_PLAN.md`.
* **Deliverables Handed Over for Payment Gate 1 (25% / \$3,000):**
  1. Clickable Figma Prototype (AutoCare + Retail Kirana).
  2. Live multi-tenant PostgreSQL database with RLS policies enabled.
  3. Working PWA scaffold deployed on live staging URL.
  4. 3 Cohort Shop Validation Interview Summaries.
* **Next Step:** Release of Milestone 1 payment and immediate approval to begin **Sprint 2 (Alpha PWA Build)** on Monday morning.

