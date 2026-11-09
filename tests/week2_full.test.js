/**
 * APP FACTORY — Week 2 Comprehensive Integration Test Suite
 * Authors: QA Lead (Ex-BrowserStack) & Lead BA (Ex-Khatabook)
 */

import { compressImage } from '../src/utils/cameraCompressor.js';
import { KhataLedger, calculateOverdueSeverity } from '../src/engine/khataLedger.js';

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
console.log('🚀 APP FACTORY WEEK 2 FULL INTEGRATION TESTS');
console.log('======================================================\n');

// 1. MOBILE CAMERA COMPRESSOR TESTS
console.log('1. Testing Client-Side Photo Compressor:');
const dummyBlob = { size: 5242880 }; // 5MB simulated photo
const compResult = await compressImage(dummyBlob, { maxWidth: 1200, maxHeight: 1200, quality: 0.75 });

assert(compResult.sizeBytes < 1000000, 'Compresses 5MB photo to under 1MB for fast 4G upload');
assert(compResult.savingsPercent >= 70, 'Achieves over 70% bandwidth reduction');
assert(compResult.dataUrl.startsWith('data:image/'), 'Outputs valid image data URL payload');

// 2. KHATA LEDGER ENGINE & PARTIAL SETTLEMENT TESTS
console.log('\n2. Testing Kirana Khata Ledger Engine:');
const khata = new KhataLedger({
  tenantId: 'sri_lakshmi',
  shopName: 'Sri Lakshmi Store',
  upiId: 'srilakshmi@okaxis'
});

// Add credit entry
const debit = khata.addDebitEntry({
  customerName: 'Suresh Tailor',
  phone: '9845671234',
  amount: 850,
  items: '2L Milk, 5kg Atta, Biscuits',
  dueDate: '2026-11-20'
});
assert(debit.totalOutstanding === 850, 'Records initial Udhar debit of ₹850');

// Record partial payment of ₹500
const partialPay = khata.recordPayment('9845671234', 500, 'upi');
assert(partialPay.success === true, 'Successfully processes partial payment');
assert(partialPay.remainingBalance === 350, 'Accurately reconciles remaining balance to ₹350');

// Reminder payload check
const reminder = khata.getReminderPayload('9845671234');
assert(reminder.totalOutstanding === 350, 'Reminder reflects updated ₹350 balance');
assert(reminder.upiUri.includes('am=350.00'), 'UPI deep link encodes exact remaining balance ₹350');
assert(reminder.waLink.startsWith('https://wa.me/919845671234?text='), 'Generates valid wa.me courtesy reminder link');

// Complete settlement of ₹350
const fullPay = khata.recordPayment('9845671234', 350, 'cash');
assert(fullPay.remainingBalance === 0, 'Zeroes out balance upon full settlement');

// 3. OVERDUE SEVERITY LOGIC TESTS
console.log('\n3. Testing Overdue Calculation Logic:');
const futureDate = new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0];
const pastDate = new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0];

assert(calculateOverdueSeverity(futureDate).severity === 'on_track', 'Detects future due date as on_track');
assert(calculateOverdueSeverity(pastDate).severity === 'follow_up', 'Detects 10-day overdue debt as follow_up');

console.log('\n------------------------------------------------------');
console.log(`SUMMARY: ${passedTests} of ${totalTests} Week 2 tests passed successfully.`);
console.log('------------------------------------------------------\n');
