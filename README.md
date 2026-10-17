# RuralCare — An Accessible Rural Healthcare Platform

> **"Better Healthcare for a Healthier Rural Tomorrow."**  
> An offline-first, full-stack MERN healthcare application with online appointment booking, emergency ambulance directory, OpenStreetMap healthcare discovery, and bilingual (English/Malayalam) health guidance.

---

## 1. Project Overview

RuralCare bridges healthcare geographical barriers in rural and high-range agrarian communities (specifically designed for Kerala's high-range districts such as Wayanad, Palakkad/Attappady, and Idukki/Munnar). The platform enables rural patients, tea-estate workers, and tribal communities to locate government healthcare facilities (PHCs, CHCs, Taluk Hospitals, Jan Aushadhi pharmacies), consult scheduled medical officers with zero queue wait times, contact verified ambulance services via direct telephone helplines, and access life-saving health and snakebite first-aid guides completely offline.

---

## 2. Key Features

- **Facility Discovery with Interactive OpenStreetMap**:
  - Filter by facility type: Primary Health Centres (`PHC`), Community Health Centres (`CHC`), Taluk Referral Hospitals (`HOSPITAL`), and Jan Aushadhi generic dispensaries (`PHARMACY`).
  - Search by locality, district, or healthcare service (e.g., snakebite anti-venom, maternity care).
  - Toggle seamlessly between a card list view and a free Leaflet/OpenStreetMap view with interactive pins, popups, and directions links.
  - Optional one-click browser geolocation ("Locate Me") without paid map API dependencies.

- **Doctor Directory & 5-Step Appointment Booking Wizard**:
  - Browse qualified medical practitioners, specialities, consultation schedules, and languages spoken.
  - Multi-step guided appointment wizard:
    1. Review Doctor & Facility.
    2. Date Selector (upcoming 14 days based on doctor's scheduled working days).
    3. Live Time Slot Selector (queries active server bookings in real time).
    4. Patient Review & optional symptoms note.
    5. Server-Confirmed Voucher with a unique reference number (e.g. `RC-2026-XXXX`).
  - **Database-Level Double-Booking Prevention**: Concurrency-safe unique compound index on active slots. Race conditions immediately return a `409 Conflict`.
  - **Cancellation & Slot Release**: Cancelling an appointment sets `isActiveSlot: false`, preserving appointment audit records while making the slot instantly bookable again.

- **Emergency & Ambulance Assistance**:
  - Prominent red emergency UI with 1-touch telephone calling (`tel:108` for Kerala Kanivu Ambulance, `tel:102` for Mother & Child transport, and `tel:1056` for DISHA tele-health advisory).
  - Directory of verified public ambulance services and high-range 4WD terrain rescue units.
  - Structured communication checklist for operators (exact landmarks, patient vitals, road accessibility).
  - Explicit transparency: telephonic connection with zero fake GPS tracking claims.

- **Offline-First Health Library & Progressive Web App (PWA)**:
  - Certified health guides (Snakebite First Aid, Monsoon Fevers, Maternal Nutrition, Water Chlorination, Hypertension Management).
  - **IndexedDB Storage**: "Save for Offline" action saves articles directly into browser IndexedDB (`RuralCareOfflineDB`), allowing reading with zero network connection.
  - Service worker caching app shell and static assets while strictly excluding private patient records and auth cookies.
  - Automatic offline detection with a persistent warning banner and offline fallback page (`offline.html`).

- **Bilingual English & Malayalam Readiness**:
  - Built-in language toggle supporting full Unicode Malayalam typography (`Noto Sans Malayalam`).
  - Dual-language UI labels, instructions, emergency checklists, and bilingual health article content.

- **Role-Based Patient & Admin Portals**:
  - **Patient Dashboard**: Upcoming appointments, past history, cancellation trigger, saved offline articles list, and profile editing.
  - **Admin Control Hub**: Supervise facilities (create/toggle active), manage doctors and facility assignments, oversee all patient bookings, publish bilingual health articles, and update ambulance verification records.

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, JavaScript (ESM), Tailwind CSS v4 |
| **Icons & UI** | Lucide React |
| **Routing** | React Router v7 |
| **Mapping** | Leaflet & OpenStreetMap (No paid API key required) |
| **PWA & Offline** | Web App Manifest, Service Worker (`sw.js`), IndexedDB (`idb`) |
| **Backend** | Node.js (v24+), Express.js (v4.19+) |
| **Database** | MongoDB (v8+) with Mongoose (v8.5+) |
| **Authentication** | JSON Web Tokens (JWT) stored in HttpOnly, SameSite cookies with bcryptjs password hashing |
| **Security** | Helmet HTTP headers, CORS with credentials, express-rate-limit, input normalization |

---

## 4. Application Architecture

```
RuralCare/
├── package.json                 # Unified root scripts (dev, seed, test, build)
├── server/                      # Express.js REST API Backend
│   ├── package.json
│   ├── .env                     # Backend environment configuration
│   ├── .env.example
│   ├── scripts/
│   │   └── seed.js              # Idempotent seed script (Kerala facilities, doctors, articles)
│   ├── tests/
│   │   └── run-tests.js         # Automated backend test suite (17 tests)
│   └── src/
│       ├── config/db.js         # Mongoose connection
│       ├── models/              # User, Facility, Doctor, Appointment, HealthArticle, AmbulanceContact
│       ├── middleware/          # authenticate, authorizeAdmin, rateLimiter, errorHandler
│       ├── controllers/         # Auth, facilities, doctors, appointments, articles, ambulances
│       ├── routes/              # Modular Express routers
│       ├── utils/               # JWT helper, appointment reference generator
│       ├── app.js               # Express application configuration
│       └── server.js            # Server bootstrap
└── client/                      # Vite + React Frontend
    ├── package.json
    ├── vite.config.js           # Vite config with Tailwind v4 & proxy to backend
    ├── index.html               # Manifest, PWA registration, and Malayalam font imports
    ├── public/
    │   ├── manifest.webmanifest # PWA Web App Manifest
    │   ├── sw.js                # Service worker caching app shell safely
    │   ├── offline.html         # Offline navigation fallback
    │   └── icons/               # PWA brand icons (192x192, 512x512)
    └── src/
        ├── index.css            # Tailwind CSS v4 & Leaflet imports
        ├── context/             # AuthContext, LanguageContext
        ├── services/api.js      # Centralized credentials-enabled API client
        ├── utils/offlineDb.js   # IndexedDB helper for offline saved articles
        ├── components/          # Navbar, Footer, FacilityCard, DoctorCard, LeafletMap, etc.
        ├── layouts/             # MainLayout, AdminLayout
        ├── pages/               # Home, Services, FacilityDetails, Doctors, BookAppointment,
        │                        # Emergency, HealthInfo, HealthArticleDetails, Login, Register,
        │                        # Dashboard, AdminDashboard, NotFound
        ├── App.jsx
        └── main.jsx
```

---

## 5. Prerequisites

Before running the project locally, ensure you have:
1. **Node.js**: `v20.0.0` or higher (verified on Node `v24.12.0`).
2. **npm**: `v10.0.0` or higher (verified on npm `11.6.2`).
3. **MongoDB**: A running local MongoDB instance on port `27017` or a remote MongoDB Atlas URI.

---

## 6. Environment Setup

The backend configuration is located in `server/.env`. A template is provided in `server/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ruralcare
JWT_SECRET=ruralcare_super_secure_jwt_secret_dev_key_2026_!@#
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Seed Admin Account
ADMIN_SEED_NAME="RuralCare System Admin"
ADMIN_SEED_EMAIL=admin@ruralcare.gov.in
ADMIN_SEED_PASSWORD=AdminRuralCare2026!
ADMIN_SEED_PHONE=+91 94470 12345
```

---

## 7. Windows PowerShell Quickstart Commands

Open a Windows PowerShell terminal inside the `RuralCare` project folder:

### 1. Install Dependencies
```powershell
# Root dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..

# Frontend dependencies
cd client
npm install
cd ..
```

### 2. Seed the Demonstration Database
Populates Kerala healthcare facilities, doctors, bilingual articles, emergency ambulance lines, and admin/patient accounts:
```powershell
npm run seed
```

### 3. Run Automated Tests
Verifies authentication, doctor availability, appointment booking, double-booking rejection (409 Conflict), and slot rebooking:
```powershell
npm run test
```

### 4. Build Client for Production
```powershell
npm run build
```

### 5. Start Both Backend and Frontend Concurrently
```powershell
npm run dev
```

The terminal will launch:
- **Backend API Server**: `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`)
- **Frontend Vite Application**: `http://localhost:5173`

---

## 8. Demonstration Accounts

The seed script creates two demonstration accounts:

### 1. Administrator Account
- **Email**: `admin@ruralcare.gov.in`
- **Password**: `AdminRuralCare2026!`
- **Role**: `ADMIN`
- **Capabilities**: Full access to `/admin` to add/edit facilities, assign doctors to clinics, manage schedules, oversee patient appointments, publish articles, and update ambulance verifications.

### 2. Patient Account
- **Email**: `patient@ruralcare.demo`
- **Password**: `Patient123!`
- **Role**: `PATIENT`
- **Capabilities**: Book appointments, cancel appointments, view upcoming/past booking history, edit profile details, and save health articles offline.

*(You can also use the "Demo Credentials" quick prefill buttons on the `/login` page for fast testing).*

---

## 9. Database-Level Slot Uniqueness Strategy

To prevent race conditions when two patients simultaneously attempt to reserve the same doctor consultation slot, `Appointment` uses a Mongoose partial compound unique index:

```javascript
appointmentSchema.index(
  { doctor: 1, appointmentDate: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: { isActiveSlot: true },
  }
);
```

- When booked: `isActiveSlot: true`. MongoDB guarantees only **one** document can hold that slot. Any concurrent duplicate attempt fails with a `409 Conflict (SLOT_ALREADY_BOOKED)`.
- When cancelled: `isActiveSlot: false`. The partial filter releases the slot constraint, allowing another patient to immediately reserve the slot while retaining the original appointment document for audit history.

---

## 10. Offline Functionality & Online Requirements

### What Works Completely Offline:
- **Application Shell**: Cached by `sw.js` (PWA). The UI loads instantly without network connectivity.
- **Saved Health Guides**: Saved articles stored in IndexedDB (`RuralCareOfflineDB`) remain fully readable (with both English and Malayalam translations).
- **Offline Health Guide Viewer**: Direct navigation to `/health-info` with the "Saved Offline" tab auto-activated when offline.
- **Emergency Telephone Helplines**: Direct phone numbers (`108`, `102`, `1056`) use standard mobile GSM telephony (`tel:` links), which operates even when mobile internet data is disabled.
- **Offline Fallback Page**: Custom `offline.html` displays if an uncached URL is requested.

### What Requires an Internet Connection:
- **Live User Authentication**: Sign in and registration with server-validated JWT sessions.
- **Live Slot Availability Queries**: Checking real-time booked vs open slots in MongoDB.
- **Submitting New Appointments**: Writing new bookings to MongoDB.
- **Admin Database Updates**: Adding facilities, editing doctors, or updating article content.
- **Fresh OpenStreetMap Tiles**: Downloading new map tiles outside the browser's disk cache.

---

## 11. API Route Summary

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | System uptime & MongoDB connection status |
| `POST` | `/api/auth/register` | Public (Rate-limited) | Register patient account |
| `POST` | `/api/auth/login` | Public (Rate-limited) | Sign in and receive HttpOnly cookie |
| `POST` | `/api/auth/logout` | Public | Clear authentication cookie |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current session user |
| `PUT` | `/api/auth/profile` | Authenticated | Update patient name and phone |
| `GET` | `/api/facilities` | Public | List and search facilities with filters |
| `GET` | `/api/facilities/:id` | Public | Facility details with affiliated doctors |
| `POST` | `/api/facilities` | Admin Only | Create new healthcare facility |
| `PATCH` | `/api/facilities/:id/status`| Admin Only | Toggle facility active/inactive |
| `GET` | `/api/doctors` | Public | Doctor directory with specialty filter |
| `GET` | `/api/doctors/:id` | Public | Doctor profile |
| `GET` | `/api/doctors/:id/availability` | Public | Query open vs booked slots for a date |
| `POST` | `/api/doctors` | Admin Only | Add doctor and assign to facility |
| `POST` | `/api/appointments` | Patient | Book consultation slot (with collision safety) |
| `GET` | `/api/appointments/my` | Patient | Retrieve authenticated patient's bookings |
| `PATCH` | `/api/appointments/:id/cancel`| Patient/Admin | Cancel appointment & release slot |
| `GET` | `/api/appointments/admin` | Admin Only | View all patient appointments with filters |
| `GET` | `/api/articles` | Public | Search health articles by category |
| `GET` | `/api/articles/:identifier`| Public | View article by slug or ObjectId |
| `POST` | `/api/articles` | Admin Only | Publish bilingual health article |
| `GET` | `/api/ambulances` | Public | Emergency ambulance contact directory |
| `POST` | `/api/ambulances` | Admin Only | Add ambulance contact |

---

## 12. Security & Privacy Implementations

1. **HttpOnly Cookie Authentication**: JWT tokens are transmitted through secure HttpOnly cookies, safeguarding against Cross-Site Scripting (XSS) token extraction.
2. **Role Isolation**: Public registration strictly sets `role: 'PATIENT'`. The administrative role can only be established through the secure server seed script.
3. **Record Ownership Enforcement**: Patients can only inspect and cancel their own appointment records; backend middleware verifies `appointment.patient.toString() === req.user._id.toString()`.
4. **Brute Force Protection**: Express rate limiting (`express-rate-limit`) limits repeated authentication requests per IP address.
5. **No Sensitive PWA Caching**: The service worker explicitly excludes `/api/auth` and `/api/appointments` from shared browser caches.
6. **Centralized Error Scrubbing**: Stack traces are never exposed in production error responses.

---

## 13. License & Attribution

- Built as an open-source student healthcare project under the **MIT License**.
- Public health content references guidelines published by the **Directorate of Health Services (DHS), Government of Kerala** and the **World Health Organization (WHO)**.
- Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
