/**
 * APP FACTORY — WhatsApp Deep-Link & Dynamic NPCI UPI Engine
 * Author: Staff PWA Engineer (Ex-Flipkart Lite) & Architect (Ex-Stripe/Razorpay)
 * Zero-Cost Client-Side Messaging Rail (wa.me)
 */

/**
 * Normalizes phone numbers to standard E.164 format (defaulting to India +91)
 * @param {string} phone Raw phone number string
 * @param {string} defaultCountryCode Default country calling code
 * @returns {string} Clean digits-only E.164 phone string
 */
export function normalizePhone(phone, defaultCountryCode = '91') {
  if (!phone) return '';
  // Strip all non-digit characters
  let clean = phone.replace(/[^0-9]/g, '');
  // If user typed 10-digit mobile number, prepend country code
  if (clean.length === 10) {
    clean = defaultCountryCode + clean;
  }
  return clean;
}

/**
 * Constructs an official NPCI standard UPI payment deep link
 * @param {Object} params UPI parameters
 * @param {string} params.upiId Merchant UPI VPA (e.g., 'store@upi')
 * @param {string} params.payeeName Business display name
 * @param {number} params.amount Transaction amount
 * @param {string} params.transactionRef Unique transaction reference
 * @returns {string} Standard UPI URI string
 */
export function generateUpiUri({ upiId, payeeName, amount, transactionRef = '' }) {
  const cleanId = encodeURIComponent(upiId || 'store@upi');
  const cleanName = encodeURIComponent(payeeName || 'Store');
  const cleanAmount = Number(amount || 0).toFixed(2);
  const ref = encodeURIComponent(transactionRef || `TXN_${Date.now()}`);

  return `upi://pay?pa=${cleanId}&pn=${cleanName}&am=${cleanAmount}&cu=INR&tr=${ref}`;
}

/**
 * Builds an instant native wa.me deep-link URL with encoded business payload
 * @param {Object} options
 * @param {string} options.customerPhone Customer mobile number
 * @param {string} options.customerName Customer display name
 * @param {string} options.shopName Subscribing business name
 * @param {string} options.templateType 'retail_bill' | 'retail_udhar' | 'autocare_status'
 * @param {Object} options.data Contextual details (items, vehicle, cost, trackingUrl, upiId)
 * @returns {string} Full https://wa.me/... link
 */
export function buildWhatsAppLink({
  customerPhone,
  customerName,
  shopName,
  templateType,
  data = {}
}) {
  const phone = normalizePhone(customerPhone);
  const currency = data.currency || '₹';
  const trackingUrl = data.trackingUrl || `https://appfactory.local/track/${data.id || Date.now()}`;
  let message = '';

  switch (templateType) {
    case 'retail_bill':
      message =
        `Namaste ${customerName}ji! 🙏\n\n` +
        `Your digital bill at *${shopName}* is *${currency}${data.amount}*.\n\n` +
        `📝 *Items:* ${data.itemsSummary || 'Groceries & Provisions'}\n` +
        `💳 *Payment Mode:* ${data.paymentMode || 'UPI / Cash'}\n\n` +
        `📄 *View receipt & pay online:*\n${trackingUrl}\n\n` +
        `_Thank you for supporting your local neighborhood store!_`;
      break;

    case 'retail_udhar':
      const upiPayLink = generateUpiUri({
        upiId: data.upiId || 'store@upi',
        payeeName: shopName,
        amount: data.amount,
        transactionRef: `BILL_${data.id || Date.now()}`
      });
      message =
        `Namaste ${customerName}ji! 🙏\n\n` +
        `Gentle courtesy reminder from *${shopName}*:\n` +
        `Pending Udhar (Credit) Balance: *${currency}${data.amount}*\n` +
        `📅 *Due Date:* ${data.dueDate || 'Please clear at your earliest convenience'}\n\n` +
        `⚡ *1-Click Pay via UPI (GPay/PhonePe/Paytm):*\n${upiPayLink}\n\n` +
        `Thank you for your valued relationship!`;
      break;

    case 'autocare_status':
      message =
        `Hello ${customerName},\n\n` +
        `Your vehicle *${data.vehicleNo || 'Vehicle'}* is now: *${(data.status || 'Updated').toUpperCase()}* at *${shopName}*.\n\n` +
        `🔧 *Package:* ${data.servicePackage || 'Vehicle Service'}\n` +
        `💰 *Estimated Bill:* ${currency}${data.amount}\n\n` +
        `📍 *Track live workshop progress & photos:*\n${trackingUrl}\n\n` +
        `_Apex Motors & Service Hub_`;
      break;

    default:
      message = `Hello ${customerName}, update from ${shopName}: ${data.summary || ''}. Details: ${trackingUrl}`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

