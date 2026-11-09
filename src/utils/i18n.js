/**
 * APP FACTORY — Indic Multi-Language Localization Engine
 * Author: Head of UI/UX Design (Ex-CRED/Canva) & Lead BA (Ex-Khatabook)
 * Supported Languages: English (en), Hindi (hi), Tamil (ta)
 */

export const DICTIONARIES = {
  en: {
    // Header & Navigation
    shopTerminal: "Shop Terminal",
    customerLiveBill: "Customer Live Bill",
    customizer: "Canva Customizer",
    liveOnline: "Live Online",

    // Action Buttons
    fastBillAction: "+ Fast Bill / Udhar Entry",
    checkinAction: "+ Check-In Vehicle (30s)",
    sendWhatsApp: "WhatsApp",
    printSlip: "Print Slip 🖨️",
    markSettled: "Mark Settled ✓",
    nextState: "Next State ➔",

    // Form Labels
    customerName: "Customer Name",
    whatsappPhone: "WhatsApp Phone",
    itemsSummary: "Items Summary",
    totalAmount: "Total Amount",
    paymentMode: "Payment Mode",
    vehiclePlate: "Vehicle Plate Number",
    servicePackage: "Service Package",
    estimatedCost: "Estimated Cost",

    // Status Chips
    paidUpi: "Paid (UPI)",
    paidCash: "Paid (Cash)",
    udharPending: "Udhar (Pending)",
    checkedIn: "Checked In",
    inRepair: "In Repair",
    readyPickup: "Ready for Pickup",

    // Alerts
    whatsappOpened: "Opening WhatsApp with pre-filled message...",
    printSuccess: "Receipt sent to Bluetooth thermal printer."
  },

  ta: {
    // Header & Navigation (தமிழ்)
    shopTerminal: "கடை முனையம்",
    customerLiveBill: "வாடிக்கையாளர் பில்",
    customizer: "வடிவமைப்பு",
    liveOnline: "ஆன்லைனில் உள்ளது",

    // Action Buttons
    fastBillAction: "+ உடனடி பில் / கடன் பதிவு",
    checkinAction: "+ வண்டி பதிவு (30 வினாடி)",
    sendWhatsApp: "வாட்ஸ்அப்",
    printSlip: "பில் அச்சிடு 🖨️",
    markSettled: "கடன் முடிந்தது ✓",
    nextState: "அடுத்த நிலை ➔",

    // Form Labels
    customerName: "வாடிக்கையாளர் பெயர்",
    whatsappPhone: "வாட்ஸ்அப் எண்",
    itemsSummary: "பொருட்கள் விபரம்",
    totalAmount: "மொத்த தொகை",
    paymentMode: "பணம் செலுத்தும் முறை",
    vehiclePlate: "வண்டி எண்",
    servicePackage: "சர்வீஸ் வகை",
    estimatedCost: "மதிப்பீட்டு தொகை",

    // Status Chips
    paidUpi: "செலுத்தப்பட்டது (UPI)",
    paidCash: "ரொக்கம் செலுத்தப்பட்டது",
    udharPending: "கடன் பாக்கி (Udhar)",
    checkedIn: "வண்டி வந்தது",
    inRepair: "வேலை நடக்கிறது",
    readyPickup: "டெலிவரிக்கு தயார்",

    // Alerts
    whatsappOpened: "வாட்ஸ்அப் திறக்கப்படுகிறது...",
    printSuccess: "ப்ளூடூத் பிரிண்டரில் பில் அச்சிடப்பட்டது."
  },

  hi: {
    // Header & Navigation (हिन्दी)
    shopTerminal: "दुकान टर्मिनल",
    customerLiveBill: "ग्राहक रसीद",
    customizer: "कस्टमाइज़र",
    liveOnline: "लाइव ऑनलाइन",

    // Action Buttons
    fastBillAction: "+ त्वरित बिल / उधार खाता",
    checkinAction: "+ वाहन चेक-इन (30 सेकेंड)",
    sendWhatsApp: "व्हाट्सएप",
    printSlip: "रसीद प्रिंट 🖨️",
    markSettled: "उधार चुकता ✓",
    nextState: "अगली स्थिति ➔",

    // Form Labels
    customerName: "ग्राहक का नाम",
    whatsappPhone: "व्हाट्सएप नंबर",
    itemsSummary: "सामान का विवरण",
    totalAmount: "कुल राशि",
    paymentMode: "भुगतान का प्रकार",
    vehiclePlate: "गाड़ी नंबर",
    servicePackage: "सर्विस पैकेज",
    estimatedCost: "अनुमानित लागत",

    // Status Chips
    paidUpi: "प्राप्त (UPI)",
    paidCash: "नकद प्राप्त",
    udharPending: "उधार (लंबित)",
    checkedIn: "चेक-इन पूर्ण",
    inRepair: "काम जारी है",
    readyPickup: "डिलीवरी के लिए तैयार",

    // Alerts
    whatsappOpened: "व्हाट्सएप संदेश लोड हो रहा है...",
    printSuccess: "ब्लूटूथ थर्मल प्रिंटर पर रसीद भेजी गई।"
  }
};

/**
 * Localization Manager Class
 */
export class I18nManager {
  constructor(defaultLang = 'en') {
    this.currentLang = DICTIONARIES[defaultLang] ? defaultLang : 'en';
  }

  setLanguage(langCode) {
    if (DICTIONARIES[langCode]) {
      this.currentLang = langCode;
      return true;
    }
    return false;
  }

  getLanguage() {
    return this.currentLang;
  }

  t(key, fallback = '') {
    const dict = DICTIONARIES[this.currentLang] || DICTIONARIES.en;
    return dict[key] !== undefined ? dict[key] : (DICTIONARIES.en[key] || fallback || key);
  }
}

