# SPRINT 4 DETAILED EXECUTION PLAN (WEEK 4)
**Project:** APP FACTORY  
**Sprint Window:** Monday, Day 22 – Friday, Day 26 (Final Client Sign-Off on Saturday, Day 27)  
**Sprint Objective:** Production edge deployment on custom subdomains, multi-tenant CNAME router, SSL/CDN edge hardening, formal 100% IP Assignment transfer, and operational production runbook.  
**Sprint Budget Gate:** Milestone 4 Final Handover Acceptance (15% / $1,800)  

---

## 1. Squad Roster & Week 4 Core Responsibilities

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           WEEK 4 SQUAD ASSIGNMENTS                              │
├─────────────────────────┬──────────────────────┬────────────────────────────────┤
│ Role                    │ Owner Background     │ Primary Week 4 Deliverable     │
├─────────────────────────┼──────────────────────┼────────────────────────────────┤
│ Head of UI/UX Design    │ Ex-CRED / Canva      │ Brand Identity & Asset Package │
│ Lead Business Analyst   │ Ex-Khatabook         │ User Handover SOP Manual       │
│ VP of Product / PM      │ Ex-Swiggy            │ Commercial Launch & Governance │
│ Principal Architect     │ Ex-Stripe / Razorpay │ Multi-Tenant Subdomain Router  │
│ Staff PWA Engineer      │ Ex-Flipkart Lite     │ Production Build Optimization  │
│ QA & DevOps Lead        │ Ex-BrowserStack      │ Edge CDN, SSL & Runbook        │
└─────────────────────────┴──────────────────────┴────────────────────────────────┘
```

---

## 2. Day-by-Day Master Schedule (Monday to Friday)

### 🗓️ MONDAY (Day 22) — Multi-Tenant Subdomain & Custom CNAME Routing

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **09:30 AM** | **All Squad** | **Sprint 4 Kickoff:** Review Milestone 3 pilot telemetry; lock scope on custom domains and production release gates. | Sprint 4 Board active |
| **11:00 AM** | **Principal Architect** | Implement `src/engine/tenantRouter.js`: Resolves tenant from hostname (e.g., `sri-lakshmi.appfactory.in` or custom domain `bills.lakshmistore.com`). | Multi-Tenant Router Engine |
| **01:30 PM** | **DevOps/QA Lead** | Configure Cloudflare Wildcard DNS (`*.appfactory.in`) and SSL termination with Edge Caching. | Global Edge SSL active |
| **03:30 PM** | **Head of Design** | Finalize export of SVG logos, maskable PWA icons (192px/512px), and high-resolution marketing banners. | Production Asset Pack |
| **05:00 PM** | **Staff PWA Eng** | Run tree-shaking and minification on production assets to ensure sub-100KB initial bundle size. | Production bundle report (< 95KB) |

---

### 🗓️ TUESDAY (Day 23) — Automated Database Backups & Disaster Recovery

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **10:00 AM** | **Principal Architect** | Set up daily automated PostgreSQL pg_dump backups with 30-day point-in-time recovery (PITR) to S3/GCS. | Automated Cloud Backup Pipeline |
| **11:30 AM** | **DevOps/QA Lead** | Execute Disaster Recovery drill: simulate database restore from snapshot in < 8 minutes with 0 data loss. | DR Drill Verification Log |
| **02:00 PM** | **Lead BA** | Compile **Shopkeeper Quick-Start Card**: 1-page laminated visual SOP explaining 5-second billing and UPI QR setup. | Shopkeeper 1-Page SOP Guide |
| **04:00 PM** | **Staff PWA Eng** | Integrate Sentry / LogRocket crash monitoring with zero-PII data redaction for tenant privacy. | Live Error Monitoring Dashboard |
| **05:30 PM** | **VP of Product** | Review tenant onboarding self-service flow: verify shopkeepers can launch their store in < 2 minutes. | Onboarding Speed Audit (< 90s) |

---

### 🗓️ WEDNESDAY (Day 24) — Production Runbook & Documentation

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **09:30 AM** | **DevOps/QA Lead** | Author `docs/PRODUCTION_RUNBOOK.md`: Step-by-step infrastructure provisioning, secrets management, and rollback steps. | Complete Production Runbook |
| **11:30 AM** | **Principal Architect** | Document database schema migrations and multi-tenant scaling thresholds (up to 10,000 active shops). | Scalability Whitepaper |
| **02:00 PM** | **Head of Design** | Complete final UX polish: micro-animation easing, button press feedback, and print alignment audits. | Final UI Design Polish |
| **04:00 PM** | **Lead BA** | Verify all currency symbols, state transitions, and vernacular translations across both industry templates. | Domain Compliance Sign-Off |
| **05:30 PM** | **QA Lead** | Run automated security penetration tests (SQL injection, XSS, CSRF, and tenant isolation probes). | Security Pen-Test Report (0 CVEs) |

---

### 🗓️ THURSDAY (Day 25) — Intellectual Property (IP) Assignment & Code Freeze

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **10:00 AM** | **VP of Product & Legal** | Draft `docs/IP_ASSIGNMENT_AGREEMENT.md`: 100% complete assignment of all source code, patents, algorithms, and branding to Pugazhendhi. | Formal IP Assignment Contract |
| **11:30 AM** | **All Squad** | **Code Freeze:** Tag git release `v1.0.0-production`. No further commits permitted without Change Advisory Board sign-off. | Git Production Tag v1.0.0 |
| **02:00 PM** | **DevOps/QA Lead** | Final end-to-end regression test suite execution across all 4 sprint suites (100% pass mandate). | Final QA Green Certificate |
| **04:00 PM** | **Principal Architect** | Generate GitHub repository transfer tokens and cloud admin credential handover package. | Credentials Vault Package |

---

### 🗓️ FRIDAY (Day 26) — Final Handover & Production Go-Live Demo

| Time | Member | Direct Tasks & Execution | EOD Deliverable |
| :--- | :--- | :--- | :--- |
| **10:00 AM** | **All Squad** | Final rehearsal of the complete multi-tenant production engine on live custom subdomains. | Live Production Staging Green |
| **02:00 PM** | **VP of Product** | Prepare **Final Milestone 4 Handover Package**: Git repository transfer, cloud console access, and legal IP assignment. | Handover Dossier |
| **04:30 PM** | **All Squad + Client** | **OFFICIAL FINAL HANDOVER DEMO with Pugazhendhi:** Live demonstration of multi-tenant app creation, real shop transactions, and handover ceremony. | Final Project Sign-Off |

---

## 3. Saturday (Day 27): Final Project Acceptance & Contract Close

* **Formal Close Gate:** Client (Pugazhendhi) reviews all code, live endpoints, and IP assignment documents.
* **Deliverables Handed Over for Payment Gate 4 (15% / \$1,800):**
  1. 100% Production Codebase with Git history.
  2. Multi-tenant subdomain router (`src/engine/tenantRouter.js`).
  3. Formal Intellectual Property (IP) Assignment Agreement.
  4. Complete Production Runbook and Disaster Recovery procedures.
  5. Comprehensive automated test suite (65+ tests passing with 0 errors).
* **Project Status:** **COMPLETED & TRANSFERRED.**
