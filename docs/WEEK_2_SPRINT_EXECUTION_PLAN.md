# SPRINT 2 DETAILED EXECUTION PLAN (WEEK 2)
**Project:** APP FACTORY  
**Sprint Window:** Monday, Day 8 – Friday, Day 12 (Client Milestone 2 Review on Saturday, Day 13)  
**Sprint Objective:** Deliver the functional Alpha PWA Engine executing both `autocare.json` and `retail.json`, client-side damage photo compression, dynamic NPCI UPI QR generation, Bluetooth thermal receipt printing, and complete offline PWA service worker caching.  
**Sprint Budget Gate:** Milestone 2 Acceptance (35% / $4,200)  

---

## 1. Squad Roster & Week 2 Core Responsibilities

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           WEEK 2 SQUAD ASSIGNMENTS                              │
├─────────────────────────┬──────────────────────┬────────────────────────────────┤
│ Role                    │ Owner Background     │ Primary Week 2 Deliverable     │
├─────────────────────────┼──────────────────────┼────────────────────────────────┤
│ Head of UI/UX Design    │ Ex-CRED / Canva      │ Micro-Interactions & Print CSS │
│ Lead Business Analyst   │ Ex-Khatabook         │ Udhar Ledger Math & Tax Rules  │
│ VP of Product / PM      │ Ex-Swiggy            │ Sprint Velocity & Scope Lock   │
│ Principal Architect     │ Ex-Stripe / Razorpay │ NPCI UPI Protocol & RLS Sync   │
│ Staff PWA Engineer      │ Ex-Flipkart Lite     │ Offline PWA & Camera WebP Comp │
│ QA & DevOps Lead        │ Ex-BrowserStack      │ Device Lab Thermal Test Matrix │
└─────────────────────────┴──────────────────────┴────────────────────────────────┘
```

---

## 2. Day-by-Day Master Schedule (Monday to Friday)

### 🗓️ MONDAY (Day 8) — Schema Form Engine & State Machine Hookup

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **09:30 AM** | **All Squad** | **Sprint 2 Kickoff:** Review Milestone 1 sign-off; lock Sprint 2 scope on form generators and UPI QR flows. | Sprint 2 Board active & prioritized |
| **11:00 AM** | **Staff PWA Eng** | Wire `src/components/FormRenderer.js` into active PWA terminal shell. Ensure inputs dynamically render from schema. | Dynamic form rendering from JSON |
| **01:30 PM** | **Principal Architect** | Hook `AppCore` state machine transitions into multi-tenant PostgreSQL sync layer via Supabase realtime client. | Live real-time DB synchronization |
| **02:30 PM** | **Head of Design** | Design thermal print typography layouts for 58mm POS paper rolls (32-column fixed-pitch ASCII format). | 58mm Thermal Print Layout Spec |
| **04:00 PM** | **Lead BA** | Define exact Udhar rounding math, partial payment split rules, and GST percentage calculators. | `docs/RETAIL_MATH_SPEC.md` |
| **05:30 PM** | **DevOps/QA Lead** | Add automated unit tests for `FormRenderer` and `AppCore` state transitions in GitHub Actions CI. | CI Pipeline green with new unit tests |

---

### 🗓️ TUESDAY (Day 9) — AutoCare Damage Photo Capture & Compression

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **10:00 AM** | **Staff PWA Eng** | Build HTML5 Camera API module with client-side canvas WebP compression (reduces 5MB photo to < 150KB for fast 4G upload). | Zero-latency mobile photo compressor |
| **11:30 AM** | **Head of Design** | Design multi-angle vehicle damage capture UI (Front Bumper, Left Door, Rear, Right Door) with scratch tap tags. | Damage inspection photo modal in PWA |
| **02:00 PM** | **Principal Architect** | Set up Supabase Storage S3-compatible bucket with signed tokenized URLs for customer damage photo viewing. | Secure image storage bucket with CDN |
| **03:30 PM** | **Lead BA** | Review damage photo UI directly with **Karthik Multi-Brand Auto** (Cohort Alpha). Verify tap ergonomics for mechanics. | Cohort Alpha UX Sign-off Sheet |
| **05:30 PM** | **DevOps/QA Lead** | Automated stress test: Uploading 10 photos simultaneously under throttled 3G network conditions (0 dropped packets). | Network Throttling Test Report |

---

### 🗓️ WEDNESDAY (Day 10) — Kirana Khata Ledger & Dynamic NPCI UPI QR

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **09:30 AM** | **Principal Architect** | Implement dynamic NPCI UPI QR string generator with merchant VPA, bill reference token, and exact decimal amounts. | Standardized `generateUpiUri()` module |
| **11:00 AM** | **Staff PWA Eng** | Render high-contrast dynamic UPI QR code on terminal screen and customer tracking bill view using SVG/Canvas. | Instant QR display on bills |
| **01:30 PM** | **Head of Design** | Design Udhar Khata customer ledger cards: overdue days counter, amber pending badge, and 1-click WhatsApp reminder button. | High-Fi Khata Ledger UI in PWA |
| **03:00 PM** | **Lead BA** | Review Khata ledger flow with **Sri Lakshmi Kirana** (Cohort Beta). Test message tone and 1-click UPI deep links on owner's phone. | Cohort Beta Ledger Approval |
| **05:00 PM** | **VP of Product** | Mid-Sprint Health Check: Verify velocity, resolve dependency bottlenecks, update client progress metrics. | Sprint 2 Burn-Down on track (60%) |

---

### 🗓️ THURSDAY (Day 11) — Bluetooth ESC/POS Thermal Printer Driver & PWA Offline Shell

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **10:00 AM** | **Staff PWA Eng** | Integrate `src/utils/thermalPrinter.js` with Web Bluetooth API (`navigator.bluetooth`) for 58mm/80mm ESC/POS printers. | 1-Click Bluetooth print driver working |
| **11:30 AM** | **DevOps/QA Lead** | Test Bluetooth thermal printing with physical portable Bluetooth printers (Munbyn, Goojprt, Posiflex) in the device lab. | Hardware Print Verification Log |
| **02:00 PM** | **Staff PWA Eng** | Activate `sw.js` Service Worker with cache-first strategy for static assets and offline IndexedDB fallback. | PWA passes all Lighthouse Offline audits |
| **03:30 PM** | **Head of Design** | Design PWA "Add to Home Screen" custom installation banner and native splash screens for Android and iOS. | PWA Install Prompt & Manifest Icons |
| **05:30 PM** | **Principal Architect** | Security Audit: Verify CORS headers, Content Security Policy (CSP), and database RLS isolation under simulated attack. | Security Hardening Report (0 vulnerabilities) |

---

### 🗓️ FRIDAY (Day 12) — Full Regression Freeze, Device Lab Farm & Client Demo

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **10:00 AM** | **DevOps/QA Lead** | Execute full automated test suite: 22 integration tests + Bluetooth thermal printer tests + offline sync tests. | Complete QA Green Certificate |
| **12:00 PM** | **All Squad** | **Internal Dry Run on Budget Androids:** Test live check-ins and billing on Redmi 12, Realme C55, and Samsung A14 phones. | Zero layout bugs across 3 devices |
| **02:30 PM** | **VP of Product** | Prepare **Milestone 2 Client Review Deck**: Live staging Alpha PWA URL, Bluetooth thermal print demo video, and test results. | Milestone 2 Review Package |
| **04:30 PM** | **All Squad + Client** | **OFFICIAL MILESTONE 2 CLIENT DEMO with Pugazhendhi:** Live walkthrough of working Alpha PWA on both templates. | Client Demo Complete |

---

## 3. Saturday (Day 13): Milestone 2 Sign-Off & Acceptance Gate

* **Formal Review Gate:** Client (Pugazhendhi) reviews Alpha PWA against `docs/MASTER_IMPLEMENTATION_PLAN.md`.
* **Deliverables Handed Over for Payment Gate 2 (35% / \$4,200):**
  1. Functional Alpha PWA executing both **AutoCare Desk** and **Kirana QuickDesk** templates.
  2. Native camera damage photo capture with client-side WebP compression (< 150KB).
  3. Dynamic NPCI UPI QR code generation with 1-click GPay/PhonePe deep linking.
  4. Bluetooth ESC/POS 58mm thermal receipt print driver.
  5. 100% installable offline PWA with `manifest.json` and `sw.js`.
  6. 22+ automated tests passing with 0 errors.
* **Next Step:** Release of Milestone 2 payment and immediate kickoff of **Sprint 3 (Integration, Live Pilot & Hardening)** on Monday morning.

