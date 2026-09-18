# MediKiosk

**Smart Healthcare & Medical Continuity Platform**

> ⚠️ **This is a frontend-only prototype using fictional demo data and browser storage. It is not a production healthcare system.**

## Overview

MediKiosk is a smart healthcare continuity platform that demonstrates how medical records can be shared across healthcare providers. The system has two separate user experiences:

- **Patient Portal** — Access medical records, upload reports, and track healthcare history
- **Doctor Portal** — Access patient records, view previous treatments, and manage consultations

The core concept is **Medical Continuity**: when a patient visits multiple doctors, each doctor can see the patient's complete medical history, previous consultations, and uploaded reports.

## Features

### Patient Portal
- ✅ ABHA ID-based login
- ✅ View personal medical history (timeline view)
- ✅ Upload / scan medical reports (camera + OCR)
- ✅ Add medical records manually
- ✅ View consultations and prescriptions
- ✅ View uploaded reports with extracted text

### Doctor Portal
- ✅ Doctor ID + password login
- ✅ Search patients by ID, ABHA ID, or name
- ✅ View complete patient medical history
- ✅ View previous doctor consultations
- ✅ View uploaded reports and OCR text
- ✅ Add new consultations
- ✅ Medical continuity demonstration

### Technical Features
- ✅ IndexedDB for persistent data storage
- ✅ Camera scanning with Tesseract.js OCR
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Accessible UI (large buttons, high contrast, clear labels)
- ✅ Toast notifications
- ✅ Loading states
- ✅ Empty states
- ✅ Demo data reset functionality

## Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **OCR**: Tesseract.js
- **Storage**: IndexedDB (structured data) + localStorage (session state)
- **Deployment**: Static Vite application (Vercel-ready)

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Vercel

1. Push to GitHub repository
2. Import repository in Vercel
3. Vercel will auto-detect Vite and deploy as a static site
4. No environment variables required

## Demo Credentials

### Patient Login (ABHA ID)
| Patient Name | ABHA ID |
|-------------|---------|
| Arjun Sharma | ABHA-1234-5678-9012 |
| Priya Kumar | ABHA-2345-6789-0123 |
| Ravi Kumar | ABHA-3456-7890-1234 |
| Meena Devi | ABHA-4567-8901-2345 |

### Doctor Login (Doctor ID + Password)
| Doctor Name | Doctor ID | Password | Specialization |
|------------|-----------|----------|----------------|
| Dr. Ananya Rao | DOC-001 | doctor123 | General Medicine |
| Dr. Rahul Menon | DOC-002 | doctor123 | Internal Medicine |
| Dr. Priya Nair | DOC-003 | doctor123 | General Medicine |

## Medical Continuity Demo Flow

1. **Patient** logs in with ABHA-1234-5678-9012
2. **Patient** views medical history and reports
3. **Patient** uploads a new blood report
4. **Patient** logs out
5. **Doctor** (DOC-001) logs in
6. **Doctor** searches for patient using ABHA-1234-5678-9012
7. **Doctor** sees: previous consultations, treatments, uploaded reports
8. **Doctor** adds a new consultation
9. **Patient** logs in again
10. **Patient** sees the new consultation in their history

This demonstrates how medical records are shared across healthcare providers.

## Prototype Limitations

⚠️ **Important**: This is a frontend-only prototype with the following limitations:

- Data is stored locally in the browser (IndexedDB)
- Data is NOT synchronized across different devices or browsers
- No real authentication or security
- No HIPAA/GDPR compliance
- No real medical diagnosis or treatment
- All patient data is completely fictional
- No backend server or database

**A production system would require:**
- Secure backend with proper authentication
- Encrypted database
- Role-based access control
- Audit logging
- Healthcare compliance (HIPAA, GDPR)
- Real ABHA integration
- Secure data transmission

## Project Structure

```
src/
├── components/
│   ├── common/          # Shared components (Toast, Avatar, CameraScanner)
│   ├── patient/         # Patient portal components
│   └── doctor/          # Doctor portal components
├── data/                # Mock data (patients, doctors, consultations, reports)
├── services/            # Data services (storage, auth, patient, doctor)
├── utils/               # Utility functions (triage)
├── App.jsx              # Main app with routing
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## License

This is a prototype project for demonstration purposes only.
