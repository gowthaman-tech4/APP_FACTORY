# RETAIL MATHEMATICS & UDHAR (CREDIT) ACCOUNTING SPECIFICATION
**Project:** APP FACTORY (Kirana & Retail QuickDesk)  
**Author:** Lead Business Analyst (Ex-Khatabook) & Solution Architect (Ex-Stripe)  
**Status:** Approved for Production Sprint 2  

---

## 1. Credit (Udhar) Ledger Arithmetic & Integrity Rules

In physical Indian Kirana shops, informal customer credit requires strict arithmetic integrity to prevent disputes:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        UDHAR BALANCE EQUATION                          │
│                                                                        │
│   Current Outstanding = Σ (Unpaid Debits) - Σ (Verified Credits/UPI)   │
└────────────────────────────────────────────────────────────────────────┘
```

### Rule 1: Zero Negative Balance
* A customer's Udhar balance cannot drop below ₹0.00. Overpayments are logged as an advance deposit (`advance_deposit: true`).

### Rule 2: Banker's Rounding for Sub-Rupee Values
* Loose weight items (e.g., 650g Sugar at ₹42/kg = ₹27.30).
* All transactions round to the nearest whole integer using standard round-half-to-even:
  * ₹27.49 ➔ ₹27.00
  * ₹27.50 ➔ ₹28.00

### Rule 3: Partial Payment Reconciliation
When a customer owes ₹850 and makes a partial payment of ₹500 via UPI:
1. The transaction status updates to `Udhar (Partial)`.
2. Remaining balance of ₹350 is retained in active ledger.
3. WhatsApp confirmation receipt is sent acknowledging ₹500 paid with updated remaining balance ₹350.

---

## 2. Overdue Day Counter Logic

```javascript
/**
 * Calculates overdue severity level based on promised payment date
 */
export function calculateOverdueSeverity(dueDateStr) {
  if (!dueDateStr) return { daysOverdue: 0, severity: 'normal' };
  
  const due = new Date(dueDateStr).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today - due) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return { daysOverdue: 0, severity: 'on_track' };
  if (diffDays <= 7) return { daysOverdue: diffDays, severity: 'gentle_due' };
  if (diffDays <= 21) return { daysOverdue: diffDays, severity: 'follow_up' };
  return { daysOverdue: diffDays, severity: 'critical_recovery' };
}
```

---

## 3. GST Calculation Modes (Inclusive vs. Exclusive)

Retailers can toggle whether prices are inclusive or exclusive of local GST:

| Tax Bracket | CGST | SGST | Effective Rate | Example on ₹1,000 Item |
| :--- | :--- | :--- | :--- | :--- |
| **Exempt / Essential** | 0% | 0% | 0% | Unpacked grains, fresh milk |
| **Fast-Moving Foods** | 2.5% | 2.5% | 5% | Edible oils, packaged tea |
| **Household Retail** | 6.0% | 6.0% | 12% | Processed foods, basic hardware |
| **Standard Consumer**| 9.0% | 9.0% | 18% | Biscuits, soaps, electronics accessories |
