# PROJECT CHARTER & CLIENT DISCOVERY BRIEF
**Project Name:** APP FACTORY (Vertical Flagship #1: AutoCare Desk)  
**Document Version:** 1.0.0  
**Author:** Client Principal / Product Lead  
**Target Delivery Partner:** Software Engineering Agency  
**Date:** November 2026  

---

## 1. Executive Summary & Core Problem Definition

### 1.1 The High-Pain Problem Statement
Independent automotive and two-wheeler repair workshops (2–6 service bays) operate in an acute operational blind spot. They rely on paper job registers, verbal technician instructions, and unorganized WhatsApp chats. 

This causes three catastrophic daily friction points:
1. **The "Status-Check" Productivity Drain:** Workshop managers receive 15 to 30 phone interruptions daily from anxious car owners asking *"Is my vehicle ready?"*. Every call takes 3–5 minutes, pulling mechanics away from billable labor.
2. **The "Pre-Existing Damage" Dispute Trap:** Customers routinely blame the workshop for pre-existing scratches, broken clips, or fuel level differences upon vehicle pickup. Without timestamped condition logs, workshops frequently absorb $50–$150 in disputed repairs to maintain customer goodwill.
3. **Zero Lifecycle Retention:** Once a vehicle leaves the bay, the workshop loses contact. There is no automated re-engagement for the 90-day oil change or 180-day brake inspection, leaking recurring revenue to competitors.

### 1.2 Target User Personas (ICP)
* **Primary (The Daily Operator):** Workshop Foreman / Head Mechanic. Non-technical, operates on a budget Android smartphone with greasy hands, needs single-thumb interaction, and zero cognitive load.
* **Secondary (The Consumer):** Vehicle Owner. Expects transparency similar to Uber or food delivery tracking; refuses to download a dedicated mobile app or register an account.

---

## 2. Real End-User Access & Validation Cohort

As the client, I have secured **three active, independent workshops** for the agency’s product discovery, user interviews, and beta trials:

| Workshop Profile | Location | Daily Volume | Primary Operational Pain Point |
| :--- | :--- | :--- | :--- |
| **Cohort Alpha: Karthik Multi-Brand Auto** | Urban Hub (4-Bay Garage) | 12–16 Cars / day | Constant customer phone inquiries; lost paper estimates. |
| **Cohort Beta: Speedy Two-Wheeler Hub** | Suburban Market (2-Bay Shop) | 20–25 Bikes / day | Rapid vehicle turnover; fast-paced check-ins with high billing errors. |
| **Cohort Gamma: Apex Car Detailing Studio** | High-Income Pocket | 4–6 Cars / day | Damage disputes; customer demands high-definition photographic proof. |

* **User Access Commitment:** 
  * Discovery interviews (30 mins each) can be scheduled within 48 hours of project kickoff.
  * The agency lead engineer and UI designer will have direct WhatsApp access to all 3 owners for rapid UX feedback.
  * Day 21 deployment: Real vehicle check-ins will be logged directly inside Cohort Alpha’s physical shop.

---

## 3. Budget, Runway & Technical Constraints

### 3.1 Commercial Budget: \$12,000 USD (Fixed-Scope MVP)
* **Engagement Model:** Fixed-Price Milestone Contract tied to functional acceptance criteria (not hourly billing).
* **Payment Tranches:**
  * **25% ($3,000):** Architecture Sign-off, Clickable Figma Prototype, and Data Schema.
  * **35% ($4,200):** Functional Alpha PWA (Job Card creation + Photo upload + Native WhatsApp links).
  * **25% ($3,000):** End-to-End Integration (Customer Tracking Web Link + Local Receipt Printing + Offline Caching).
  * **15% ($1,800):** Production Deployment, Source Code Transfer, and 14-Day Pilot Stability Sign-off.

### 3.2 Technical Architectural Mandate (From a Technical Client Perspective)
We explicitly reject over-engineered architectures. Do not build microservices, Kubernetes clusters, or native iOS/Android binaries for Phase 1.

* **Frontend:** Next.js / React (TypeScript) configured as a 100% installable **Progressive Web App (PWA)** with service workers for local caching.
* **Backend & Persistence:** Serverless PostgreSQL (Supabase or Neon) leveraging **Row-Level Security (RLS)** for multi-tenant data isolation (`tenant_id`). Target infrastructure cost: **< $0.25 / tenant / month**.
* **Zero-Cost WhatsApp Bridge:** Do not integrate Meta Cloud API in Phase 1 (eliminates KYC hurdles and Meta verification delays). Use native client-side URI deep-linking (`wa.me/<phone>?text=<encoded_payload>`).
* **Offline Fallback:** IndexedDB local caching so job cards can be created without network connectivity and synced automatically when Wi-Fi re-establishes.

---

## 4. Governance & Decision-Making Protocol

### 4.1 Sole Decision Maker
* **Designated Lead:** Pugazhendhi (Founder & Product Lead).
* **Authority:** Exclusive sign-off on design mockups, architectural trade-offs, and budget disbursements.

### 4.2 Change Management & SLA
* **Scope Lock:** Once the Business Requirements Document (BRD) is frozen at the end of Week 1, zero feature additions will be permitted for the MVP.
* **The "Phase 2 Parking Lot":** Any new feature ideas emerging during development (e.g., inventory management, OBD-II scanner integration, multi-currency accounting) will be logged into the Phase 2 backlog.
* **Turnaround SLA:** Client will resolve architectural blockers or design approvals within **24 hours** to prevent sprint delays.

---

## 5. MVP Acceptance Criteria (Definition of Done)

The agency’s work will be formally accepted when the following 4 end-to-end flows run in production with zero errors:

1. **The 30-Second Check-In:** Workshop foreman can open the PWA, input vehicle number, customer phone, capture 2 photos, and tap *Create Job Card* in under 30 seconds.
2. **Instant WhatsApp Handoff:** Tapping *Send WhatsApp Update* opens the mechanic's native WhatsApp app with a pre-filled, personalized tracking link to the customer.
3. **Consumer Tracking Portal:** Customer clicks the link on their mobile device and sees a responsive, lightweight status tracker without requiring a login or app download.
4. **Data Isolation Verification:** Tenant A's dashboard can never query, read, or leak vehicle records belonging to Tenant B under any simulated API call.

