# APP FACTORY — PRODUCTION RUNBOOK & DEVOPS MANUAL
**Document Version:** 1.0.0 (Production Release)  
**Author:** QA & DevOps Automation Lead (Ex-BrowserStack) & Principal Architect (Ex-Stripe)  
**Target Environment:** Vercel Global Edge CDN + Supabase Multi-Tenant PostgreSQL 15  

---

## 1. Production Architecture Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GLOBAL EDGE NETWORK                             │
│                                                                        │
│   Cloudflare DNS (*.appfactory.in) ──► Vercel Edge Global CDN          │
│                                        • Wildcard SSL / TLS 1.3        │
│                                        • Sub-50ms Edge SSR & Caching   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    MULTI-TENANT PERSISTENCE LAYER                      │
│                                                                        │
│   Supabase / Neon PostgreSQL 15 Cluster                                │
│   • Row-Level Security (RLS) Enforced Partitioning                     │
│   • Connection Pooler (PgBouncer: Port 6543)                           │
│   • Automated Daily pg_dump Backups + 30-Day PITR                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Environment Variables Specification

Create `.env.production` with the following validated secrets:

```env
# Application Core
NODE_ENV=production
NEXT_PUBLIC_BASE_DOMAIN=appfactory.in
NEXT_PUBLIC_APP_URL=https://appfactory.in

# Supabase PostgreSQL Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database Direct Connection (For migrations)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.your-project.supabase.co:5432/postgres

# Monitoring & Crash Reporting
NEXT_PUBLIC_SENTRY_DSN=https://example@sentry.io/123456
```

---

## 3. Database Deployment & Migration Runbook

Execute the following commands to initialize the production database schema:

```bash
# 1. Authenticate to Supabase CLI
npx supabase login

# 2. Link your production cloud project
npx supabase link --project-ref your-project-ref

# 3. Apply the Multi-Tenant RLS Schema
npx supabase db execute --file database/init.sql

# 4. Verify RLS Security Policy Status
npx supabase db execute --command "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';"
```

---

## 4. Wildcard Subdomain & Custom CNAME DNS Setup

### Cloudflare Wildcard DNS Configuration
Add the following DNS records in your Cloudflare / DNS provider dashboard:

| Type | Name | Content | Proxy Status | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `@` | `cname.vercel-dns.com` | DNS Only (Gray Cloud) | Root platform landing |
| **CNAME** | `*` | `cname.vercel-dns.com` | DNS Only (Gray Cloud) | Wildcard shop subdomains (`*.appfactory.in`) |

### Custom Domain CNAME Routing (For Pro Shops)
When a shopkeeper uses their own domain (e.g. `bills.srilakshmistore.com`):
1. Shopkeeper creates CNAME: `bills.srilakshmistore.com` ➔ `cname.appfactory.in`.
2. App Factory adds domain to Vercel Domains API. SSL is auto-provisioned via Let's Encrypt in < 60 seconds.

---

## 5. Automated Backups & Disaster Recovery (DR)

* **RPO (Recovery Point Objective):** < 15 minutes.
* **RTO (Recovery Time Objective):** < 10 minutes.

### Executing an Emergency Database Restore:
```bash
# 1. Fetch latest encrypted cloud snapshot
aws s3 cp s3://appfactory-backups/latest-snapshot.dump.gz ./restore.dump.gz

# 2. Decompress snapshot
gzip -d restore.dump.gz

# 3. Restore to target PostgreSQL instance
pg_restore -h db.your-project.supabase.co -U postgres -d postgres -v -c restore.dump
```
