/**
 * APP FACTORY — Core Engine Smoke & Integration Test Suite
 * QA Lead (Ex-BrowserStack) & Principal Architect (Ex-Stripe)
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { normalizePhone, generateUpiUri, buildWhatsAppLink } from '../src/utils/whatsapp.js';
import { SchemaEngine } from '../src/engine/schemaParser.js';
import { saveRecordLocally, getLocalRecords, generateIdempotencyKey } from '../src/utils/storage.js';

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
console.log('🚀 APP FACTORY SPRINT 1 INTEGRATION TEST SUITE');
console.log('======================================================\n');

// 1. PHONE NORMALIZATION TESTS
console.log('1. Testing Phone & UPI Deep-Link Utilities:');
assert(normalizePhone('9876543210') === '919876543210', 'Appends India +91 to 10-digit mobile');
assert(normalizePhone('+91 98765-43210') === '919876543210', 'Strips whitespace, symbols, and formatting');

const upiUri = generateUpiUri({ upiId: 'store@okaxis', payeeName: 'Sri Lakshmi Store', amount: 680 });
assert(upiUri.includes('pa=store%40okaxis') && upiUri.includes('am=680.00'), 'Constructs valid NPCI UPI payment deep link');

const waLink = buildWhatsAppLink({
  customerPhone: '9876543210',
  customerName: 'Ramesh',
  shopName: 'Sri Lakshmi Store',
  templateType: 'retail_bill',
  data: { amount: 680, itemsSummary: '5kg Atta, 1L Oil', paymentMode: 'UPI' }
});
assert(waLink.startsWith('https://wa.me/919876543210?text='), 'Generates valid wa.me URL for retail bill');

// 2. SCHEMA ENGINE & TEMPLATE VALIDATION
console.log('\n2. Testing Universal Schema Engine:');
const autocareJson = JSON.parse(readFileSync(resolve('templates/autocare.json'), 'utf8'));
const retailJson = JSON.parse(readFileSync(resolve('templates/retail.json'), 'utf8'));

const autoEngine = new SchemaEngine(autocareJson);
assert(autoEngine.getBranding().currency === '$' || autoEngine.getBranding().currency === '₹', 'AutoCare branding parsed');
assert(autoEngine.getStates().length >= 4, 'AutoCare has full lifecycle state machine');

const retailEngine = new SchemaEngine(retailJson);
assert(retailEngine.getBranding().currency === '₹', 'Retail branding correctly uses Indian Rupee (₹)');
const nextState = retailEngine.getNextState('udhar_pending');
assert(nextState && nextState.key === 'settled', 'State transition from Udhar to Settled verified');

const valResult = retailEngine.validateFormData({ customerName: '', phone: '9876543210' });
assert(!valResult.isValid && valResult.errors.length > 0, 'Detects missing required customer name');

// 3. STORAGE & IDEMPOTENCY KEY TESTS
console.log('\n3. Testing Storage & Idempotency Safeguards:');
const idempKey = generateIdempotencyKey();
const record1 = saveRecordLocally('test_tenant', { idempotencyKey: idempKey, customerName: 'Amit', amount: 100 });
const record2 = saveRecordLocally('test_tenant', { idempotencyKey: idempKey, customerName: 'Amit', amount: 100 });
assert(record1.id === record2.id, 'Idempotency key blocks duplicate record creation within window');

console.log('\n------------------------------------------------------');
console.log(`SUMMARY: ${passedTests} of ${totalTests} tests passed successfully.`);
console.log('------------------------------------------------------\n');

