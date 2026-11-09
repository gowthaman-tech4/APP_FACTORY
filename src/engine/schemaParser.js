/**
 * APP FACTORY — Universal JSON Schema Engine
 * Author: Principal Solutions Architect & Lead PM
 * Purpose: Interprets declarative industry template schemas (Canva for Apps)
 */

export class SchemaEngine {
  /**
   * Initializes the engine with a declarative template schema
   * @param {Object} schema JSON schema definition (e.g. autocare.json, retail.json)
   */
  constructor(schema) {
    this.schema = schema;
    this.validateSchema();
  }

  /**
   * Basic validation of schema structure
   */
  validateSchema() {
    if (!this.schema.id || !this.schema.name || !this.schema.states || !this.schema.fields) {
      throw new Error(`Invalid schema specification: Missing required properties in ${this.schema.name || 'unnamed'}`);
    }
  }

  /**
   * Returns branding configuration with fallback defaults
   */
  getBranding() {
    return {
      defaultName: this.schema.branding?.defaultName || this.schema.name,
      currency: this.schema.branding?.currency || '$',
      themeColor: this.schema.branding?.themeColor || '#2563eb',
      tagline: this.schema.branding?.tagline || ''
    };
  }

  /**
   * Returns state machine transitions for the industry
   */
  getStates() {
    return this.schema.states || [];
  }

  /**
   * Calculates the next state in a sequential progression
   * @param {string} currentStateKey
   * @returns {Object|null} Next state object
   */
  getNextState(currentStateKey) {
    const states = this.getStates();
    const index = states.findIndex(s => s.key === currentStateKey);
    if (index !== -1 && index + 1 < states.length) {
      return states[index + 1];
    }
    return null;
  }

  /**
   * Validates form input against schema fields
   * @param {Object} formData Key-value user input
   * @returns {{ isValid: boolean, errors: Array<string> }}
   */
  validateFormData(formData) {
    const errors = [];
    this.schema.fields.forEach(field => {
      if (field.required && (!formData[field.id] || String(formData[field.id]).trim() === '')) {
        errors.push(`Field "${field.label}" is required.`);
      }
    });
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

