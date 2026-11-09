/**
 * APP FACTORY — On-Site Field Pilot Activity Simulator
 * Author: VP of Product (Ex-Swiggy) & Lead BA (Ex-Khatabook)
 * Purpose: Simulates realistic shop traffic for Cohort Alpha & Beta pilot verification
 */

import { AppCore } from './appCore.js';

export class PilotSimulator {
  /**
   * Initializes simulator with target industry template
   * @param {Object} options
   * @param {string} options.tenantId
   * @param {Object} options.schema Industry schema (retail or autocare)
   */
  constructor({ tenantId, schema }) {
    this.app = new AppCore({ tenantId, schema });
    this.schema = schema;
  }

  /**
   * Generates a batch of realistic pilot transactions
   * @param {number} count Number of records to generate
   * @returns {Array<Object>} Generated pilot records
   */
  generateBatch(count = 5) {
    const isRetail = this.schema.industry?.toLowerCase().includes('retail');
    const records = [];

    for (let i = 0; i < count; i++) {
      let payload = {};
      if (isRetail) {
        const sampleItems = [
          '5kg Aashirvaad Atta, 1L Sunflower Oil',
          '2L Fresh Milk, 1kg Sugar, Good Day Biscuits',
          'Basmati Rice 10kg, Toor Dal 2kg',
          'Tata Tea Gold, Parle-G, Maggi Noodles 6pk',
          'Surf Excel 1kg, Dettol Soap 3pk'
        ];
        const names = ['Ramesh Kumar', 'Suresh Tailor', 'Kavitha Mam', 'Murugan Store', 'Priya Sundaram'];
        const modes = ['upi', 'cash', 'udhar'];
        const chosenMode = modes[i % modes.length];

        payload = {
          customerName: names[i % names.length],
          phone: `98765432${i}0`,
          itemsSummary: sampleItems[i % sampleItems.length],
          totalBill: Math.round(150 + Math.random() * 850),
          paymentType: chosenMode === 'upi' ? 'UPI QR Code' : chosenMode === 'udhar' ? 'Udhar / Credit (Pay Later)' : 'Cash',
          mode: chosenMode,
          dueDate: chosenMode === 'udhar' ? '2026-11-25' : ''
        };
      } else {
        const vehicles = ['TN-01-AB-1234', 'MH-02-C-8899', 'KA-05-D-4321', 'DL-04-E-5678', 'TS-09-F-9900'];
        const packages = ['Brake Pad Replacement', 'Oil & Filter Change', 'AC Gas Refill', 'General Service', 'Full Body Wash'];
        const names = ['Rajesh Kumar', 'Amit Sharma', 'Priya Sundaram', 'Vikram Singh', 'Karthik Raja'];

        payload = {
          vehicleNo: vehicles[i % vehicles.length],
          customerName: names[i % names.length],
          phone: `98123456${i}0`,
          serviceType: packages[i % packages.length],
          estimatedCost: Math.round(50 + Math.random() * 150),
          mode: 'repairing',
          title: vehicles[i % vehicles.length]
        };
      }

      const res = this.app.createRecord(payload);
      if (res.success) {
        records.push(res.record);
      }
    }

    return records;
  }
}
