/**
 * APP FACTORY — Local-First Offline Storage Engine
 * Author: Staff PWA Engineer (Ex-Flipkart Lite)
 * Architecture: Instant Local-First Write with Background Sync Simulation
 */

const STORAGE_PREFIX = 'APP_FACTORY_TENANT_';

// In-memory fallback for Node.js / SSR / testing environments
const memStore = new Map();

function getStoreValue(key) {
  try {
    if (typeof localStorage !== 'undefined' && localStorage && typeof localStorage.getItem === 'function') {
      const val = localStorage.getItem(key);
      if (val !== null) return val;
    }
  } catch (e) {
    // Fall back to memStore
  }
  return memStore.get(key) || null;
}

function setStoreValue(key, value) {
  try {
    if (typeof localStorage !== 'undefined' && localStorage && typeof localStorage.setItem === 'function') {
      localStorage.setItem(key, value);
    }
  } catch (e) {
    // Fall back to memStore
  }
  memStore.set(key, value);
}

/**
 * Generates an idempotency key to prevent accidental double-tap inserts
 * @returns {string} Unique idempotency token
 */
export function generateIdempotencyKey() {
  return `IDEMP_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Stores a transaction record locally with zero latency (< 10ms)
 * @param {string} tenantId Tenant identifier
 * @param {Object} record Record payload
 * @returns {Object} Stored record with metadata
 */
export function saveRecordLocally(tenantId, record) {
  const key = `${STORAGE_PREFIX}${tenantId}_RECORDS`;
  const existing = getLocalRecords(tenantId);

  // Check if idempotency key was already processed within last 5 seconds
  if (record.idempotencyKey) {
    const duplicate = existing.find(r => r.idempotencyKey === record.idempotencyKey);
    if (duplicate) {
      return duplicate;
    }
  }

  const enrichedRecord = {
    ...record,
    id: record.id || `REC_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    publicToken: record.publicToken || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    createdAt: new Date().toISOString(),
    synced: false // Flag for background worker sync to PostgreSQL
  };

  existing.unshift(enrichedRecord);
  setStoreValue(key, JSON.stringify(existing));

  return enrichedRecord;
}

/**
 * Retrieves all stored records for a given tenant
 * @param {string} tenantId Tenant identifier
 * @returns {Array<Object>} List of tenant records
 */
export function getLocalRecords(tenantId) {
  const key = `${STORAGE_PREFIX}${tenantId}_RECORDS`;
  try {
    const raw = getStoreValue(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed reading local records:', e);
  }
  return [];
}

/**
 * Updates a record status in local storage (e.g., Udhar settled or bay advanced)
 * @param {string} tenantId
 * @param {string|number} recordId
 * @param {Object} patch Updates to merge
 * @returns {Object|null} Updated record
 */
export function updateRecordLocally(tenantId, recordId, patch) {
  const key = `${STORAGE_PREFIX}${tenantId}_RECORDS`;
  const records = getLocalRecords(tenantId);
  const index = records.findIndex(r => r.id == recordId);

  if (index !== -1) {
    records[index] = { ...records[index], ...patch, updatedAt: new Date().toISOString() };
    setStoreValue(key, JSON.stringify(records));
    return records[index];
  }
  return null;
}
