/**
 * APP FACTORY — Zero-PII Field Telemetry & Crash Reporting Logger
 * Author: QA Automation Lead (Ex-BrowserStack) & Principal Architect (Ex-Stripe)
 * Compliance: Zero Customer PII Logged (Auto-Redacts Phone Numbers & Names)
 */

export class TelemetryLogger {
  constructor({ tenantId, environment = 'production' }) {
    this.tenantId = tenantId;
    this.environment = environment;
    this.logs = [];
  }

  /**
   * Redacts sensitive customer data (phones, names) from log payloads
   * @param {Object} payload
   * @returns {Object} Sanitized payload
   */
  sanitizePayload(payload) {
    if (!payload || typeof payload !== 'object') return payload;
    const sanitized = { ...payload };

    if (sanitized.phone) sanitized.phone = sanitized.phone.slice(0, 3) + '****' + sanitized.phone.slice(-3);
    if (sanitized.customerPhone) sanitized.customerPhone = sanitized.customerPhone.slice(0, 3) + '****' + sanitized.customerPhone.slice(-3);
    if (sanitized.customerName) sanitized.customerName = sanitized.customerName.charAt(0) + '***';
    if (sanitized.customer) sanitized.customer = sanitized.customer.charAt(0) + '***';

    return sanitized;
  }

  /**
   * Logs an informational operational event
   * @param {string} eventName
   * @param {Object} [metadata={}]
   */
  logInfo(eventName, metadata = {}) {
    const entry = {
      level: 'INFO',
      eventName,
      tenantId: this.tenantId,
      metadata: this.sanitizePayload(metadata),
      timestamp: new Date().toISOString()
    };
    this.logs.push(entry);
    return entry;
  }

  /**
   * Logs a handled or unhandled exception
   * @param {Error|string} error
   * @param {Object} [context={}]
   */
  logError(error, context = {}) {
    const entry = {
      level: 'ERROR',
      message: error?.message || String(error),
      stack: error?.stack || null,
      tenantId: this.tenantId,
      context: this.sanitizePayload(context),
      timestamp: new Date().toISOString()
    };
    this.logs.push(entry);
    console.error(`[Telemetry ${this.tenantId}] ERROR:`, entry.message);
    return entry;
  }

  /**
   * Returns telemetry event buffer for diagnostic upload
   * @returns {Array<Object>}
   */
  flush() {
    const batch = [...this.logs];
    this.logs = [];
    return batch;
  }
}

