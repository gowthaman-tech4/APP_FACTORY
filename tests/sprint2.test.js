/**
 * APP FACTORY — Sprint 2 Alpha PWA Engine Test Suite
 * QA Automation Lead (Ex-BrowserStack)
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { renderFormFields } from '../src/components/FormRenderer.js';
import { TrackerEngine } from '../src/engine/trackerEngine.js';
import { AppCore } from '../src/engine/appCore.js';

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
console.log('🚀 APP FACTORY SPRINT 2 ALPHA PWA INTEGRATION TESTS');
console.log('======================================================\n');

const retailJson = JSON.parse(readFileSync(resolve('templates/retail.json'), 'utf8'));
const autocareJson = JSON.parse(readFileSync(resolve('templates/autocare.json'), 'utf8'));

// 1. DYNAMIC FORM RENDERER
console.log('1. Testing Dynamic Form Renderer:');
const htmlFields = renderFormFields(retailJson.fields);
assert(htmlFields.includes('id="field-customerName"'), 'Renders customerName text field');
assert(htmlFields.includes('id="field-paymentType"'), 'Renders paymentType select dropdown');
assert(htmlFields.includes('+91'), 'Renders E.164 phone input prefix');

// 2. CUSTOMER LIVE TRACKER ENGINE
console.log('\n2. Testing Customer Live Tracker Engine:');
const mockJob = { id: 991, statusKey: 'repairing', status: 'Work In Progress', amount: 85 };
const tracker = new TrackerEngine(autocareJson, mockJob);
const progress = tracker.getProgress();

assert(progress.percentage > 0 && progress.percentage <= 100, 'Calculates progress percentage');
assert(progress.steps.find(s => s.isActive)?.key === 'repairing', 'Identifies active step in state machine');

const payment = tracker.getPaymentPayload('apex@okaxis');
assert(payment.upiUri.includes('am=85.00') && payment.upiUri.includes('apex%40okaxis'), 'Generates valid NPCI UPI payment string');
assert(payment.qrCodeUrl.startsWith('https://api.qrserver.com/'), 'Generates dynamic QR image endpoint');

// 3. APP CORE RUNTIME ORCHESTRATOR
console.log('\n3. Testing App Core Runtime Orchestration:');
const app = new AppCore({ tenantId: 'sri_lakshmi_test', schema: retailJson });

let eventFired = false;
app.on('record:created', () => { eventFired = true; });

// Test validation failure
const failRes = app.createRecord({ customerName: '' });
assert(!failRes.success && failRes.errors.length > 0, 'Rejects invalid records with missing required fields');

// Test valid submission
const successRes = app.createRecord({
  customerName: 'Karthik',
  phone: '9876543210',
  itemsSummary: 'Rice, Dal, Oil',
  totalBill: 680,
  paymentType: 'UPI'
});
assert(successRes.success && successRes.record.id, 'Creates record and returns enriched object');
assert(eventFired === true, 'Dispatches record:created event to listeners');

// Test state advancement
const advanced = app.advanceRecord(successRes.record.id);
assert(advanced && advanced.statusKey, 'Advances record to next state');

// Test WhatsApp URL builder
const waUrl = app.getWhatsAppShareUrl(successRes.record);
assert(waUrl.includes('wa.me/919876543210') && waUrl.includes('680'), 'Generates valid WhatsApp deep link with amount and customer details');

console.log('\n------------------------------------------------------');
console.log(`SUMMARY: ${passedTests} of ${totalTests} Sprint 2 tests passed successfully.`);
console.log('------------------------------------------------------\n');
