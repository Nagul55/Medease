/**
 * MedEase Multilingual i18n Dictionary
 * Supports English, Marathi (मराठी), and Hindi (हिन्दी)
 */

export type Language = 'en' | 'mr' | 'hi';

export const translations = {
  en: {
    appName: "MedEase",
    tagline: "Healthcare That Reaches You.",
    govtHeader: "Government of Maharashtra | Dept. of Public Health & Innovation",
    nav: {
      home: "Home",
      triage: "Digital Triage",
      asha: "ASHA Field App",
      doctor: "Doctor Dashboard",
      pharmacist: "Pharmacy",
      admin: "District Admin",
      referrals: "Referral Tracker",
      diagnostics: "Lab Reports",
      facilities: "Facility Network",
      emergency: "Emergency 108"
    },
    hero: {
      title: "Connecting Rural Maharashtra to Continuous Care",
      subtitle: "Digitally uniting Patients, ASHA Health Workers, PHC Doctors, and District Hospitals.",
      triageBtn: "Start Digital Triage",
      findFacilityBtn: "Find Nearby Health Facilities",
      emergencyBtn: "Emergency Escalation"
    },
    triage: {
      title: "Digital Triage & Symptom Evaluation",
      subtitle: "Decision support system for patient assessment and referral priority.",
      evaluateBtn: "Evaluate Triage Level"
    },
    asha: {
      title: "ASHA / ANM Frontline Field Console",
      offlineMode: "Offline Mode Active (Data synced locally)",
      onlineMode: "Online Mode (Connected to Server)",
      registerPatient: "Register New Patient",
      recordVitals: "Record Patient Vitals & Flag Risk",
      syncQueue: "Items Pending Sync"
    },
    status: {
      green: "🟢 Self-Care / Community Care",
      yellow: "🟡 Visit PHC Outpatient",
      orange: "🟠 Urgent Teleconsultation Needed",
      red: "🔴 Emergency Escalation Required"
    }
  },
  mr: {
    appName: "मेदईझ (MedEase)",
    tagline: "आरोग्य सेवा जे तुमच्यापर्यंत पोहोचते.",
    govtHeader: "महाराष्ट्र शासन | सार्वजनिक आरोग्य विभाग",
    nav: {
      home: "मुख्य पृष्ठ",
      triage: "डिजिटल चाचणी (Triage)",
      asha: "आशा / एएनएम ॲप",
      doctor: "डॉक्टर डॅशबोर्ड",
      pharmacist: "औषध भांडार",
      admin: "जिल्हा प्रशासन",
      referrals: "संदर्भ सेवा (Referrals)",
      diagnostics: "लॅब तपासणी",
      facilities: "आरोग्य केंद्र नेटवर्क",
      emergency: "आपत्कालीन १०८"
    },
    hero: {
      title: "ग्रामीण महाराष्ट्राला अखंड आरोग्य सेवेशी जोडणारा डिजिटल मंच",
      subtitle: "रुग्ण, आशा सेविका, प्राथमिक आरोग्य केंद्र डॉक्टर आणि जिल्हा रुग्णालयांचे एकत्रीकरण.",
      triageBtn: "डिजिटल चाचणी सुरू करा",
      findFacilityBtn: "जवळचे आरोग्य केंद्र शोधा",
      emergencyBtn: "आपत्कालीन सेवा call 108"
    },
    triage: {
      title: "डिजिटल लक्षण व आरोग्य तपासणी",
      subtitle: "रुग्णाच्या लक्षणांचे त्वरित वर्गीकरण व मार्गदर्शन प्रणाली.",
      evaluateBtn: "तपासणी करा"
    },
    asha: {
      title: "आशा / एएनएम सेविका कक्ष",
      offlineMode: "ऑफलाईन मोड चालू (माहिती फोनवर जतन केली आहे)",
      onlineMode: "ऑनलाईन मोड (सर्व्हरशी जोडलेले)",
      registerPatient: "नवीन रुग्णाची नोंदणी करा",
      recordVitals: "आरोग्य नोंदी करा",
      syncQueue: "सिंक प्रलंबित नोंदी"
    },
    status: {
      green: "🟢 स्व-काळजी / प्राथमिक काळजी",
      yellow: "🟡 प्राथमिक आरोग्य केंद्राला भेट द्या",
      orange: "🟠 तातडीने टेलिकन्सल्टेशन आवश्यक",
      red: "🔴 आपत्कालीन रुग्णालय भरती आवश्यक"
    }
  },
  hi: {
    appName: "मेडईज़ (MedEase)",
    tagline: "स्वास्थ्य सेवा जो आप तक पहुंचे।",
    govtHeader: "महाराष्ट्र सरकार | सार्वजनिक स्वास्थ्य विभाग",
    nav: {
      home: "मुख्य पृष्ठ",
      triage: "डिजिटल ट्रियाज",
      asha: "आशा / एएनएम ऐप",
      doctor: "डॉक्टर डैशबोर्ड",
      pharmacist: "औषधि भंडार",
      admin: "जिला प्रशासन",
      referrals: "रेफरल ट्रैकर",
      diagnostics: "लैब रिपोर्ट्स",
      facilities: "स्वास्थ्य केंद्र नेटवर्क",
      emergency: "आपातकालीन 108"
    },
    hero: {
      title: "ग्रामीण महाराष्ट्र को निरंतर स्वास्थ्य सेवा से जोड़ना",
      subtitle: "मरीजों, आशा कार्यकर्ताओं, प्राथमिक स्वास्थ्य केंद्र के डॉक्टरों और जिला अस्पतालों का एकीकरण।",
      triageBtn: "डिजिटल ट्रियाज शुरू करें",
      findFacilityBtn: "निकटतम स्वास्थ्य केंद्र खोजें",
      emergencyBtn: "आपातकालीन 108"
    },
    triage: {
      title: "डिजिटल ट्रियाज एवं लक्षण मूल्यांकन",
      subtitle: "रोगी मूल्यांकन एवं रेफरल प्राथमिकता हेतु निर्णय सहायता प्रणाली।",
      evaluateBtn: "मूल्यांकन करें"
    },
    asha: {
      title: "आशा / एएनएम कार्यक्षेत्र कंसोल",
      offlineMode: "ऑफलाइन मोड सक्रिय (डेटा लोकल में सुरक्षित)",
      onlineMode: "ऑनलाइन मोड (सर्वर से जुड़ा हुआ)",
      registerPatient: "नए मरीज का पंजीकरण करें",
      recordVitals: "वाइटल्स दर्ज करें",
      syncQueue: "सिंक हेतु लंबित"
    },
    status: {
      green: "🟢 स्व-देखभाल / समुदाय देखभाल",
      yellow: "🟡 पीएचसी जाने की सलाह",
      orange: "🟠 तत्काल टेलीकंसल्टेशन आवश्यक",
      red: "🔴 आपातकालीन अस्पताल भर्ती"
    }
  }
};
