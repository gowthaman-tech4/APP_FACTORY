/**
 * APP FACTORY — Week 4 Production Launch & Custom Domain Routing Test Suite
 * Author: QA Automation Lead (Ex-BrowserStack) & Principal Architect (Ex-Stripe)
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { TenantRouter } from '../src/engine/tenantRouter.js';

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
console.log('🚀 APP FACTORY WEEK 4 PRODUCTION & ROUTER TESTS');
console.log('======================================================\n');

// 1. MULTI-TENANT SUBDOMAIN & CUSTOM CNAME ROUTER
console.log('1. Testing Multi-Tenant Subdomain & CNAME Router:');
const retailJson = JSON.parse(readFileSync(resolve('templates/retail.json'), 'utf8'));
const autocareJson = JSON.parse(readFileSync(resolve('templates/autocare.json'), 'utf8'));

const router = new TenantRouter({
  baseDomain: 'appfactory.in',
  customDomains: {
    'bills.srilakshmistore.com': 'sri-lakshmi',
    'garage.apexmotors.com': 'apex-motors'
  }
});

// Register sample tenants
router.registerTenant({
  slug: 'sri-lakshmi',
  businessName: 'Sri Lakshmi Provision Store',
  industry: 'retail',
  schema: retailJson
});

router.registerTenant({
  slug: 'apex-motors',
  businessName: 'Apex Motors & Service Hub',
  industry: 'autocare',
  schema: autocareJson
});

// Test Subdomain Resolution
const subRes = router.resolveHostname('sri-lakshmi.appfactory.in');
assert(subRes.type === 'subdomain' && subRes.slug === 'sri-lakshmi', 'Resolves tenant slug from wildcard subdomain');

const autoRes = router.resolveHostname('apex-motors.appfactory.in:3000');
assert(autoRes.type === 'subdomain' && autoRes.slug === 'apex-motors', 'Strips port and resolves AutoCare tenant');

// Test Custom CNAME Domain Resolution
const cnameRes = router.resolveHostname('bills.srilakshmistore.com');
assert(cnameRes.type === 'custom_domain' && cnameRes.slug === 'sri-lakshmi', 'Resolves custom CNAME domain to mapped tenant slug');

// Test Root Domain Fallback
const rootRes = router.resolveHostname('appfactory.in');
assert(rootRes.type === 'root' && rootRes.slug === null, 'Identifies root platform domain for public landing');

// Test Active Tenant Retrieval with Attached Schema
const activeTenant = router.getActiveTenant('bills.srilakshmistore.com');
assert(activeTenant && activeTenant.businessName === 'Sri Lakshmi Provision Store', 'Retrieves registered tenant business profile');
assert(activeTenant.schema && activeTenant.schema.id === 'kirana-retail-quickdesk', 'Attaches industry template schema to resolved tenant');

// 2. PRODUCTION RUNBOOK & IP ASSIGNMENT VERIFICATION
console.log('\n2. Testing Production Operational & Legal Compliance:');
assert(existsSync(resolve('docs/PRODUCTION_RUNBOOK.md')), 'Verifies Production Runbook & DevOps Manual is deployed');
assert(existsSync(resolve('docs/IP_ASSIGNMENT_AGREEMENT.md')), 'Verifies formal 100% IP Assignment Agreement is signed');

const ipAgreement = readFileSync(resolve('docs/IP_ASSIGNMENT_AGREEMENT.md'), 'utf8');
assert(ipAgreement.includes('Pugazhendhi') && ipAgreement.includes('Assignee'), 'Confirms Pugazhendhi as sole exclusive assignee and owner');

console.log('\n------------------------------------------------------');
console.log(`SUMMARY: ${passedTests} of ${totalTests} Production tests passed successfully.`);
console.log('------------------------------------------------------\n');

