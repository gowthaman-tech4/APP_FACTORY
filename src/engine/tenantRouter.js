/**
 * APP FACTORY — Multi-Tenant Subdomain & Custom Domain CNAME Router
 * Author: Principal Architect (Ex-Stripe/Razorpay) & Staff PWA Engineer
 * Purpose: Dynamically resolves tenant identity, theme, and industry template from hostname
 */

export class TenantRouter {
  /**
   * Initializes router with root domain and custom domain mappings
   * @param {Object} [options]
   * @param {string} [options.baseDomain='appfactory.in'] Root SaaS platform domain
   * @param {Map<string, string>|Object} [options.customDomains] Custom CNAME mappings (e.g. 'bills.shop.com' -> 'tenant_slug')
   */
  constructor({ baseDomain = 'appfactory.in', customDomains = {} } = {}) {
    this.baseDomain = baseDomain.toLowerCase();
    this.customDomains = new Map(Object.entries(customDomains));
    this.tenantsRegistry = new Map();
  }

  /**
   * Registers a tenant profile into router registry
   * @param {Object} tenant
   * @param {string} tenant.slug Unique subdomain slug (e.g., 'sri-lakshmi', 'apex-motors')
   * @param {string} tenant.businessName Store or workshop display name
   * @param {string} tenant.industry 'retail' | 'autocare'
   * @param {Object} tenant.schema Declarative template schema
   */
  registerTenant(tenant) {
    if (!tenant.slug) throw new Error('Tenant registration requires a unique slug');
    this.tenantsRegistry.set(tenant.slug.toLowerCase(), tenant);
  }

  /**
   * Resolves tenant slug from raw hostname
   * @param {string} hostname e.g. 'sri-lakshmi.appfactory.in' or 'bills.customshop.com'
   * @returns {{ type: 'subdomain'|'custom_domain'|'root', slug: string|null }}
   */
  resolveHostname(hostname) {
    if (!hostname) return { type: 'root', slug: null };
    const host = hostname.toLowerCase().split(':')[0]; // strip port

    // 1. Check custom CNAME domain map
    if (this.customDomains.has(host)) {
      return {
        type: 'custom_domain',
        slug: this.customDomains.get(host)
      };
    }

    // 2. Check if it's the root domain or localhost
    if (host === this.baseDomain || host === 'localhost' || host === '127.0.0.1') {
      return { type: 'root', slug: null };
    }

    // 3. Extract subdomain prefix (e.g. 'sri-lakshmi.appfactory.in')
    if (host.endsWith(`.${this.baseDomain}`)) {
      const subdomain = host.slice(0, -(this.baseDomain.length + 1));
      return {
        type: 'subdomain',
        slug: subdomain
      };
    }

    // Unmapped domain fallback
    return { type: 'root', slug: null };
  }

  /**
   * Resolves active tenant profile based on current browser URL or hostname
   * @param {string} [overrideHostname] Optional hostname for unit testing/SSR
   * @returns {Object|null} Resolved tenant profile with template schema
   */
  getActiveTenant(overrideHostname) {
    let hostname = overrideHostname;
    if (!hostname && typeof window !== 'undefined' && window.location) {
      hostname = window.location.hostname;
    }

    const resolution = this.resolveHostname(hostname);
    if (resolution.slug && this.tenantsRegistry.has(resolution.slug)) {
      return {
        ...this.tenantsRegistry.get(resolution.slug),
        resolutionType: resolution.type
      };
    }

    return null;
  }
}
