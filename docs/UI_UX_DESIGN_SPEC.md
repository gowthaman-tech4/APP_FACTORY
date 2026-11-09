# UI/UX DESIGN SYSTEM SPECIFICATION
**Project Codename:** APP FACTORY (Mobile Engine)  
**Author:** Head of UI/UX Design (Ex-CRED & Ex-Canva)  
**Target:** Low-End Android Smartphones (4G / 2GB RAM / 720p Displays)  
**Standard:** Greasy Finger & Direct Sunlight Ergonomics  

---

## 1. Ergonomic Foundation & Shop Floor Realities

Traditional SaaS design fails in local physical shops because designers assume users are sitting in air-conditioned offices on MacBooks. Our design system enforces 3 non-negotiable physical constraints:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   SHOP FLOOR ERGONOMIC CONSTRAINTS                     │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ 1. Sunlight Glare  │ 2. Greasy Fingers  │ 3. Ambient Noise Chaos       │
│ High-contrast OLED │ 48px+ touch targets│ Visual + Haptic micro-       │
│ dark & pure white  │ with 12px dead-    │ confirmations instead of     │
│ daylight modes     │ zone gutters       │ subtle audio dings           │
└────────────────────┴────────────────────┴──────────────────────────────┘
```

---

## 2. Color Tokens & Semantic System

```css
:root {
  /* Slate Core (Dark Base) */
  --bg-primary: #020617;     /* slate-950: OLED battery saving */
  --bg-surface: #0f172a;     /* slate-900: High-contrast elevation */
  --border-subtle: #1e293b;  /* slate-800: Sharp border definition */

  /* Semantic Action Accents */
  --accent-kirana: #059669;   /* emerald-600: Indian trust, money & prosperity */
  --accent-autocare: #2563eb; /* blue-600: Precision, engineering, mechanical reliability */
  --warning-udhar: #f59e0b;   /* amber-500: Credit due, needs attention */
  --danger-alert: #ef4444;    /* red-500: Vehicle hold, critical dispute */

  /* Text & Readability Tokens */
  --text-high-contrast: #f8fafc; /* slate-50: 16:1 contrast ratio against bg */
  --text-secondary: #94a3b8;     /* slate-400: Clear metadata labels */
}
```

---

## 3. The "Thumb-Zone" Layout Hierarchy

On a 6.5-inch Android smartphone, 75% of one-handed thumb interaction happens in the **lower 35% of the screen**:

```
┌─────────────────────────┐
│ [Shop Name & Status]   │  <-- Top 15%: Read-only glanceable info
├─────────────────────────┤
│                         │
│ [Active Work / Bills]   │  <-- Middle 50%: Scrollable card feed
│                         │
├─────────────────────────┤
│ [ + NEW BILL / ENTRY ]  │  <-- Bottom 35%: 100% of critical CTAs
│ [ Instant WhatsApp ]    │      (Large buttons, zero stretching)
└─────────────────────────┘
```

* **Minimum Touch Target:** 48px × 48px.
* **Button Spacing:** Minimum 12px separation between destructive actions (Delete) and primary actions (WhatsApp/Print) to prevent mis-clicks.

---

## 4. Typography Scale (Fluid & Legible)

Font Family: `Plus Jakarta Sans`, system fallback: `sans-serif`.

| Token | Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display Currency** | 28px | 800 (Bold) | 32px | Big Total Bill amounts (e.g., **₹1,450**) |
| **Card Heading** | 16px | 700 (Semi) | 22px | Vehicle Number / Customer Name |
| **Body Metadata** | 13px | 500 (Med)  | 18px | Items list, phone numbers |
| **Micro Badge** | 11px | 700 (Bold) | 14px | Status chips ("In Repair", "Udhar Due") |

---

## 5. Micro-Interactions & Haptic Feedback Spec

1. **The 1-Click WhatsApp Trigger:**
   * User taps `[ Send WhatsApp ]`.
   * Button instantly changes to a light emerald pulse: *"Opening WhatsApp..."*
   * Triggers a standard 15ms native Android haptic vibration (`navigator.vibrate(15)`).
2. **Offline Mode Badge:**
   * If network cuts out, a subtle amber pill slides down from the header: `⚡ Operating Offline • Auto-Syncing`.
   * Form submit buttons do **not** disable; they store to IndexedDB with zero latency.

