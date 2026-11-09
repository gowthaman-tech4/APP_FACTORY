/**
 * APP FACTORY — Khata (Credit) Ledger Engine
 * Author: Lead Business Analyst (Ex-Khatabook) & Solution Architect (Ex-Stripe)
 * Architecture: Double-Entry Customer Credit & Partial Payment Reconciliation
 */

import { generateUpiUri } from '../utils/whatsapp.js';

/**
 * Calculates overdue severity level based on promised payment date
 * @param {string} dueDateStr ISO date string
 * @returns {{ daysOverdue: number, severity: 'on_track'|'gentle_due'|'follow_up'|'critical_recovery'|'normal' }}
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

export class KhataLedger {
  /**
   * Initializes Khata Ledger for a tenant
   * @param {string} tenantId
   * @param {string} shopName
   * @param {string} [upiId='store@upi']
   */
  constructor({ tenantId, shopName, upiId = 'store@upi' }) {
    this.tenantId = tenantId;
    this.shopName = shopName;
    this.upiId = upiId;
    this.customers = new Map(); // Key: normalizedPhone
  }

  /**
   * Adds an Udhar (Credit) purchase debit entry
   * @param {Object} params
   * @param {string} params.customerName
   * @param {string} params.phone
   * @param {number} params.amount Purchase amount
   * @param {string} params.items Summary of goods
   * @param {string} [params.dueDate] ISO promised payment date
   * @returns {Object} Customer account statement
   */
  addDebitEntry({ customerName, phone, amount, items, dueDate = '' }) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    let account = this.customers.get(cleanPhone);

    if (!account) {
      account = {
        name: customerName,
        phone: cleanPhone,
        totalOutstanding: 0,
        entries: [],
        createdAt: new Date().toISOString()
      };
      this.customers.set(cleanPhone, account);
    }

    const entry = {
      id: `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: 'debit',
      amount: Math.round(Number(amount)),
      items: items || 'Groceries & Provisions',
      dueDate: dueDate || '',
      date: new Date().toISOString()
    };

    account.entries.unshift(entry);
    account.totalOutstanding += entry.amount;

    return {
      phone: cleanPhone,
      name: account.name,
      totalOutstanding: account.totalOutstanding,
      newEntry: entry
    };
  }

  /**
   * Records a settlement or partial payment
   * @param {string} phone
   * @param {number} paymentAmount Amount paid
   * @param {'upi'|'cash'} [mode='upi']
   * @returns {{ success: boolean, remainingBalance: number, entry?: Object }}
   */
  recordPayment(phone, paymentAmount, mode = 'upi') {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const account = this.customers.get(cleanPhone);

    if (!account) {
      return { success: false, remainingBalance: 0, error: 'Customer not found' };
    }

    const payVal = Math.round(Number(paymentAmount));
    const entry = {
      id: `PAY_${Date.now()}`,
      type: 'credit',
      amount: payVal,
      mode,
      date: new Date().toISOString()
    };

    account.entries.unshift(entry);
    account.totalOutstanding = Math.max(0, account.totalOutstanding - payVal);

    return {
      success: true,
      remainingBalance: account.totalOutstanding,
      entry
    };
  }

  /**
   * Computes overdue status and returns WhatsApp reminder payload
   * @param {string} phone
   * @returns {Object|null}
   */
  getReminderPayload(phone) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const account = this.customers.get(cleanPhone);
    if (!account || account.totalOutstanding <= 0) return null;

    // Find earliest unpaid due date
    const lastDebit = account.entries.find(e => e.type === 'debit' && e.dueDate);
    const dueDate = lastDebit ? lastDebit.dueDate : '';

    const upiUri = generateUpiUri({
      upiId: this.upiId,
      payeeName: this.shopName,
      amount: account.totalOutstanding,
      transactionRef: `KHATA_${cleanPhone.slice(-4)}_${Date.now().toString().slice(-4)}`
    });

    const message =
      `Namaste ${account.name}ji! 🙏\n\n` +
      `Gentle courtesy reminder from *${this.shopName}*:\n` +
      `Your pending Udhar balance is *₹${account.totalOutstanding}*${dueDate ? ` (Due: ${dueDate})` : ''}.\n\n` +
      `⚡ *Pay in 1-click via UPI (GPay/PhonePe/Paytm):*\n${upiUri}\n\n` +
      `Thank you for shopping local with us!`;

    return {
      phone: cleanPhone,
      customerName: account.name,
      totalOutstanding: account.totalOutstanding,
      dueDate,
      upiUri,
      message,
      waLink: `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`
    };
  }
}
