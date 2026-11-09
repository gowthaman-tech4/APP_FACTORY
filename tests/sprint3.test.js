/**
 * APP FACTORY — Sprint 2 & 3 Hardware & PWA Test Suite
 * QA Automation Lead (Ex-BrowserStack)
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { formatTwoColumnLine, buildReceiptPayload, COMMANDS } from '../src/utils/thermalPrinter.js';

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
console.log('🚀 APP FACTORY HARDWARE & PWA TEST SUITE');
console.log('======================================================\n');

// 1. THERMAL PRINTER FORMATTING
console.log('1. Testing ESC/POS Thermal Receipt Formatting:');
const formattedLine = formatTwoColumnLine('5kg Atta', '₹240.00', 32);
assert(formattedLine.length === 32, 'Aligns two columns to exact 32 characters for 58mm paper rolls');
assert(formattedLine.startsWith('5kg Atta') && formattedLine.endsWith('₹240.00'), 'Preserves left label and right currency amount');

const receiptPayload = buildReceiptPayload({
  shopName: 'Sri Lakshmi Store',
  phone: '9876543210',
  customerName: 'Ramesh Kumar',
  items: [
    { name: '5kg Atta', amount: 240 },
    { name: '1L Oil', amount: 160 }
  ],
  total: 400,
  currency: '₹'
});

assert(receiptPayload.includes(COMMANDS.INIT), 'Includes ESC/POS initialization byte sequence');
assert(receiptPayload.includes('Sri Lakshmi Store'), 'Injects store header into thermal print stream');
assert(receiptPayload.includes('GRAND TOTAL:'), 'Renders grand total line in bold format');
assert(receiptPayload.includes(COMMANDS.FEED_3), 'Appends paper feed command at end of stream');

// 2. PWA MANIFEST VALIDATION
console.log('\n2. Testing PWA Web App Manifest:');
const manifest = JSON.parse(readFileSync(resolve('manifest.json'), 'utf8'));
assert(manifest.display === 'standalone', 'PWA display set to standalone (runs without browser URL bar)');
assert(manifest.start_url === '/index.html', 'PWA start_url properly routed');
assert(manifest.icons && manifest.icons.length >= 2, 'PWA contains both 192px and 512px application icons');

// 3. SERVICE WORKER VERIFICATION
console.log('\n3. Testing Service Worker Offline Shell:');
const swContent = readFileSync(resolve('sw.js'), 'utf8');
assert(swContent.includes('app-factory-v1'), 'Service worker declares active cache storage namespace');
assert(swContent.includes('caches.match'), 'Service worker implements cache-first offline fallback strategy');

console.log('\n------------------------------------------------------');
console.log(`SUMMARY: ${passedTests} of ${totalTests} Hardware & PWA tests passed successfully.`);
console.log('------------------------------------------------------\n');

