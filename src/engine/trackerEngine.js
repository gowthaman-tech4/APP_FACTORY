/**
 * APP FACTORY — Customer Live Tracking & Receipt Engine
 * Author: Principal Solutions Architect & Head of Design
 * Purpose: Computes animated progress, invoice details & 1-click payment states
 */

import { generateUpiUri } from '../utils/whatsapp.js';

export class TrackerEngine {
  /**
   * Initializes tracking engine with schema states and record data
   * @param {Object} schema Industry template schema
   * @param {Object} record Active customer record
   */
  constructor(schema, record) {
    this.schema = schema;
    this.record = record;
  }

  /**
   * Calculates progress percentage and active step details
   * @returns {Object} Progress metrics
   */
  getProgress() {
    const states = this.schema.states || [];
    const currentIndex = states.findIndex(s => s.key === this.record.statusKey || s.label === this.record.status);
    const activeIndex = currentIndex !== -1 ? currentIndex : 0;
    const totalStates = states.length;
    const percentage = Math.round(((activeIndex + 1) / totalStates) * 100);

    return {
      activeIndex,
      totalStates,
      percentage,
      currentState: states[activeIndex] || { label: this.record.status, key: 'unknown' },
      isComplete: activeIndex === totalStates - 1,
      steps: states.map((s, idx) => ({
        ...s,
        isPassed: idx < activeIndex,
        isActive: idx === activeIndex,
        isPending: idx > activeIndex
      }))
    };
  }

  /**
   * Generates dynamic NPCI UPI QR code and payment URI
   * @param {string} [merchantUpiId] Business UPI VPA
   * @returns {Object} Payment payload
   */
  getPaymentPayload(merchantUpiId) {
    const upiId = merchantUpiId || this.schema.branding?.upiId || 'store@upi';
    const amount = Number(this.record.amount || 0);
    const upiUri = generateUpiUri({
      upiId,
      payeeName: this.schema.branding?.defaultName || 'Store',
      amount,
      transactionRef: `BILL_${this.record.id}`
    });

    // Cloud QR server standard URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUri)}`;

    return {
      upiId,
      amount,
      upiUri,
      qrCodeUrl,
      isPaid: this.record.status?.toLowerCase().includes('paid') || this.record.mode === 'paid_cash' || this.record.mode === 'paid_upi'
    };
  }
}
