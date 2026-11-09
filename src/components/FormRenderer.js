/**
 * APP FACTORY — Universal Dynamic Form Renderer
 * Author: Head of UI/UX Design (Ex-CRED/Canva) & Staff PWA Engineer (Ex-Flipkart Lite)
 * Standard: 48px+ touch targets, single-thumb layout, instant validation
 */

/**
 * Generates HTML string for dynamic form fields based on schema definition
 * @param {Array<Object>} fields List of field definitions from schema JSON
 * @param {Object} [initialValues={}] Optional pre-filled data
 * @returns {string} Clean, responsive HTML form elements
 */
export function renderFormFields(fields, initialValues = {}) {
  if (!fields || !Array.isArray(fields)) return '';

  return fields.map(field => {
    const value = initialValues[field.id] !== undefined ? initialValues[field.id] : '';
    const isRequired = field.required ? 'required' : '';
    const reqBadge = field.required ? '<span class="text-emerald-400 font-bold">*</span>' : '';

    switch (field.type) {
      case 'select':
        const optionsHtml = (field.options || []).map(opt => {
          const selected = opt === value ? 'selected' : '';
          return `<option value="${opt}" ${selected}>${opt}</option>`;
        }).join('');

        return `
          <div class="space-y-1">
            <label for="field-${field.id}" class="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              ${field.label} ${reqBadge}
            </label>
            <select id="field-${field.id}" name="${field.id}" ${isRequired}
              class="w-full h-12 px-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 font-medium transition">
              ${optionsHtml}
            </select>
          </div>
        `;

      case 'textarea':
        return `
          <div class="space-y-1">
            <label for="field-${field.id}" class="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              ${field.label} ${reqBadge}
            </label>
            <textarea id="field-${field.id}" name="${field.id}" rows="2" ${isRequired}
              placeholder="${field.placeholder || ''}"
              class="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 font-medium transition resize-none">${value}</textarea>
          </div>
        `;

      case 'number':
        return `
          <div class="space-y-1">
            <label for="field-${field.id}" class="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              ${field.label} ${reqBadge}
            </label>
            <div class="relative">
              <input type="number" id="field-${field.id}" name="${field.id}" value="${value}" ${isRequired}
                placeholder="${field.placeholder || '0'}"
                class="w-full h-12 px-3 bg-slate-950 border border-slate-800 rounded-xl text-base font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 transition">
            </div>
          </div>
        `;

      case 'tel':
        return `
          <div class="space-y-1">
            <label for="field-${field.id}" class="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              ${field.label} ${reqBadge}
            </label>
            <div class="relative flex">
              <span class="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-800 bg-slate-900 text-xs font-bold text-slate-400">+91</span>
              <input type="tel" id="field-${field.id}" name="${field.id}" value="${value}" ${isRequired}
                placeholder="${field.placeholder || '9876543210'}"
                class="w-full h-12 px-3 bg-slate-950 border border-slate-800 rounded-r-xl text-sm text-white focus:outline-none focus:border-emerald-500 font-medium transition">
            </div>
          </div>
        `;

      default:
        return `
          <div class="space-y-1">
            <label for="field-${field.id}" class="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              ${field.label} ${reqBadge}
            </label>
            <input type="text" id="field-${field.id}" name="${field.id}" value="${value}" ${isRequired}
              placeholder="${field.placeholder || ''}"
              class="w-full h-12 px-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 font-medium transition">
          </div>
        `;
    }
  }).join('');
}
