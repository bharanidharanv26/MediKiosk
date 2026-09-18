// Mock medical reports data for MediKiosk prototype

export const mockReports = [
  {
    reportId: "REP-001",
    patientId: "PAT-1001",
    title: "Complete Blood Count",
    type: "Blood Test",
    date: "2026-09-12",
    uploadedAt: "2026-09-12T10:30:00Z",
    source: "Scanned Report",
    description: "Routine blood test performed at Apollo Hospital, Chennai",
    extractedText: `COMPLETE BLOOD COUNT (CBC)
Patient: Arjun Sharma
Age: 45 | Gender: Male
Date: 12 Sep 2026

Hemoglobin: 13.4 g/dL (Normal: 13.5-17.5)
WBC Count: 7200 cells/µL (Normal: 4000-11000)
Platelet Count: 250000 /µL (Normal: 150000-400000)
RBC Count: 4.8 million/µL (Normal: 4.5-5.5)
Hematocrit: 40.2% (Normal: 40-54%)
MCV: 83.7 fL (Normal: 80-100)
MCH: 27.9 pg (Normal: 27-33)
MCHC: 33.3 g/dL (Normal: 32-36)

Interpretation: All parameters within normal limits.
Slightly low hemoglobin - monitor.`,
    image: null,
  },
  {
    reportId: "REP-002",
    patientId: "PAT-1001",
    title: "Lipid Profile",
    type: "Blood Test",
    date: "2026-08-15",
    uploadedAt: "2026-08-15T14:00:00Z",
    source: "Uploaded Report",
    description: "Lipid panel test for diabetes management",
    extractedText: `LIPID PROFILE
Patient: Arjun Sharma
Date: 15 Aug 2026

Total Cholesterol: 210 mg/dL (Desirable: <200)
LDL Cholesterol: 130 mg/dL (Borderline: 130-159)
HDL Cholesterol: 45 mg/dL (Low: <40)
Triglycerides: 180 mg/dL (Borderline: 150-199)
VLDL: 36 mg/dL
Total/HDL Ratio: 4.67

Assessment: Borderline high cholesterol.
LDL slightly elevated. HDL on lower side.
Recommend dietary modifications.`,
    image: null,
  },
  {
    reportId: "REP-003",
    patientId: "PAT-1002",
    title: "Thyroid Function Test",
    type: "Blood Test",
    date: "2026-09-01",
    uploadedAt: "2026-09-01T09:00:00Z",
    source: "Scanned Report",
    description: "Routine thyroid screening",
    extractedText: `THYROID FUNCTION TEST (TFT)
Patient: Priya Kumar
Date: 01 Sep 2026

TSH: 2.8 mIU/L (Normal: 0.4-4.0)
Free T4: 1.2 ng/dL (Normal: 0.8-1.8)
Free T3: 3.1 pg/mL (Normal: 2.3-4.2)

Interpretation: Thyroid function is within normal limits.
No evidence of hypo/hyperthyroidism.`,
    image: null,
  },
  {
    reportId: "REP-004",
    patientId: "PAT-1003",
    title: "ECG Report",
    type: "Diagnostic Report",
    date: "2026-09-12",
    uploadedAt: "2026-09-12T16:00:00Z",
    source: "Hospital Report",
    description: "Electrocardiogram performed during chest pain episode",
    extractedText: `ELECTROCARDIOGRAM (ECG)
Patient: Ravi Kumar | Age: 58 | Male
Date: 12 Sep 2026

Rate: 88 bpm
Rhythm: Normal Sinus
Axis: Normal

Findings:
- Normal sinus rhythm
- ST segment depression in leads V4-V6
- T-wave inversion in lead V5
- No pathological Q waves

Impression:
ST changes suggestive of possible myocardial ischemia.
Recommend cardiac enzyme evaluation and echo.
Correlate clinically.`,
    image: null,
  },
  {
    reportId: "REP-005",
    patientId: "PAT-1004",
    title: "X-Ray - Both Knees",
    type: "X-Ray",
    date: "2026-09-05",
    uploadedAt: "2026-09-05T11:30:00Z",
    source: "Scanned Report",
    description: "Bilateral knee X-ray for osteoarthritis evaluation",
    extractedText: `X-RAY - BOTH KNEES (AP & Lateral)
Patient: Meena Devi | Age: 67 | Female
Date: 05 Sep 2026

Findings:
- Joint space narrowing bilaterally (medial compartment > lateral)
- Osteophyte formation at medial tibial margins
- Subchondral sclerosis bilaterally
- No loose bodies
- Mild varus deformity both knees

Impression:
Bilateral knee osteoarthritis - Grade 3 (Kellgren-Lawrence)
Medial compartment predominant changes.
Recommend orthopedic consultation.`,
    image: null,
  },
];
