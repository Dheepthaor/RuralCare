import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Brand & Navigation
    brand: 'RuralCare',
    tagline: 'Better Healthcare for a Healthier Rural Tomorrow.',
    navHome: 'Home',
    navServices: 'Health Services',
    navDoctors: 'Doctors',
    navEmergency: 'Emergency Help',
    navHealthInfo: 'Health Library',
    navLogin: 'Sign In',
    navRegister: 'Register',
    navDashboard: 'My Dashboard',
    navAdmin: 'Admin Portal',
    navLogout: 'Sign Out',

    // Hero Section
    heroHeading: 'Better Healthcare for a Healthier Rural Tomorrow.',
    heroSubheading:
      'Bridging healthcare distances across rural communities in Kerala. Connect with nearby primary health centres, schedule verified doctor visits, access ambulance helplines, and read critical health guides even without an internet connection.',
    searchFacilityPlaceholder: 'Search by hospital, PHC, locality, or healthcare service...',
    searchAction: 'Search Facilities',

    // 4 Key Pillars
    pillarServicesTitle: 'Find Health Services',
    pillarServicesDesc: 'Locate government PHCs, CHCs, taluk hospitals, and Jan Aushadhi pharmacies.',
    pillarBookingTitle: 'Book an Appointment',
    pillarBookingDesc: 'Skip early morning queues by reserving your consultation slot online.',
    pillarEmergencyTitle: 'Ambulance Assistance',
    pillarEmergencyDesc: 'Instant telephonic access to 108 Kanivu ambulances and high-range rescue teams.',
    pillarOfflineTitle: 'Offline Health Guides',
    pillarOfflineDesc: 'Save first aid and illness guidance onto your mobile device for offline reading.',

    // Common Actions & Labels
    callNow: 'Call Direct',
    getDirections: 'Directions',
    bookAppointment: 'Book Consultation',
    availableToday: 'Available Today',
    fee: 'Consultation Fee',
    freeGovt: 'Free (Govt PHC/CHC)',
    viewDetails: 'View Details',
    filterByDistrict: 'Filter District',
    filterByType: 'Filter Facility Type',
    allDistricts: 'All Districts',
    allTypes: 'All Types',
    loading: 'Loading healthcare information...',
    emergencyDirect: 'Emergency Helpline: 108',
    saveForOffline: 'Save for Offline',
    savedOffline: 'Saved Offline',
    removeFromOffline: 'Remove from Saved',
    offlineStatus: 'Offline Mode Active',
    offlineNotice: 'You are viewing locally stored healthcare content.',

    // Emergency Guide
    emergencyHeader: 'Urgent Medical & Ambulance Directory',
    emergencySubheader:
      'In a medical emergency, direct telephonic contact is the fastest way to save lives. Below are verified Kerala government emergency lines and local rural volunteer rescue contacts.',
    emergencyNoticeTitle: 'What to tell the 108 operator:',
    emergencyNotice1: 'Exact location or nearest recognizable road landmark (e.g. junction, school, temple).',
    emergencyNotice2: 'Condition of the patient (conscious, breathing, severe bleeding, or snakebite).',
    emergencyNotice3: 'Accessibility notes (narrow mud road, 4WD required, or river crossing).',

    // Doctor & Booking
    doctorSpecialities: 'Medical Specialities',
    stepReviewDoctor: '1. Doctor & Facility',
    stepSelectDate: '2. Select Date',
    stepSelectSlot: '3. Select Time Slot',
    stepReviewPatient: '4. Patient Information',
    stepConfirmed: '5. Confirmation',
    symptomsLabel: 'Primary health concerns / symptoms (optional):',
    confirmBookingBtn: 'Confirm Appointment Booking',
    bookingSuccessTitle: 'Appointment Confirmed Successfully!',
    bookingReference: 'Booking Reference Number:',
    cancelAppointment: 'Cancel Appointment',
    confirmCancelPrompt: 'Are you sure you want to cancel this booking? The slot will be released for other patients.',
    cancelReasonLabel: 'Reason for cancellation:',

    // Health Info
    healthLibraryHeader: 'Rural Public Health Library',
    healthLibrarySubheader:
      'Practical health education compiled from Kerala Directorate of Health Services and WHO guidelines. Save articles to read even when traveling outside mobile network zones.',
    medicalDisclaimer:
      'Educational Notice: This health library is strictly for general health literacy and first-aid awareness. It is not a replacement for clinical diagnosis. Consult a qualified medical officer for any medical condition.',
  },
  ml: {
    // Brand & Navigation
    brand: 'റൂറൽ കെയർ',
    tagline: 'ഗ്രാമീണ നാളേക്ക് മെച്ചപ്പെട്ട ആരോഗ്യപരിപാലനം.',
    navHome: 'ഹോം',
    navServices: 'ആരോഗ്യ സേവനങ്ങൾ',
    navDoctors: 'ഡോക്ടർമാർ',
    navEmergency: 'അടിയന്തര സഹായം',
    navHealthInfo: 'ആരോഗ്യ അറിവുകൾ',
    navLogin: 'ലോഗിൻ',
    navRegister: 'രജിസ്റ്റർ',
    navDashboard: 'എന്റെ വിവരങ്ങൾ',
    navAdmin: 'അഡ്മിൻ പോർട്ടൽ',
    navLogout: 'ലോഗ് ഔട്ട്',

    // Hero Section
    heroHeading: 'ഗ്രാമീണ നാളേക്ക് മെച്ചപ്പെട്ട ആരോഗ്യപരിപാലനം.',
    heroSubheading:
      'ഗ്രാമപ്രദേശങ്ങളിലെ ആരോഗ്യസേവനങ്ങൾ വിരൽത്തുമ്പിൽ. അടുത്തുള്ള പ്രാഥമികാരോഗ്യ കേന്ദ്രങ്ങൾ, ഡോക്ടർ അപ്പോയിന്റ്മെന്റുകൾ, ആംബുലൻസ് ഹെൽപ്പ്‌ലൈനുകൾ, ഇന്റർനെറ്റില്ലാതെ വായിക്കാവുന്ന ആരോഗ്യവിവരങ്ങൾ എന്നിവ ലഭ്യമാക്കുന്നു.',
    searchFacilityPlaceholder: 'ആശുപത്രികൾ, പി.എച്ച്.സി, പ്രദേശം അല്ലെങ്കിൽ ചികിത്സ തിരയുക...',
    searchAction: 'തിരയുക',

    // 4 Key Pillars
    pillarServicesTitle: 'ആരോഗ്യ കേന്ദ്രങ്ങൾ',
    pillarServicesDesc: 'സർക്കാർ പി.എച്ച്.സി, സി.എച്ച്.സി, താലൂക്ക് ആശുപത്രികൾ, ജനൗഷധി മെഡിക്കൽ ഷോപ്പുകൾ കണ്ടെത്തുക.',
    pillarBookingTitle: 'ഡോക്ടറെ കാണാൻ ബുക്കിംഗ്',
    pillarBookingDesc: 'നേരത്തെ വരിനിൽക്കാതെ വീട്ടിലിരുന്ന് തന്നെ ഒ.പി ടോക്കൺ ബുക്ക് ചെയ്യാം.',
    pillarEmergencyTitle: 'ആംബുലൻസ് സഹായം',
    pillarEmergencyDesc: '108 കനിവ് ആംബുലൻസ്, മലയോര റെസ്ക്യൂ ടീമുകൾ എന്നിവരിലേക്ക് നേരിട്ട് വിളിക്കാം.',
    pillarOfflineTitle: 'ഓഫ്‌ലൈൻ വിവരങ്ങൾ',
    pillarOfflineDesc: 'ഇന്റർനെറ്റ് ഇല്ലാത്തപ്പോഴും വായിക്കാനായി പ്രഥമശുശ്രൂഷാ വിവരങ്ങൾ ഫോണിൽ സൂക്ഷിക്കാം.',

    // Common Actions & Labels
    callNow: 'വിളിക്കുക',
    getDirections: 'വഴി അറിയുക',
    bookAppointment: 'ബുക്ക് ചെയ്യുക',
    availableToday: 'ഇന്ന് ലഭ്യമാണ്',
    fee: 'കൺസൾട്ടേഷൻ ഫീസ്',
    freeGovt: 'സൗജന്യം (സർക്കാർ കേന്ദ്രം)',
    viewDetails: 'വിശദാംശങ്ങൾ കാണുക',
    filterByDistrict: 'ജില്ല തിരഞ്ഞെടുക്കുക',
    filterByType: 'സ്ഥാപന തരം',
    allDistricts: 'എല്ലാ ജില്ലകളും',
    allTypes: 'എല്ലാ തരങ്ങളും',
    loading: 'വിവരങ്ങൾ ലഭ്യമാക്കുന്നു...',
    emergencyDirect: 'അടിയന്തര ഹെൽപ്പ്‌ലൈൻ: 108',
    saveForOffline: 'ഓഫ്‌ലൈനായി സൂക്ഷിക്കുക',
    savedOffline: 'ഓഫ്‌ലൈനിൽ ലഭ്യമാണ്',
    removeFromOffline: 'ഒഴിവാക്കുക',
    offlineStatus: 'ഓഫ്‌ലൈൻ മോഡ് സജീവം',
    offlineNotice: 'ഇന്റർനെറ്റില്ലാതെ ഫോണിൽ സൂക്ഷിച്ച വിവരങ്ങളാണ് ഇപ്പോൾ കാണുന്നത്.',

    // Emergency Guide
    emergencyHeader: 'അടിയന്തര ആംബുലൻസ് & ഹെൽപ്പ്‌ലൈൻ',
    emergencySubheader:
      'അടിയന്തര ഘട്ടങ്ങളിൽ നേരിട്ട് ഫോൺ വിളിക്കുന്നത് ജീവൻ രക്ഷിക്കാൻ അത്യാവശ്യമാണ്. കേരള സർക്കാരിന്റെ അംഗീകൃത നമ്പറുകളും മലയോര സന്നദ്ധസേവന നമ്പറുകളും താഴെ നൽകുന്നു.',
    emergencyNoticeTitle: '108 ഓപ്പറേറ്ററോട് വ്യക്തമാക്കേണ്ട കാര്യങ്ങൾ:',
    emergencyNotice1: 'കൃത്യമായ സ്ഥലം അല്ലെങ്കിൽ അടുത്തുള്ള അടയാളം (ജംഗ്ഷൻ, സ്കൂൾ, അമ്പലം മുതലായവ).',
    emergencyNotice2: 'രോഗിയുടെ അവസ്ഥ (ബോധമുണ്ടോ, ശ്വാസമെടുക്കുന്നുണ്ടോ, പാമ്പുകടിയേറ്റതാണോ).',
    emergencyNotice3: 'വഴി സൗകര്യം (ഇടുങ്ങിയ റോഡാണോ, ജീപ്പ് മാത്രം പോകുന്ന വഴിയാണോ).',

    // Doctor & Booking
    doctorSpecialities: 'ചികിത്സാ വിഭാഗങ്ങൾ',
    stepReviewDoctor: '1. ഡോക്ടറും ആശുപത്രിയും',
    stepSelectDate: '2. തീയതി തിരഞ്ഞെടുക്കുക',
    stepSelectSlot: '3. സമയം തിരഞ്ഞെടുക്കുക',
    stepReviewPatient: '4. രോഗിയുടെ വിവരങ്ങൾ',
    stepConfirmed: '5. സ്ഥിരീകരണം',
    symptomsLabel: 'പ്രധാന രോഗലക്ഷണങ്ങൾ (ആവശ്യമെങ്കിൽ):',
    confirmBookingBtn: 'ബുക്കിംഗ് സ്ഥിരീകരിക്കുക',
    bookingSuccessTitle: 'അപ്പോയിന്റ്മെന്റ് വിജയകരമായി ബുക്ക് ചെയ്തു!',
    bookingReference: 'ബുക്കിംഗ് റഫറൻസ് നമ്പർ:',
    cancelAppointment: 'ബുക്കിംഗ് റദ്ദാക്കുക',
    confirmCancelPrompt: 'ഈ ബുക്കിംഗ് റദ്ദാക്കണമെന്ന് ഉറപ്പാണോ? ഈ സമയം മറ്റ് രോഗികൾക്കായി ലഭ്യമാകും.',
    cancelReasonLabel: 'റദ്ദാക്കാനുള്ള കാരണം:',

    // Health Info
    healthLibraryHeader: 'ഗ്രാമീണ പൊതുജനാരോഗ്യ ലൈബ്രറി',
    healthLibrarySubheader:
      'കേരള ആരോഗ്യ വകുപ്പും ലോകാരോഗ്യ സംഘടനയും നൽകുന്ന നിർദ്ദേശങ്ങൾ. ഫോൺ നെറ്റ്‌വർക്ക് ഇല്ലാത്തപ്പോഴും വായിക്കാനായി ലേഖനങ്ങൾ ഓഫ്‌ലൈനായി സൂക്ഷിക്കാം.',
    medicalDisclaimer:
      'പ്രത്യേക ശ്രദ്ധയ്ക്ക്: പൊതുജനാരോഗ്യ അറിവുകൾക്കും പ്രഥമശുശ്രൂഷയ്ക്കും വേണ്ടിയുള്ള വിവരങ്ങളാണിത്. വിദഗ്ദ്ധ ഡോക്ടറുടെ ചികിത്സയ്ക്ക് പകരമാവില്ല.',
  },
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('ruralcare_lang') || 'en';
  });

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'ml' : 'en';
    setLang(nextLang);
    localStorage.setItem('ruralcare_lang', nextLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
