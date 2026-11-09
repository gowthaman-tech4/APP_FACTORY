# SYSTEM ARCHITECTURE & TECHNICAL SPECIFICATION
**Project:** APP FACTORY (Engine v1.0)  
**Vertical:** AutoCare Desk  
**Role Author:** Lead Principal Solutions Architect  
**Review Status:** Approved for Sprint 1 Execution  

---

## 1. System Topology & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT ACCESS LAYER                             │
│                                                                        │
│   [ Mechanic / Shop PWA ]                  [ Customer Web Tracker ]    │
│   (Auth via Phone OTP / JWT)               (Tokenized Public Read-Only)│
└───────────────────┬────────────────────────────────────┬───────────────┘
                    │                                    │
                    ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     APPLICATION LOGIC & RUNTIME                        │
│                                                                        │
│   • Local-First Caching Layer (IndexedDB / Service Worker)             │
│   • State Transition Engine (State Machine Rules)                      │
│   • Native WhatsApp Deep-Link Encoder (wa.me URI Generator)           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      PERSISTENCE & SECURITY (RLS)                      │
│                                                                        │
│   • Multi-Tenant PostgreSQL Instance (Supabase / Neon)                 │
│   • Row-Level Security (RLS) partitioned by `tenant_id`                │
│   • Cloudflare Edge / Vercel Global CDN                                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Tenant Database DDL & Row-Level Security (RLS)

All tenant isolation is enforced at the database engine level via PostgreSQL Row-Level Security (RLS). A tenant can never read or mutate records belonging to another workshop.

```sql
-- 1. TENANTS TABLE (Each workshop account)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    currency VARCHAR(10) DEFAULT '$',
    theme_color VARCHAR(20) DEFAULT '#2563eb',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. JOB CARDS TABLE (Active & Historical Repair Records)
CREATE TABLE job_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    public_token VARCHAR(32) UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
    vehicle_no VARCHAR(50) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    service_package VARCHAR(100) NOT NULL,
    estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
    status VARCHAR(30) DEFAULT 'received' CHECK (status IN ('received', 'diagnosing', 'repairing', 'ready', 'delivered')),
    damage_photos JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_cards ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES (Enforce tenant boundary)
CREATE POLICY tenant_isolation_policy ON job_cards
    FOR ALL
    USING (tenant_id = auth.jwt() ->> 'tenant_id'::uuid);

-- 5. PUBLIC READ-ONLY ACCESS POLICY (For customer live tracker)
CREATE POLICY customer_public_tracking_policy ON job_cards
    FOR SELECT
    USING (public_token IS NOT NULL);
```

---

## 3. The Zero-Cost WhatsApp Protocol (`wa.me`)

To eliminate Meta API verification delays, message costs, and ban risks during Phase 1, the frontend implements a pure client-side deep-link payload generator:

```javascript
/**
 * Generates an instant native WhatsApp message URI
 */
function generateWhatsAppLink(job, tenant) {
  const cleanPhone = job.customer_phone.replace(/[^0-9]/g, '');
  const trackingUrl = `https://${window.location.host}/track?token=${job.public_token}`;
  
  const message = `Hello ${job.customer_name},\n\n` +
    `Your vehicle *${job.vehicle_no}* is now: *${job.status.toUpperCase()}* at ${tenant.business_name}.\n\n` +
    `Track live repair progress & estimate here:\n${trackingUrl}`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
```

---

## 4. Offline-First Resilience (IndexedDB Fallback)

1. When a mechanic taps **"Create Job Card"**, the payload is written directly to the browser's `IndexedDB` within **50 milliseconds**.
2. A background Service Worker attempts to synchronize the payload to the PostgreSQL database.
3. If the shop Wi-Fi cuts out, the app flags the card with a `synced: false` badge, allowing the shop floor to continue operating with zero interruption.

