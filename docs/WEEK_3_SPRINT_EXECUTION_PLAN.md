# SPRINT 3 DETAILED EXECUTION PLAN (WEEK 3)
**Project:** APP FACTORY  
**Sprint Window:** Monday, Day 15 – Friday, Day 19 (Client Milestone 3 Review on Saturday, Day 20)  
**Sprint Objective:** Live pilot deployment inside 3 active shops, cloud PostgreSQL background synchronization adapter, multi-language localization (English, Hindi, Tamil), and battery/thermal performance profiling.  
**Sprint Budget Gate:** Milestone 3 Acceptance (25% / $3,000)  

---

## 1. Squad Roster & Week 3 Core Responsibilities

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           WEEK 3 SQUAD ASSIGNMENTS                              │
├─────────────────────────┬──────────────────────┬────────────────────────────────┤
│ Role                    │ Owner Background     │ Primary Week 3 Deliverable     │
├─────────────────────────┼──────────────────────┼────────────────────────────────┤
│ Head of UI/UX Design    │ Ex-CRED / Canva      │ Multi-Language UI (Tamil/Hindi)│
│ Lead Business Analyst   │ Ex-Khatabook         │ On-Site Pilot Trials & Ledger  │
│ VP of Product / PM      │ Ex-Swiggy            │ Pilot KPI Dashboard & Feedback │
│ Principal Architect     │ Ex-Stripe / Razorpay │ Cloud Sync Queue Adapter       │
│ Staff PWA Engineer      │ Ex-Flipkart Lite     │ Offline Reconciler & Haptics   │
│ QA & DevOps Lead        │ Ex-BrowserStack      │ 12-Hour Battery & Memory Audit │
└─────────────────────────┴──────────────────────┴────────────────────────────────┘
```

---

## 2. Day-by-Day Master Schedule (Monday to Friday)

### 🗓️ MONDAY (Day 15) — Cloud Sync Queue Adapter & Online Reconciler

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **09:30 AM** | **All Squad** | **Sprint 3 Kickoff:** Review Milestone 2 Alpha PWA feedback; align on on-site pilot deployment schedule. | Sprint 3 Board active |
| **11:00 AM** | **Principal Architect** | Implement `src/adapters/supabaseAdapter.js`: Outbox pattern queue that stores unsynced records locally and batches them to PostgreSQL upon network reconnect. | Cloud Sync Adapter module |
| **01:30 PM** | **Staff PWA Eng** | Wire window `online` / `offline` event listeners to automatically trigger the sync queue without user intervention. | Seamless background sync on reconnect |
| **03:00 PM** | **Head of Design** | Design multi-language toggle drawer supporting English, Hindi (हिन्दी), and Tamil (தமிழ்) with vernacular typography. | Multi-language UI spec in Figma |
| **05:00 PM** | **QA Lead** | Automated network partition testing: Cut network, write 15 records, reconnect network, verify 100% cloud delivery. | Network Partition Test Report (0 data loss) |

---

### 🗓️ TUESDAY (Day 16) — Multi-Language Localization Engine (Indic Languages)

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **10:00 AM** | **Staff PWA Eng** | Build `src/utils/i18n.js`: Zero-dependency localization engine with native language strings for Kirana and AutoCare terms. | Indic i18n dictionary module |
| **11:30 AM** | **Lead BA** | Review vernacular phrasing with shopkeepers (e.g., ensuring "Udhar" is called "உதார் / கடன்" in Tamil and "उधार" in Hindi). | Approved Indic Vocabulary Lexicon |
| **02:00 PM** | **Head of Design** | Ensure Tamil and Hindi script line-heights do not clip on budget Android screens with 720p resolution. | Mobile typography QA approval |
| **04:00 PM** | **VP of Product** | Prepare physical pilot kit: 1 laminated UPI QR standee and 1 pre-paired Bluetooth printer for Cohort Beta. | Shop Pilot Hardware Kit |
| **05:30 PM** | **QA Lead** | Run automated string rendering tests across 3 languages to ensure 0 layout overflow. | i18n Layout Verification Report |

---

### 🗓️ WEDNESDAY (Day 17) — Live On-Site Pilot Deployment (Cohort Alpha & Beta)

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **09:00 AM** | **Lead BA & PM** | **On-Site Deploy at Karthik Multi-Brand Auto:** Install PWA on foreman's Android phone. Log first 5 real vehicle check-ins. | Live vehicle cards active in bay |
| **01:30 PM** | **Lead BA & PM** | **On-Site Deploy at Sri Lakshmi Kirana:** Place UPI standee on counter; train owner on 5-second fast bill & WhatsApp receipts. | Real customer bills logged live |
| **03:30 PM** | **Principal Architect** | Monitor live PostgreSQL telemetry and connection pool utilization during pilot peak hours. | Real-Time DB Performance Dashboard |
| **05:30 PM** | **Head of Design** | Observe real shop floor lighting conditions: verify sunlight contrast ratio in Karthik Auto's open service bay. | On-Site UX Observation Notes |

---

### 🗓️ THURSDAY (Day 18) — Field Telemetry Analysis, Bug Fixes & Thermal Hardening

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **10:00 AM** | **All Squad** | **Field Debrief:** Analyze the first 24 hours of real shop usage (errors, mechanic friction, customer feedback). | Pilot Action Item Matrix |
| **11:30 AM** | **Staff PWA Eng** | Deploy hotfixes based on field feedback (e.g., increased phone number font size for older shopkeepers). | PWA v1.1 Hotfix build |
| **02:00 PM** | **QA Lead** | Run 12-hour continuous battery drain and RAM memory leak profile on low-end Android hardware. | Battery & Memory Audit (< 3% drain/hr) |
| **04:00 PM** | **Principal Architect** | Verify database RLS query performance with real pilot tenant transactions. | Production Query Health Report |
| **05:30 PM** | **VP of Product** | Compile pilot customer metrics (e.g., bills logged, WhatsApp receipt open rate, Udhar cleared via UPI). | Pilot Metrics Dashboard |

---

### 🗓️ FRIDAY (Day 19) — Milestone 3 Regression Freeze & Client Live Demo

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **10:00 AM** | **QA Lead** | Execute unified 40+ automated test suite across offline sync, i18n, hardware printing, and RLS security. | Sprint 3 QA Green Certificate |
| **12:00 PM** | **All Squad** | **Internal Review:** Validate real transaction records logged by pilot shops in the cloud database. | Production Data Verification |
| **02:30 PM** | **VP of Product** | Prepare **Milestone 3 Client Review Deck**: Live pilot shop video walkthroughs, cloud sync telemetry, and verified metrics. | Milestone 3 Package |
| **04:30 PM** | **All Squad + Client** | **OFFICIAL MILESTONE 3 CLIENT DEMO with Pugazhendhi:** Review live pilot transactions and cloud sync architecture. | Client Demo Complete |

---

## 3. Saturday (Day 20): Milestone 3 Sign-Off & Acceptance Gate

* **Formal Review Gate:** Client (Pugazhendhi) reviews real-world pilot metrics and cloud synchronization stability.
* **Deliverables Handed Over for Payment Gate 3 (25% / \$3,000):**
  1. Live field pilot running in 2 active shops with real customer transactions.
  2. Cloud PostgreSQL synchronization adapter with offline queue reconciliation.
  3. Multi-language localization engine supporting English, Hindi, and Tamil.
  4. 12-Hour battery drain audit (< 3%/hr) and RAM profiling on budget Android phones.
  5. 40+ automated tests passing with 0 errors.
* **Next Step:** Release of Milestone 3 payment and immediate kickoff of **Sprint 4 (Production Launch, Custom Domains & IP Handover)**.
