/**
 * APP FACTORY — Week 3 Live Pilot, Sync Queue & i18n Test Suite
 * Authors: QA Automation Lead (Ex-BrowserStack) & Principal Architect (Ex-Stripe)
 */

import { CloudSyncAdapter } from '../src/adapters/supabaseAdapter.js';
import { I18nManager, DICTIONARIES } from '../src/utils/i18n.js';
import { PerformanceMonitor } from '../src/utils/perfMonitor.js';
import { saveRecordLocally } from '../src/utils/storage.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    console.error(`  ✗ [FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

console.log('\n======================================================');
console.log('🚀 APP FACTORY WEEK 3 SYNC & LOCALIZATION TESTS');
console.log('======================================================\n');

// 1. CLOUD SYNC QUEUE OUTBOX RECONCILIATION
console.log('1. Testing Cloud PostgreSQL Sync Queue Adapter:');
const testTenant = 'pilot_tenant_karthik';
// Seed 2 unsynced records
saveRecordLocally(testTenant, { title: 'TN-01-AB-1234', amount: 85, customerName: 'Rajesh' });
saveRecordLocally(testTenant, { title: 'MH-02-C-8899', amount: 65, customerName: 'Amit' });

const syncAdapter = new CloudSyncAdapter({ tenantId: testTenant });
const pendingBefore = syncAdapter.getPendingRecords();
assert(pendingBefore.length >= 2, 'Identifies unsynced offline records in outbox queue');

const syncResult = await syncAdapter.syncPendingRecords();
assert(syncResult.syncedCount >= 2, 'Batches and reconciles offline outbox records to cloud');

const pendingAfter = syncAdapter.getPendingRecords();
assert(pendingAfter.length === 0, 'Reconciles queue to zero pending records after sync');

// 2. INDIC MULTI-LANGUAGE LOCALIZATION TESTS
console.log('\n2. Testing Indic Localization Engine (English, Tamil, Hindi):');
const i18n = new I18nManager('en');

assert(i18n.t('shopTerminal') === 'Shop Terminal', 'Resolves English label correctly');

// Switch to Tamil
i18n.setLanguage('ta');
assert(i18n.t('shopTerminal') === 'கடை முனையம்', 'Resolves Tamil (தமிழ்) translation');
assert(i18n.t('udharPending') === 'கடன் பாக்கி (Udhar)', 'Renders vernacular credit terminology in Tamil');

// Switch to Hindi
i18n.setLanguage('hi');
assert(i18n.t('shopTerminal') === 'दुकान टर्मिनल', 'Resolves Hindi (हिन्दी) translation');
assert(i18n.t('paidUpi') === 'प्राप्त (UPI)', 'Renders vernacular UPI payment confirmation in Hindi');

// Fallback check
assert(i18n.t('non_existent_key', 'Fallback Text') === 'Fallback Text', 'Gracefully falls back for unmapped keys');

// 3. LOW-END DEVICE PERFORMANCE & BATTERY AUDIT
console.log('\n3. Testing Device Performance & Profiling:');
const monitor = new PerformanceMonitor();
assert(monitor.metrics !== undefined, 'Audits device hardware profile constraints');

const taskMeasure = await monitor.measureTask('Local JSON Parse', () => {
  return JSON.parse('{"status": "ok", "items": [1,2,3]}');
});
assert(taskMeasure.durationMs >= 0 && taskMeasure.durationMs < 50, 'Measures execution benchmark latency (< 50ms)');

const battery = await monitor.getBatteryStatus();
assert(battery.level >= 0 && battery.level <= 100, 'Returns valid battery percentage metrics');

console.log('\n------------------------------------------------------');
console.log(`SUMMARY: ${passedTests} of ${totalTests} Week 3 tests passed successfully.`);
console.log('------------------------------------------------------\n');

