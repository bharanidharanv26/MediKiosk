// Doctor Service for MediKiosk prototype

import { getAll, getByIndex, put } from './storageService';
import { STORES } from './storageService';

// Get doctor by ID
export async function getDoctor(doctorId) {
  const doctors = await getAll(STORES.doctors);
  return doctors.find((d) => d.id === doctorId) || null;
}

// Get all doctors
export async function getAllDoctors() {
  return getAll(STORES.doctors);
}

// Get consultations by doctor
export async function getDoctorConsultations(doctorId) {
  const consultations = await getByIndex(STORES.consultations, 'doctorId', doctorId);
  return consultations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Create a new consultation
export async function createConsultation(consultationData) {
  const consultation = {
    ...consultationData,
    status: 'completed',
    createdAt: new Date().toISOString(),
  };
  await put(STORES.consultations, consultation);
  return consultation;
}

// Update consultation notes
export async function updateConsultationNotes(consultationId, notes) {
  const consultations = await getAll(STORES.consultations);
  const consultation = consultations.find((c) => c.consultationId === consultationId);
  if (consultation) {
    consultation.notes = notes;
    await put(STORES.consultations, consultation);
  }
  return consultation;
}

// Get previous healthcare providers for a patient
export async function getPreviousProviders(patientId) {
  const consultations = await getByIndex(STORES.consultations, 'patientId', patientId);
  
  // Group by doctor and get most recent consultation
  const doctorMap = {};
  consultations.forEach((c) => {
    if (!doctorMap[c.doctorId] || new Date(c.createdAt) > new Date(doctorMap[c.doctorId].date)) {
      doctorMap[c.doctorId] = {
        doctorId: c.doctorId,
        doctorName: c.doctorName,
        specialization: c.specialization,
        lastConsultationDate: c.date,
        consultationCount: (doctorMap[c.doctorId]?.consultationCount || 0) + 1,
      };
    } else {
      doctorMap[c.doctorId].consultationCount++;
    }
  });
  
  return Object.values(doctorMap);
}
