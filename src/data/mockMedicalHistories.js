// Mock medical history data for MediKiosk prototype

export const mockMedicalHistories = [
  {
    patientId: "PAT-1001",
    knownConditions: ["Type 2 Diabetes", "Hypertension"],
    currentMedications: ["Metformin 500mg", "Amlodipine 5mg"],
    allergies: ["Penicillin"],
    summary: "Patient has a history of managed Type 2 Diabetes diagnosed in 2018 and Hypertension diagnosed in 2020. Currently compliant with Metformin 500mg twice daily and Amlodipine 5mg once daily. Blood sugar levels have been stable over the past 6 months. Last HbA1c was 6.8%. No known complications of diabetes observed.",
    lastDoctorVisit: "2026-09-10",
    lastDoctorName: "Dr. Ananya Rao",
  },
  {
    patientId: "PAT-1002",
    knownConditions: ["Migraine"],
    currentMedications: ["Sumatriptan 50mg (PRN)"],
    allergies: [],
    summary: "Patient has a 5-year history of episodic migraine, typically 2-3 attacks per month. Usually presents with unilateral throbbing headache, photophobia, and nausea. Responds well to Sumatriptan 50mg as needed. No aura reported. No significant family history of neurological conditions.",
    lastDoctorVisit: "2026-09-05",
    lastDoctorName: "Dr. Priya Nair",
  },
  {
    patientId: "PAT-1003",
    knownConditions: ["Hypertension", "High Cholesterol"],
    currentMedications: ["Atorvastatin 20mg", "Losartan 50mg"],
    allergies: ["Sulfa drugs"],
    summary: "Patient has been managing Hypertension since 2015 and Hyperlipidemia since 2019. On Losartan 50mg for blood pressure and Atorvastatin 20mg for cholesterol. Last lipid panel showed total cholesterol of 210 mg/dL and LDL of 130 mg/dL. Adheres to a low-sodium diet. Reports occasional dizziness.",
    lastDoctorVisit: "2026-09-12",
    lastDoctorName: "Dr. Rahul Menon",
  },
  {
    patientId: "PAT-1004",
    knownConditions: ["Osteoarthritis"],
    currentMedications: ["Ibuprofen 400mg", "Glucosamine 1500mg"],
    allergies: ["Aspirin", "Ibuprofen"],
    summary: "Patient was diagnosed with Osteoarthritis of the knees in 2017. Currently managing symptoms with Glucosamine supplementation and occasional NSAIDs. Reports chronic bilateral knee pain, stiffness in the morning lasting approximately 30 minutes, and difficulty climbing stairs. Has been advised physiotherapy but has not been consistent.",
    lastDoctorVisit: "2026-09-08",
    lastDoctorName: "Dr. Priya Nair",
  },
];
