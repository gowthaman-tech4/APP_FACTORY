# BUSINESS REQUIREMENTS DOCUMENT (BRD) & USER STORY MATRIX
**Project Codename:** APP FACTORY  
**Authors:** Lead Business Analyst (Ex-Khatabook) & VP of Product (Ex-Swiggy)  
**Status:** Approved for Sprint 1 Development  

---

## 1. Feature Epics Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRODUCT EPIC MAP                              │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ EPIC 1: Check-In   │ EPIC 2: Khata &    │ EPIC 3: Customer Live Portal │
│ & Fast Billing     │ Credit Management  │ & Instant UPI Settlement     │
│ (Sub-30s workflows)│ (Automated alerts) │ (Zero app install needed)    │
└────────────────────┴────────────────────┴──────────────────────────────┘
```

---

## 2. User Stories with Gherkin Acceptance Criteria

### STORY 1.1: 5-Second Retail Fast Bill (Kirana Vertical)
> **As a** Kirana storekeeper during peak evening rush,  
> **I want to** enter the bill amount, customer phone, and item list in under 5 seconds,  
> **So that** I don't form long queues and avoid wasting money on paper receipt rolls.

```gherkin
Scenario: Successful Fast Bill with Cash / UPI
  Given the storekeeper is on the Terminal home screen
  When they tap "+ Fast Bill"
  And enter Customer Name "Ramesh", Phone "9876543210", Amount "450"
  And select Payment Mode "UPI QR"
  And tap "Save & WhatsApp Bill"
  Then the transaction is stored in the local database in under 50ms
  And the storekeeper's phone automatically launches native WhatsApp
  And a pre-filled message with a digital receipt link is loaded for the customer
```

---

### STORY 1.2: Customer Udhar (Credit) Khata Entry & Automated Reminder
> **As a** local shopkeeper who sells goods on credit,  
> **I want to** log an Udhar transaction with a promised due date,  
> **So that** the app can generate a polite WhatsApp payment reminder with a direct UPI payment link.

```gherkin
Scenario: Logging an Udhar Credit Transaction
  Given a customer takes ₹850 worth of provisions on credit
  When the shopkeeper selects Payment Mode "Udhar (Credit)"
  And sets Due Date "2026-11-20"
  Then the customer's balance updates with an amber "Udhar (Pending)" badge
  And the shopkeeper can tap "Send WhatsApp Reminder" at any time
  And the generated message contains a dynamic UPI payload:
    "upi://pay?pa=store@upi&pn=StoreName&am=850&cu=INR"
```

---

### STORY 2.1: Vehicle Check-In & Damage Photographic Proof (AutoCare Vertical)
> **As a** workshop mechanic,  
> **I want to** record vehicle plate number and snap 2 damage photos at check-in,  
> **So that** the customer cannot falsely claim that pre-existing scratches happened in my bay.

```gherkin
Scenario: Vehicle Check-In with Photos
  Given a car arrives with a scratched left fender
  When the mechanic opens "+ Check-In Vehicle"
  And enters Vehicle No "TN-01-AB-1234", Phone "9876543210", Package "Brake Service"
  And snaps photos using the device camera
  And taps "Create Job Card"
  Then the job card appears in the "Received" column of the bay Kanban
  And an encrypted public tracking token is generated for the customer
```

---

### STORY 2.2: Live Customer Repair Stepper (No Login Required)
> **As a** car owner who left their vehicle at the workshop,  
> **I want to** open the WhatsApp tracking link without creating an account or logging in,  
> **So that** I can see the exact repair stage and estimated cost in real-time.

```gherkin
Scenario: Customer views tracking page
  Given the mechanic advances job status to "In Repair"
  When the customer clicks the link in their WhatsApp message
  Then the web browser displays an animated progress bar showing:
    [Checked In] -> [Diagnosing] -> [In Repair (Active)] -> [Ready for Pickup]
  And displays the check-in photos, parts estimate, and a "Call Garage" button
```

---

## 3. Critical Edge Cases & Architectural Fallbacks

| Edge Case | Impact | Architectural Resolution |
| :--- | :--- | :--- |
| **No Internet Connection** | Shopkeeper cannot connect to cloud database | **IndexedDB Local Store:** Writes locally first; Service Worker auto-syncs when online. |
| **Invalid Customer Phone** | WhatsApp link fails or sends to wrong person | **E.164 Phone Normalizer:** Strips leading zeros, spaces, and auto-appends `+91` country code. |
| **Accidental Double-Tap** | Creates duplicate billing records | **Idempotency Key:** Client generates a UUID token per form session, blocking duplicate inserts within 5 seconds. |

