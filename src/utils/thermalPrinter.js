/**
 * APP FACTORY — Bluetooth ESC/POS Thermal Receipt Printer Driver
 * Author: Principal Architect & Staff PWA Engineer
 * Target: Standard 58mm (32 chars/line) & 80mm (48 chars/line) Bluetooth POS Printers
 */

// ESC/POS Command Byte Constants
const ESC = '\x1B';
const GS = '\x1D';

export const COMMANDS = {
  INIT: `${ESC}@`,
  ALIGN_LEFT: `${ESC}a\x00`,
  ALIGN_CENTER: `${ESC}a\x01`,
  ALIGN_RIGHT: `${ESC}a\x02`,
  BOLD_ON: `${ESC}E\x01`,
  BOLD_OFF: `${ESC}E\x00`,
  DOUBLE_HEIGHT: `${ESC}!\x10`,
  DOUBLE_WIDTH: `${ESC}!\x20`,
  NORMAL: `${ESC}!\x00`,
  FEED_3: `${ESC}d\x03`,
  FEED_AND_CUT: `${GS}V\x41\x00`
};

/**
 * Formats a clean 32-column text line for 58mm thermal rolls
 * @param {string} left Left-aligned text
 * @param {string} right Right-aligned text
 * @param {number} [width=32] Line character width
 * @returns {string} Formatted line
 */
export function formatTwoColumnLine(left, right, width = 32) {
  const leftStr = String(left || '');
  const rightStr = String(right || '');
  const spaceCount = Math.max(1, width - leftStr.length - rightStr.length);
  return leftStr + ' '.repeat(spaceCount) + rightStr;
}

/**
 * Assembles ESC/POS binary command stream for a receipt
 * @param {Object} options Receipt parameters
 * @param {string} options.shopName Store Name
 * @param {string} options.phone Store phone
 * @param {string} options.customerName Customer name
 * @param {string} options.billNumber Invoice/Job number
 * @param {Array<{ name: string, amount: number }>} options.items Itemized list
 * @param {number} options.total Total amount
 * @param {string} [options.currency='₹'] Currency symbol
 * @param {string} [options.footerMessage='Thank you for shopping local!'] Footer text
 * @returns {string} Raw ESC/POS text command stream
 */
export function buildReceiptPayload({
  shopName,
  phone = '',
  customerName = 'Walk-in Customer',
  billNumber = `B_${Date.now().toString().slice(-6)}`,
  items = [],
  total = 0,
  currency = '₹',
  footerMessage = 'Thank you for shopping local!'
}) {
  const dateStr = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
  const divider = '-'.repeat(32);

  let stream = '';
  stream += COMMANDS.INIT;
  stream += COMMANDS.ALIGN_CENTER;
  stream += COMMANDS.BOLD_ON;
  stream += `${shopName}\n`;
  stream += COMMANDS.BOLD_OFF;
  if (phone) stream += `Ph: ${phone}\n`;
  stream += `${divider}\n`;

  stream += COMMANDS.ALIGN_LEFT;
  stream += formatTwoColumnLine(`Bill: ${billNumber}`, dateStr) + '\n';
  stream += `Customer: ${customerName}\n`;
  stream += `${divider}\n`;

  // Item List
  if (items.length > 0) {
    items.forEach(item => {
      stream += formatTwoColumnLine(item.name, `${currency}${item.amount}`) + '\n';
    });
  } else {
    stream += formatTwoColumnLine('Provisions & Items', `${currency}${total}`) + '\n';
  }

  stream += `${divider}\n`;
  stream += COMMANDS.BOLD_ON;
  stream += formatTwoColumnLine('GRAND TOTAL:', `${currency}${Number(total).toFixed(2)}`) + '\n';
  stream += COMMANDS.BOLD_OFF;
  stream += `${divider}\n`;

  // Footer
  stream += COMMANDS.ALIGN_CENTER;
  stream += `${footerMessage}\n`;
  stream += `Powered by AppFactory\n\n`;
  stream += COMMANDS.FEED_3;

  return stream;
}

/**
 * Prints to Web Bluetooth printer or falls back to system print dialog
 * @param {Object} receiptData
 * @returns {Promise<{ success: boolean, method: string }>}
 */
export async function printReceipt(receiptData) {
  const payload = buildReceiptPayload(receiptData);

  // Check if Web Bluetooth API is supported
  if (typeof navigator !== 'undefined' && navigator.bluetooth) {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['000018f0-0000-1000-8000-00805f9b34fb'] }]
      });
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
      const characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');

      const encoder = new TextEncoder();
      await characteristic.writeValue(encoder.encode(payload));
      return { success: true, method: 'bluetooth' };
    } catch (e) {
      console.warn('Bluetooth connection cancelled or unavailable, falling back:', e);
    }
  }

  // Fallback: window.print()
  if (typeof window !== 'undefined') {
    window.print();
    return { success: true, method: 'browser_print' };
  }

  return { success: true, method: 'simulated', payload };
}

