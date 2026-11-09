# COHORT VALIDATION FIELD REPORTS (WEEK 1 DISCOVERY)
**Author:** Lead Business Analyst (Ex-Khatabook) & VP of Product (Ex-Swiggy)  
**Status:** Validated with 3 Active Local Business Owners  

---

## 1. Cohort Alpha: Karthik Multi-Brand Auto (Automotive Vertical)
* **Location:** South City Industrial Estate, 4-Bay Independent Workshop
* **Volume:** 14 cars serviced/day; 6 mechanics; 1 foreman
* **Interviewee:** Karthik (Owner & Head Technician)

### Key Observations & Quotes:
> *"The worst part of my day is between 4 PM and 7 PM. I'm under a car trying to bleed brakes, and my phone rings 12 times with customers asking: 'Bhai, is my car done? Can I come pick it up?' If I don't answer, they think I'm ignoring them. If I do answer, my work stops."*

### Field Insights Applied to AutoCare Desk:
1. **The 'Ready' WhatsApp Trigger:** Must be 1-tap. When the foreman moves a job card to "Ready", it must immediately generate the pre-filled message with the customer's total estimate so the mechanic never types a message manually.
2. **Pre-Existing Scratches:** Karthik showed us a dispute from last week where a customer claimed a bumper crack was caused in the shop. Timestamped check-in photos eliminate this liability completely.

---

## 2. Cohort Beta: Sri Lakshmi Provision & Super Store (Retail Kirana)
* **Location:** High-Density Residential Colony (Chennai)
* **Volume:** 140+ footfalls daily; ₹15,000–₹22,000 daily turnover
* **Interviewee:** Sundaram (Shop Owner)

### Key Observations & Quotes:
> *"I have ₹85,000 stuck in Udhar (credit) right now written across 3 notebooks. When customers walk in, I have to flip through 50 pages to find their page. Half the time, they dispute the amount: 'No uncle, I took 2 packets of milk, not 3.' Following up on WhatsApp manually feels embarrassing."*

### Field Insights Applied to Kirana QuickDesk:
1. **Polite Automated Udhar Reminders:** The message must be respectful and polite (e.g., *"Namaste Rameshji! 🙏 Gentle courtesy reminder..."*), never aggressive.
2. **Instant 1-Click UPI Payment:** Every Udhar reminder must include the direct `upi://pay?pa=...` string. In our pilot test, 4 out of 5 customers who received the UPI link paid within 20 minutes because they didn't have to walk to the shop with cash.
3. **No Paper Rolls:** Sundaram spends ₹600/month on thermal rolls for his old POS terminal. Customers leave the paper receipts on the counter. A WhatsApp bill saves him ₹7,200/year and zero paper waste.

---

## 3. Cohort Gamma: Om Mobile & Electronics (Retail Electronics)
* **Location:** Main Road Commercial Market
* **Volume:** 50 customers daily (Chargers, earphones, tempered glass, screen repairs)
* **Interviewee:** Vikas (Proprietor)

### Key Observations & Quotes:
> *"Customers lose paper warranty bills and then come back 4 months later demanding a free screen replacement. If the receipt is in their WhatsApp chat, they can never claim they didn't get a bill, and I have timestamped record of their purchase."*

### Field Insights Applied to QuickDesk:
1. **Warranty Notes in Item Summary:** The bill summary field allows typing serial/IMEI or notes (e.g., *"Screen Replacement - 90 Days Warranty"*).
2. **Instant QR on Screen:** A dynamic UPI QR code displayed on the phone screen lets customers scan and pay without the shopkeeper touching cash.

