import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Facility } from '../src/models/Facility.js';
import { Doctor } from '../src/models/Doctor.js';
import { Appointment } from '../src/models/Appointment.js';
import { HealthArticle } from '../src/models/HealthArticle.js';
import { AmbulanceContact } from '../src/models/AmbulanceContact.js';

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('[Seed] Starting database initialization...');

    // 1. Create or update Admin User
    const adminEmail = (process.env.ADMIN_SEED_EMAIL || 'admin@ruralcare.gov.in').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'AdminRuralCare2026!';
    const adminName = process.env.ADMIN_SEED_NAME || 'RuralCare System Admin';
    const adminPhone = process.env.ADMIN_SEED_PHONE || '+91 94470 12345';

    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash(adminPassword, salt);

    await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: adminName,
        email: adminEmail,
        phone: adminPhone,
        passwordHash: adminHash,
        role: 'ADMIN',
        active: true,
      },
      { upsert: true, new: true }
    );
    console.log(`[Seed] Admin account ready: ${adminEmail} (Role: ADMIN)`);

    // 2. Create Demo Patient User
    const demoPatientEmail = 'patient@ruralcare.demo';
    const demoPatientPassword = 'Patient123!';
    const patientHash = await bcrypt.hash(demoPatientPassword, salt);

    const demoPatient = await User.findOneAndUpdate(
      { email: demoPatientEmail },
      {
        name: 'Lakshmi Nair (Demo Patient)',
        email: demoPatientEmail,
        phone: '+91 98460 54321',
        passwordHash: patientHash,
        role: 'PATIENT',
        active: true,
      },
      { upsert: true, new: true }
    );
    console.log(`[Seed] Demo patient ready: ${demoPatientEmail} (Role: PATIENT)`);

    // 3. Clear existing facilities, doctors, articles, ambulance contacts for fresh consistent seed
    await Facility.deleteMany({});
    await Doctor.deleteMany({});
    await HealthArticle.deleteMany({});
    await AmbulanceContact.deleteMany({});
    await Appointment.deleteMany({});

    // 4. Seed Healthcare Facilities across rural Kerala
    const facilitiesData = [
      {
        name: 'Wayanad District Taluk Hospital Mananthavady',
        type: 'HOSPITAL',
        description: 'Key referral hospital serving rural high-range tea estate communities and tribal settlements.',
        address: 'Club Road, Mananthavady, Wayanad, Kerala 670645',
        locality: 'Mananthavady',
        district: 'Wayanad',
        state: 'Kerala',
        coordinates: { lat: 11.8028, lng: 76.0035 },
        contactNumber: '+91 4935 240223',
        emergencyNumber: '108',
        openingHours: '24 Hours / 7 Days (Emergency & Inpatient)',
        services: [
          '24x7 Emergency & Trauma',
          'General Medicine',
          'Maternity & Labor Room',
          'Pediatrics',
          'Blood Storage Unit',
          'Pharmacy',
          'Digital X-Ray & Ultrasound',
        ],
        active: true,
      },
      {
        name: 'Attappady Tribal Specialty Specialty & Primary Health Centre',
        type: 'PHC',
        description: 'Dedicated government primary healthcare institution providing door-step care in Attappady block.',
        address: 'Kottathara, Agali, Attappady, Palakkad, Kerala 678581',
        locality: 'Agali',
        district: 'Palakkad',
        state: 'Kerala',
        coordinates: { lat: 11.0827, lng: 76.6575 },
        contactNumber: '+91 4924 254244',
        emergencyNumber: '108',
        openingHours: '08:00 AM - 06:00 PM (OPD)',
        services: [
          'General OPD',
          'Maternal & Neonatal Nutrition Clinic',
          'Sickle Cell Screening',
          'Free Essential Medicines',
          'Vaccination & Immunisation',
          'Community Health Nursing',
        ],
        active: true,
      },
      {
        name: 'Munnar Community Health Centre (CHC)',
        type: 'CHC',
        description: 'First-response healthcare centre serving plantation workers, tea pickers, and hilly rural hamlets.',
        address: 'Old Munnar Road, Devikulam Taluk, Munnar, Idukki, Kerala 685612',
        locality: 'Munnar',
        district: 'Idukki',
        state: 'Kerala',
        coordinates: { lat: 10.0889, lng: 77.0595 },
        contactNumber: '+91 4865 230272',
        emergencyNumber: '108',
        openingHours: '08:30 AM - 05:30 PM (24x7 Casualty)',
        services: [
          'Plantation Worker Healthcare',
          'Snakebite Anti-venom Ward',
          'Cold Injury Care',
          'Pediatric OPD',
          'Laboratory Diagnostics',
          'Pharmacy',
        ],
        active: true,
      },
      {
        name: 'Meppadi Primary Health Centre & Family Health Unit',
        type: 'PHC',
        description: 'Upgraded Aardram mission family health centre serving forest-edge rural families.',
        address: 'Meppadi Post, Vythiri Taluk, Wayanad, Kerala 673577',
        locality: 'Meppadi',
        district: 'Wayanad',
        state: 'Kerala',
        coordinates: { lat: 11.5518, lng: 76.1265 },
        contactNumber: '+91 4936 282240',
        emergencyNumber: '108',
        openingHours: '09:00 AM - 05:00 PM',
        services: [
          'NCD Screening (Diabetes & BP)',
          'Antenatal Care',
          'Immunisation',
          'Palliative Care Support',
          'Free Generic Pharmacy',
        ],
        active: true,
      },
      {
        name: 'Karunya Jan Aushadhi Rural Pharmacy & Wellness',
        type: 'PHARMACY',
        description: 'Government subsidized essential medicine dispensary providing 90% discount on generic lifesaving drugs.',
        address: 'Civil Station Junction, Sulthan Bathery, Wayanad, Kerala 673592',
        locality: 'Sulthan Bathery',
        district: 'Wayanad',
        state: 'Kerala',
        coordinates: { lat: 11.6627, lng: 76.2571 },
        contactNumber: '+91 4936 220199',
        emergencyNumber: '+91 4936 220199',
        openingHours: '08:00 AM - 08:30 PM',
        services: [
          'Affordable Generic Medicines',
          'Insulin & Diabetic Supplies',
          'Surgical Consumables',
          'Baby Nutrition Products',
          'Blood Pressure Check',
        ],
        active: true,
      },
      {
        name: 'Kattappana Taluk Hospital & Emergency Care Unit',
        type: 'HOSPITAL',
        description: 'High-altitude healthcare facility catering to rural cardamom farmers and agricultural workers.',
        address: 'Puliyanmala Road, Kattappana, Idukki, Kerala 685508',
        locality: 'Kattappana',
        district: 'Idukki',
        state: 'Kerala',
        coordinates: { lat: 9.7544, lng: 77.1189 },
        contactNumber: '+91 4868 272210',
        emergencyNumber: '108',
        openingHours: '24 Hours / 7 Days',
        services: [
          '24/7 Emergency Medicine',
          'Cardiology Consultation',
          'General Surgery',
          'Orthopedics',
          'Dialysis Facility',
          'ICU & Ventilator Support',
        ],
        active: true,
      },
    ];

    const insertedFacilities = await Facility.insertMany(facilitiesData);
    console.log(`[Seed] Inserted ${insertedFacilities.length} healthcare facilities.`);

    // 5. Seed Doctors linked to facilities
    const facMap = {};
    insertedFacilities.forEach((f) => {
      facMap[f.locality] = f._id;
    });

    const doctorsData = [
      {
        name: 'Dr. Anand Ramanathan',
        speciality: 'General Medicine',
        qualifications: 'MBBS, MD (General Medicine) [Demo Doctor]',
        facility: facMap['Mananthavady'],
        languages: ['Malayalam', 'English', 'Tamil'],
        consultationFee: 0,
        profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
        bio: 'Over 12 years of clinical service in rural high-range communities. Focuses on infectious diseases, lifestyle disorders, and rural preventive care.',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        timeSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM'],
        active: true,
      },
      {
        name: 'Dr. Fathima Zahra',
        speciality: 'Obstetrics & Gynecology',
        qualifications: 'MBBS, DGO, MS (OBG) [Demo Doctor]',
        facility: facMap['Mananthavady'],
        languages: ['Malayalam', 'English'],
        consultationFee: 0,
        profileImage: 'https://images.unsplash.com/photo-1594824813583-059e30a5fb25?w=400&auto=format&fit=crop&q=80',
        bio: 'Spearheads high-risk pregnancy screening and safe motherhood initiatives in Wayanad tea estate settlements.',
        availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
        timeSlots: ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:30 PM', '03:00 PM', '03:30 PM'],
        active: true,
      },
      {
        name: 'Dr. Harikrishnan Nair',
        speciality: 'Pediatrics',
        qualifications: 'MBBS, DCH (Pediatrics) [Demo Doctor]',
        facility: facMap['Agali'],
        languages: ['Malayalam', 'Tamil', 'English'],
        consultationFee: 0,
        profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80',
        bio: 'Dedicated child health specialist serving tribal hamlets in Attappady. Dedicated to eliminating malnutrition and infant mortality.',
        availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
        timeSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM'],
        active: true,
      },
      {
        name: 'Dr. Mary Varghese',
        speciality: 'Community Health & Nutrition',
        qualifications: 'MBBS, MPH (Community Health) [Demo Doctor]',
        facility: facMap['Munnar'],
        languages: ['Malayalam', 'Tamil', 'English'],
        consultationFee: 0,
        profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
        bio: 'Experienced in tea estate worker health programs, occupational safety, and rapid response to cold-related respiratory ailments.',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
        timeSlots: ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM'],
        active: true,
      },
      {
        name: 'Dr. Suresh Kumar',
        speciality: 'Orthopedics & Trauma',
        qualifications: 'MBBS, MS (Ortho) [Demo Doctor]',
        facility: facMap['Kattappana'],
        languages: ['Malayalam', 'English'],
        consultationFee: 100,
        profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
        bio: 'Expert in trauma rehabilitation, joint arthritis, and agricultural spine/back injuries common in cardamom farmers.',
        availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
        timeSlots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:30 PM'],
        active: true,
      },
      {
        name: 'Dr. Shilpa Menon',
        speciality: 'Family Medicine & Diabetology',
        qualifications: 'MBBS, PGDHM (Family Practice) [Demo Doctor]',
        facility: facMap['Meppadi'],
        languages: ['Malayalam', 'English'],
        consultationFee: 0,
        profileImage: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&auto=format&fit=crop&q=80',
        bio: 'Focuses on non-communicable disease control, rural geriatric care, and personalized home hypertension monitoring.',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timeSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM'],
        active: true,
      },
    ];

    const insertedDoctors = await Doctor.insertMany(doctorsData);
    console.log(`[Seed] Inserted ${insertedDoctors.length} doctor profiles.`);

    // 6. Seed Bilingual Health Articles
    const articlesData = [
      {
        title: 'Snakebite Emergency Response: Crucial First Aid in Rural Areas',
        slug: 'snakebite-first-aid-rural-kerala',
        category: 'FIRST_AID',
        summary: 'Essential do’s and don’ts when bitten by a snake in plantations or fields. Rapid immobilization and nearest anti-venom hospital transport save lives.',
        content: `### Immediate Steps in a Snakebite Situation:
1. **Keep Calm and Still:** Do not panic or run. Movement accelerates the circulation of venom through the lymphatic system.
2. **Immobilize the Bitten Limb:** Keep the bitten extremity below heart level. Use a wooden splint or cloth sling just like managing a bone fracture.
3. **Remove Constricting Items:** Promptly remove rings, watches, tight bangles, and tight shoes before swelling develops.
4. **DO NOT Cut or Suck the Wound:** Never attempt incision, suction, or application of cow dung/herbs. These cause catastrophic bacterial infections and bleeding.
5. **DO NOT Apply a Tight Tourniquet:** Arterial tourniquets cut off blood supply and can cause gangrene and amputation.
6. **Rush to the Nearest Hospital with Anti-Snake Venom (ASV):** Government Taluk Hospitals and District Hospitals stock polyvalent anti-snake venom.

*Educational Disclaimer: This information is for general awareness. Immediate medical evaluation at a equipped casualty is mandatory.*`,
        malayalamTitle: 'പാമ്പ് കടിയേറ്റാൽ നൽകേണ്ട അടിയന്തര പ്രഥമശുശ്രൂഷകൾ',
        malayalamSummary: 'തോട്ടങ്ങളിലും കൃഷിയിടങ്ങളിലും പാമ്പുകടിയേറ്റാൽ ചെയ്യേണ്ടതും ചെയ്യരുതാത്തതുമായ കാര്യങ്ങൾ. രോഗിയെ അനക്കാതെ ഉടൻ ആശുപത്രിയിലെത്തിക്കുക.',
        malayalamContent: `### പാമ്പുകടിയേറ്റാൽ ഉടനടി ചെയ്യേണ്ട കാര്യങ്ങൾ:
1. **പരിഭ്രാന്തരാകാതിരിക്കുക:** രോഗിയെ ഓടാനോ നടക്കാനോ അനുവദിക്കരുത്. ശരീരം അനങ്ങുമ്പോൾ വിഷം രക്തക്കുഴലുകളിലൂടെയും ലസികാഗ്രന്ഥികളിലൂടെയും വേഗത്തിൽ പടരും.
2. **കടിയേറ്റ ഭാഗം അനക്കാതെ വെക്കുക:** കടിയേറ്റ കൈയോ കാലോ ഹൃദയത്തിന് താഴെയായി നിശ്ചലമായി വെക്കുക. ഒടിവ് സംഭവിച്ചാൽ വെക്കുന്നതുപോലെ ഒരു കഷ്ണം മരക്കഷ്ണമോ തുണിയോ ഉപയോഗിച്ച് താങ്ങു നൽകാം.
3. **ഇറുകിയ സാധനങ്ങൾ മാറ്റുക:** വീക്കം വരുന്നതിനുമുമ്പ് മോതിരം, വള, വാച്ച്, ഇറുകിയ പാദരക്ഷകൾ എന്നിവ അഴിച്ചുമാറ്റുക.
4. **മുറിവിൽ കീറുകയോ വായവെച്ച് വലിച്ചെടുക്കുകയോ ചെയ്യരുത്:** മുറിവ് കീറുന്നതും വിഷം വലിച്ച് കുടിക്കാൻ ശ്രമിക്കുന്നതും പച്ചമരുന്നുകൾ വെക്കുന്നതും കടുത്ത അണുബാധയ്ക്കും രക്തസ്രാവത്തിനും കാരണമാകും.
5. **കയറോ തുണിയോ ഉപയോഗിച്ച് അതിശക്തമായി കെട്ടിയിടരുത്:** രക്തയോട്ടം പൂർണ്ണമായി നിലച്ച് കാലോ കയ്യോ നഷ്ടപ്പെടാൻ (ഗാംഗ്രീൻ) ഇത് കാരണമായേക്കാം.
6. **ആന്റി വെനം സൗകര്യമുള്ള സർക്കാർ ആശുപത്രിയിൽ എത്തിക്കുക:** താലൂക്ക്, ജില്ലാ ആശുപത്രികളിൽ പാമ്പുവിഷത്തിനുള്ള പോളിവാലന്റ് ആന്റി വെനം ലഭ്യമാണ്.

*ശ്രദ്ധിക്കുക: ഇതൊരു പ്രാഥമിക ബോധവൽക്കരണം മാത്രമാണ്. എത്രയും വേഗം രോഗിയെ ആശുപത്രിയിലെത്തിക്കുക.*`,
        sourceAttribution: 'Department of Health & Family Welfare, Government of Kerala & WHO Guidelines',
        readTimeMinutes: 4,
        active: true,
      },
      {
        title: 'Monsoon Fevers: Prevention and Detection of Dengue and Leptospirosis',
        slug: 'monsoon-fevers-dengue-leptospirosis-prevention',
        category: 'PREVENTIVE',
        summary: 'How to protect farming families from water-borne and vector-borne fevers during the South-West and North-East monsoons.',
        content: `### Protecting Against Monsoon Diseases:
- **Leptospirosis (Rat Fever / എലിപ്പനി):** Anyone working in muddy paddy fields, flood water, or clearing drainage must take prophylactic **Doxycycline 200mg once weekly** as prescribed by local health workers (ASHA/PHC).
- **Dengue Fever:** Prevent water stagnation in coconut shells, discarded plastic cups, cocoa pods, and latex collection cups in rubber estates.
- **Red Flag Symptoms:** High persistent fever with intense muscle pain (especially calves), red eyes, yellowish discoloration of eyes (jaundice), or reduced urine output require urgent hospital admission.
- **Never Self-Medicate:** Avoid taking pain relievers like Brufen or Aspirin for unexplained fever, as they can cause severe gastric bleeding in Dengue. Use Paracetamol under guidance.`,
        malayalamTitle: 'മൺസൂൺ പനികൾ: എലിപ്പനിയും ഡെങ്കിപ്പനിയും പ്രതിരോധിക്കാൻ ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ',
        malayalamSummary: 'മഴക്കാലത്ത് കർഷകരും ഗ്രാമീണരും എലിപ്പനി, ഡെങ്കിപ്പനി എന്നിവയിൽ നിന്നും സ്വയം സുരക്ഷിതരാകാനുള്ള നിർദ്ദേശങ്ങൾ.',
        malayalamContent: `### മഴക്കാല രോഗങ്ങളെ എങ്ങനെ പ്രതിരോധിക്കാം:
- **എലിപ്പനി പ്രതിരോധം (ലെപ്റ്റോസ്പൈറോസിസ്):** മണ്ണിലും ചെളിയിലും കെട്ടിക്കിടക്കുന്ന വെള്ളത്തിലും ജോലി ചെയ്യുന്നവർ പ്രാഥമികാരോഗ്യ കേന്ദ്രത്തിൽ നിന്നോ ആശാ പ്രവർത്തകരിൽ നിന്നോ ഡോക്സിസൈക്ലിൻ (Doxycycline) ഗുളിക ആഴ്ചയിലൊരിക്കൽ നിർബന്ധമായും കഴിക്കുക.
- **ഡെങ്കിപ്പനി തടയാൻ:** റബ്ബർ പാൽ ചിരട്ടകൾ, കൊക്കോ തോടുകൾ, ഉപേക്ഷിക്കപ്പെട്ട പ്ലാസ്റ്റിക് പാത്രങ്ങൾ എന്നിവയിൽ ശുദ്ധജലം കെട്ടിക്കിടക്കാതെ ശ്രദ്ധിക്കുക. ഈഡിസ് കൊതുകുകൾ പകൽസമയത്താണ് കടിക്കുന്നത്.
- **അപകടസൂചനകൾ:** കടുത്ത പനി, കണ്ണിന് ചുവപ്പ് നിറം, പേശികളിലെ ശക്തമായ വേദന (പ്രത്യേകിച്ച് കണങ്കാലിൽ), മൂത്രത്തിന്റെ അളവ് കുറയുക, മഞ്ഞപ്പിത്ത ലക്ഷണങ്ങൾ എന്നിവ കണ്ടാൽ ഉടനടി ഡോക്ടറെ കാണുക.
- **സ്വയംചികിത്സ അരുത്:** പനിയുള്ളപ്പോൾ ഡോക്ടറുടെ നിർദ്ദേശമില്ലാതെ ബ്രൂഫെൻ, ആസ്പിരിൻ തുടങ്ങിയ വേദനാസംഹാരികൾ കഴിക്കരുത്. ഇത് ആന്തരിക രക്തസ്രാവത്തിന് കാരണമാകും.`,
        sourceAttribution: 'Directorate of Health Services (DHS) Kerala - Monsoon Preparedness Bulletin',
        readTimeMinutes: 3,
        active: true,
      },
      {
        title: 'Maternal Nutrition & High-Risk Pregnancy Care in Remote Hamlets',
        slug: 'maternal-nutrition-remote-hamlets',
        category: 'MATERNAL',
        summary: 'Essential dietary practices, Iron-Folic Acid supplementation, and early antenatal registration for expectant mothers.',
        content: `### Essential Care During Pregnancy:
1. **First Trimester Registration:** Register the pregnancy at the nearest PHC or with your local ASHA worker before 12 weeks.
2. **Balanced Daily Diet:** Incorporate locally available leafy greens (Moringa/Muringa, Amaranthus/Cheera), eggs, pulses, ragi, and fresh seasonal fruits.
3. **Iron & Calcium Intake:** Take Iron-Folic Acid tablets daily after meals with citrus or lime water (vitamin C aids absorption). Avoid taking iron supplements with tea or coffee.
4. **Blood Pressure & Anemia Monitoring:** Regular checking prevents pre-eclampsia and gestational complications.
5. **Birth Preparedness:** Keep emergency transportation contacts ready at least 3 weeks prior to the expected delivery date.`,
        malayalamTitle: 'ഗർഭിണികളുടെ പോഷകാഹാരവും സുരക്ഷിത പ്രസവത്തിനുള്ള മുൻകരുതലുകളും',
        malayalamSummary: 'ഗ്രാമീണ അമ്മമാർക്കുള്ള പോഷകാഹാര നിർദ്ദേശങ്ങൾ, അയൺ ഗുളികകളുടെ ഉപയോഗം, പ്രസവത്തിന് മുൻപുള്ള ഒരുക്കങ്ങൾ.',
        malayalamContent: `### ഗർഭകാലത്ത് ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ:
1. **നേരത്തെയുള്ള രജിസ്ട്രേഷൻ:** ഗർഭം ധരിച്ച് 12 ആഴ്ചയ്ക്കകം അടുത്തുള്ള പ്രാഥമികാരോഗ്യ കേന്ദ്രത്തിലോ ആശാ പ്രവർത്തക വഴിയോ പേര് രജിസ്റ്റർ ചെയ്യുക.
2. **സമീകൃതാഹാരം:** നാടൻ ഇലക്കറികൾ (മുരിങ്ങയില, ചീര), പയറുവർഗ്ഗങ്ങൾ, റാഗി, മുട്ട, പാൽ എന്നിവ ദിവസേന ഭക്ഷണത്തിൽ ഉൾപ്പെടുത്തുക.
3. **അയൺ, കാൽസ്യം ഗുളികകൾ:** ഡോക്ടറുടെ നിർദ്ദേശപ്രകാരമുള്ള അയൺ ഗുളികകൾ നാരങ്ങാവെള്ളത്തോടൊപ്പമോ ഭക്ഷണശേഷമോ കഴിക്കുക. ചായ, കാപ്പി എന്നിവയോടൊപ്പം അയൺ ഗുളിക കഴിക്കരുത്.
4. **രക്തസമ്മർദ്ദവും ഹീമോഗ്ലോബിനും പരിശോധിക്കുക:** രക്തക്കുറവും പ്രഷറും കൃത്യമായി പരിശോധിക്കുന്നത് സങ്കീർണ്ണതകൾ ഒഴിവാക്കും.
5. **അടിയന്തര വാഹനം ക്രമീകരിക്കുക:** പ്രസവ തീയതിക്ക് മൂന്നാഴ്ച മുമ്പ് തന്നെ ആശുപത്രിയിലെത്താനുള്ള യാത്രാസൗകര്യവും ഫോൺ നമ്പറുകളും കൈവശം കരുതുക.`,
        sourceAttribution: 'National Health Mission (NHM) Kerala & Poshan Abhiyaan',
        readTimeMinutes: 5,
        active: true,
      },
      {
        title: 'Managing High Blood Pressure and Diabetes at Home',
        slug: 'hypertension-diabetes-management-rural',
        category: 'PREVENTIVE',
        summary: 'Practical lifestyle adjustments, salt reduction, and medication adherence for rural families dealing with lifestyle conditions.',
        content: `### Living Well with Hypertension & Sugar:
- **Salt Reduction:** Cut down consumption of salty fish, pickles, and processed snacks. A high salt intake directly spikes arterial pressure.
- **Daily Physical Activity:** 30 minutes of brisk walking or active agricultural work keeps heart and blood vessels flexible.
- **Medication Adherence:** Never discontinue prescribed blood pressure or sugar medication simply because you "feel fine". Hypertension is frequently symptomless until organ damage occurs.
- **Aardram Lifestyle Clinics:** Collect free monthly regular medicines from your local Family Health Centre (FHC).`,
        malayalamTitle: 'പ്രമേഹവും രക്തസമ്മർദ്ദവും വീട്ടിൽ എങ്ങനെ നിയന്ത്രിക്കാം?',
        malayalamSummary: 'ഉപ്പ് കുറച്ചുള്ള ആഹാരശീലം, ദിവസേനയുള്ള വ്യായാമം, കൃത്യമായ മരുന്ന് കഴിപ്പ് എന്നിവയിലൂടെ ബി.പിയും ഷുഗറും നിയന്ത്രിക്കാം.',
        malayalamContent: `### രക്തസമ്മർദ്ദവും പ്രമേഹവും നിയന്ത്രിക്കാനുള്ള വഴികൾ:
- **ഉപ്പിന്റെ ഉപയോഗം കുറയ്ക്കുക:** ഉണക്കമീൻ, അച്ചാറുകൾ, പപ്പടം എന്നിവയുടെ അമിതോപയോഗം ഒഴിവാക്കുക. ഉയർന്ന ഉപ്പ് രക്തസമ്മർദ്ദം വർദ്ധിപ്പിക്കും.
- **ദിവസേനയുള്ള നടത്തം:** ദിവസവും 30 മിനിറ്റ് വേഗത്തിലുള്ള നടത്തമോ ശാരീരിക അധ്വാനമോ ശീലമാക്കുക.
- **മരുന്ന് മുടക്കരുത്:** അസുഖം ഭേദമായെന്ന് തോന്നി സ്വയം മരുന്ന് നിർത്തരുത്. പ്രഷർ പലപ്പോഴും ലക്ഷണങ്ങൾ കാണിക്കാതെ തന്നെ ഹൃദയത്തെയും വൃക്കകളെയും ബാധിക്കാം.
- **ആർദ്രം ഫാമിലി ഹെൽത്ത് സെന്റർ:** അടുത്തുള്ള കുടുംബാരോഗ്യ കേന്ദ്രത്തിൽ നിന്നും ജീവിതശൈലീ രോഗങ്ങൾക്കുള്ള മരുന്നുകൾ സൗജന്യമായി ലഭിക്കും.`,
        sourceAttribution: 'Kerala State Non-Communicable Diseases (NCD) Control Mission',
        readTimeMinutes: 4,
        active: true,
      },
      {
        title: 'Safe Drinking Water and Protection Against Typhoid and Hepatitis A',
        slug: 'safe-drinking-water-sanitation-rural',
        category: 'HYGIENE',
        summary: 'Effective well-water chlorination, boiling techniques, and hand hygiene to prevent viral jaundice and waterborne outbreaks.',
        content: `### Ensuring Safe Household Water:
1. **Rolling Boil Water:** Bring drinking water to a full rolling boil for at least 1 minute. Simply heating or warming water does not kill Hepatitis A virus or Typhoid bacteria.
2. **Periodic Well Chlorination:** Super-chlorinate household drinking water wells twice a year, especially before and after monsoon rains, using bleaching powder according to health inspector guidelines.
3. **Safe Storage:** Store boiled water in clean, covered stainless steel or clay vessels with a ladle. Never dip unwashed hands into drinking water.
4. **Food Hygiene:** Wash vegetables thoroughly and avoid consuming unpeeled roadside cut fruits.`,
        malayalamTitle: 'ശുദ്ധജല ഉപയോഗവും മഞ്ഞപ്പിത്തം, ടൈഫോയ്ഡ് പ്രതിരോധവും',
        malayalamSummary: 'കിണറുകൾ ക്ലോറിനേറ്റ് ചെയ്യൽ, തിളപ്പിച്ചാറിയ വെള്ളം കുടിക്കൽ എന്നിവയിലൂടെ ജലജന്യ രോഗങ്ങളെ തടയാം.',
        malayalamContent: `### ശുദ്ധജലം ഉറപ്പാക്കാൻ ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ:
1. **വെള്ളം നന്നായി തിളപ്പിക്കുക:** കുടിവെള്ളം കുറഞ്ഞത് ഒരു മിനിറ്റെങ്കിലും വെട്ടിത്തിളപ്പിക്കുക. വെള്ളം ചൂടാക്കിയതുകൊണ്ട് മാത്രം മഞ്ഞപ്പിത്തം (ഹെപ്പറ്റൈറ്റിസ് എ), ടൈഫോയ്ഡ് എന്നിവയുടെ അണുക്കൾ നശിക്കില്ല.
2. **കിണർ ക്ലോറിനേഷൻ:** മഴക്കാലത്തിന് മുമ്പും ശേഷവും ബ്ലീച്ചിംഗ് പൗഡർ ഉപയോഗിച്ച് കിണറുകൾ ശുചീകരിക്കുക. ഇതിനായി അടുത്തുള്ള ജൂനിയർ ഹെൽത്ത് ഇൻസ്പെക്ടറുടെ സഹായം തേടാം.
3. **വൃത്തിയുള്ള പാത്രങ്ങളിൽ സൂക്ഷിക്കുക:** തിളപ്പിച്ച വെള്ളം അടപ്പുള്ള പാത്രങ്ങളിൽ സൂക്ഷിക്കുക. കൈമുക്കി വെള്ളം എടുക്കരുത്.
4. **കൈകൾ വൃത്തിയായി കഴുകുക:** ഭക്ഷണത്തിന് മുമ്പും ടോയ്‌ലറ്റ് ഉപയോഗിച്ച ശേഷവും കൈകൾ സോപ്പുപയോഗിച്ച് കഴുകുക.`,
        sourceAttribution: 'Department of Health Services, Water Quality Surveillance Wing Kerala',
        readTimeMinutes: 3,
        active: true,
      },
    ];

    const insertedArticles = await HealthArticle.insertMany(articlesData);
    console.log(`[Seed] Inserted ${insertedArticles.length} bilingual health articles.`);

    // 7. Seed Emergency Ambulance & Helpline Directory
    const ambulanceData = [
      {
        displayName: 'Kanivu 108 Government Emergency Medical Ambulance Service',
        telephoneNumber: '108',
        serviceArea: 'Statewide Kerala — All 14 Districts (24/7 Central Dispatch)',
        district: 'Statewide',
        contactType: 'GOVERNMENT',
        vehicleType: 'ADVANCED_LIFE_SUPPORT',
        verificationStatus: 'VERIFIED_ACTIVE',
        lastVerifiedDate: new Date(),
        operationalHours: '24 Hours / 365 Days',
        notes: 'Kerala state emergency toll-free ambulance hotline. Toll-free direct dial from any mobile or landline.',
        active: true,
      },
      {
        displayName: '102 Mother & Child Emergency Transport Service (NHM)',
        telephoneNumber: '102',
        serviceArea: 'Statewide Kerala — Rural Primary & Community Health Centres',
        district: 'Statewide',
        contactType: 'GOVERNMENT',
        vehicleType: 'PATIENT_TRANSPORT',
        verificationStatus: 'VERIFIED_ACTIVE',
        lastVerifiedDate: new Date(),
        operationalHours: '24 Hours / 7 Days',
        notes: 'Dedicated government transport for expectant mothers in labor and sick neonates.',
        active: true,
      },
      {
        displayName: 'DISHA National Health Helpline 104 / 1056',
        telephoneNumber: '1056',
        serviceArea: 'Statewide 24/7 Tele-Medicine & Health Emergency Advisory',
        district: 'Statewide',
        contactType: 'GOVERNMENT',
        vehicleType: 'BASIC_LIFE_SUPPORT',
        verificationStatus: 'VERIFIED_ACTIVE',
        lastVerifiedDate: new Date(),
        operationalHours: '24 Hours / 7 Days',
        notes: 'Direct telephone advice from medical officers, mental health counselors, and snakebite referral support.',
        active: true,
      },
      {
        displayName: 'Wayanad High-Range 4WD Hill Ambulance (Demonstration Unit)',
        telephoneNumber: '+91 94471 00108',
        serviceArea: 'Mananthavady, Thirunelly, Pulpally & Tribal Belts',
        district: 'Wayanad',
        contactType: 'COMMUNITY',
        vehicleType: '4WD_TERRAIN_AMBULANCE',
        verificationStatus: 'DEMO_DATA',
        lastVerifiedDate: new Date(),
        operationalHours: '24 Hours Emergency On-Call',
        notes: 'Demonstration 4WD terrain ambulance equipped for forest tracks, unpaved plantation roads, and rocky climbs.',
        active: true,
      },
      {
        displayName: 'Attappady Valley Tribal Rescue Ambulance (Demonstration Unit)',
        telephoneNumber: '+91 94472 00108',
        serviceArea: 'Agali, Sholayur, Pudur tribal hamlets and river crossings',
        district: 'Palakkad',
        contactType: 'COMMUNITY',
        vehicleType: '4WD_TERRAIN_AMBULANCE',
        verificationStatus: 'DEMO_DATA',
        lastVerifiedDate: new Date(),
        operationalHours: '24 Hours Emergency On-Call',
        notes: 'Demonstration unit managed by local community volunteers for emergency transfers to Kottathara hospital.',
        active: true,
      },
      {
        displayName: 'Munnar High-Altitude Tea Plantation Ambulance (Demonstration Unit)',
        telephoneNumber: '+91 94473 00108',
        serviceArea: 'Devikulam, Munnar estates, Marayoor & Vattavada',
        district: 'Idukki',
        contactType: 'CHARITABLE',
        vehicleType: 'BASIC_LIFE_SUPPORT',
        verificationStatus: 'DEMO_DATA',
        lastVerifiedDate: new Date(),
        operationalHours: '24 Hours / 7 Days',
        notes: 'Demonstration charitable ambulance with portable oxygen cylinder and hypothermia warming blankets.',
        active: true,
      },
    ];

    const insertedAmbulances = await AmbulanceContact.insertMany(ambulanceData);
    console.log(`[Seed] Inserted ${insertedAmbulances.length} ambulance emergency contacts.`);

    // 8. Seed a demo initial appointment for the demo patient
    const initialAppointment = await Appointment.create({
      appointmentRef: 'RC-2026-DEMO01',
      patient: demoPatient._id,
      doctor: insertedDoctors[0]._id,
      facility: insertedFacilities[0]._id,
      appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
      timeSlot: '10:00 AM',
      status: 'BOOKED',
      isActiveSlot: true,
      symptoms: 'Routine checkup for seasonal allergic cough and mild headache.',
    });
    console.log(`[Seed] Created demo appointment reference: ${initialAppointment.appointmentRef}`);

    console.log('\n=============================================================');
    console.log('✅ RuralCare Database Seeding Completed Successfully!');
    console.log('   Admin Login:   ', adminEmail, ' / ', adminPassword);
    console.log('   Patient Login: ', demoPatientEmail, ' / ', demoPatientPassword);
    console.log('=============================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedDatabase();
