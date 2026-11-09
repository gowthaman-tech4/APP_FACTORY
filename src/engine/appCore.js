/**
 * APP FACTORY — Application Core Runtime Orchestrator
 * Author: VP of Product (Ex-Swiggy) & Principal Architect (Ex-Stripe)
 * Purpose: Manages multi-tenant lifecycle, state transitions & event dispatching
 */

import { SchemaEngine } from './schemaParser.js';
import { saveRecordLocally, getLocalRecords, updateRecordLocally } from '../utils/storage.js';
import { buildWhatsAppLink } from '../utils/whatsapp.js';

export class AppCore {
  /**
   * Initializes runtime orchestrator
   * @param {Object} options Configuration
   * @param {string} options.tenantId Unique tenant identifier
   * @param {Object} options.schema Industry template schema
   */
  constructor({ tenantId, schema }) {
    this.tenantId = tenantId;
    this.engine = new SchemaEngine(schema);
    this.schema = schema;
    this.listeners = new Map();
  }

  /**
   * Switches the active industry template in real-time
   * @param {Object} newSchema
   */
  switchTemplate(newSchema) {
    this.schema = newSchema;
    this.engine = new SchemaEngine(newSchema);
    this.emit('template:changed', this.schema);
  }

  /**
   * Submits a new record (Vehicle check-in or Retail bill)
   * @param {Object} formData User form input
   * @returns {{ success: boolean, record?: Object, errors?: Array<string> }}
   */
  createRecord(formData) {
    const validation = this.engine.validateFormData(formData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const defaultState = this.engine.getStates()[0];
    const newRecord = saveRecordLocally(this.tenantId, {
      ...formData,
      statusKey: defaultState?.key || 'initial',
      status: defaultState?.label || 'Created',
      mode: formData.mode || 'default',
      amount: Number(formData.amount || formData.totalBill || formData.cost || 0)
    });

    this.emit('record:created', newRecord);
    return { success: true, record: newRecord };
  }

  /**
   * Advances a record to the next lifecycle stage
   * @param {string|number} recordId
   * @returns {Object|null}
   */
  advanceRecord(recordId) {
    const records = getLocalRecords(this.tenantId);
    const target = records.find(r => r.id == recordId);
    if (!target) return null;

    const nextState = this.engine.getNextState(target.statusKey);
    if (!nextState) return target; // Already at terminal state

    const updated = updateRecordLocally(this.tenantId, recordId, {
      statusKey: nextState.key,
      status: nextState.label
    });

    this.emit('record:advanced', updated);
    return updated;
  }

  /**
   * Generates WhatsApp message link for a given record
   * @param {Object} record
   * @returns {string} wa.me URL
   */
  getWhatsAppShareUrl(record) {
    const branding = this.engine.getBranding();
    const isUdhar = record.mode === 'udhar' || record.status?.toLowerCase().includes('udhar');

    let templateType = 'retail_bill';
    if (this.schema.industry?.toLowerCase().includes('auto')) {
      templateType = 'autocare_status';
    } else if (isUdhar) {
      templateType = 'retail_udhar';
    }

    return buildWhatsAppLink({
      customerPhone: record.phone || record.customerPhone,
      customerName: record.customerName || record.customer || 'Customer',
      shopName: branding.defaultName,
      templateType,
      data: {
        id: record.id,
        amount: record.amount,
        itemsSummary: record.itemsSummary || record.subtitle,
        vehicleNo: record.vehicle || record.title,
        status: record.status,
        currency: branding.currency,
        dueDate: record.dueDate
      }
    });
  }

  /**
   * Simple event emitter
   */
  on(event, callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(data));
    }
  }
}
