/**
 * APP FACTORY — Week 3 Field Pilot & Telemetry Test Suite
 * Author: QA Automation Lead (Ex-BrowserStack) & VP of Product (Ex-Swiggy)
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { TelemetryLogger } from '../src/utils/telemetry.js';
import { PilotSimulator } from '../src/engine/pilotSimulator.js';

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
console.log('🚀 APP FACTORY WEEK 3 FIELD PILOT & TELEMETRY TESTS');
console.log('======================================================\n');

// 1. TELEMETRY & ZERO-PII LOGGING TESTS
console.log('1. Testing Zero-PII Telemetry Logger:');
const logger = new TelemetryLogger({ tenantId: 'karthik_auto_pilot' });

const sanitized = logger.sanitizePayload({
  customerName: 'Rajesh Kumar',
  customerPhone: '9876543210',
  billAmount: 850
});
assert(sanitized.customerPhone === '987****210', 'Masks sensitive customer phone number');
assert(sanitized.customerName === 'R***', 'Redacts customer personal name');
assert(sanitized.billAmount === 850, 'Preserves numeric operational metric');

logger.logInfo('PILOT_VEHICLE_CHECKIN', { vehicleNo: 'TN-01-AB-1234' });
logger.logError(new Error('Simulated print timeout'), { device: 'Bluetooth_POS' });

const logs = logger.flush();
assert(logs.length === 2, 'Flushes telemetry buffer for diagnostic upload');
assert(logger.logs.length === 0, 'Clears internal buffer after flush');

// 2. ON-SITE FIELD PILOT SIMULATOR TESTS
console.log('\n2. Testing On-Site Field Pilot Activity Simulator:');
const retailJson = JSON.parse(readFileSync(resolve('templates/retail.json'), 'utf8'));
const autocareJson = JSON.parse(readFileSync(resolve('templates/autocare.json'), 'utf8'));

const retailPilot = new PilotSimulator({ tenantId: 'sri_lakshmi_pilot', schema: retailJson });
const retailBatch = retailPilot.generateBatch(3);
assert(retailBatch.length === 3, 'Generates batch of 3 realistic Kirana grocery transactions');
assert(retailBatch[0].amount > 0 && retailBatch[0].customerName, 'Validates grocery bill amount and customer name');

const autoPilot = new PilotSimulator({ tenantId: 'karthik_auto_pilot', schema: autocareJson });
const autoBatch = autoPilot.generateBatch(3);
assert(autoBatch.length === 3, 'Generates batch of 3 realistic workshop vehicle job cards');
assert(autoBatch[0].title && autoBatch[0].title.startsWith('TN-') || autoBatch[0].title.startsWith('MH-'), 'Validates vehicle license plate format');

console.log('\n------------------------------------------------------');
console.log(`SUMMARY: ${passedTests} of ${totalTests} Field Pilot tests passed successfully.`);
console.log('------------------------------------------------------\n');
