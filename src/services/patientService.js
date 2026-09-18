// Patient Service for MediKiosk prototype

import { getAll, getByIndex, put, getById } from './storageService';
import { STORES } from './storageService';

// Get patient by ID
export async function getPatient(patientId) {
  return getById(STORES.patients, patientId);
}

// Get all patients
export async function getAllPatients() {
  return getAll(STORES.patients);
}

// Search patients by name, ID, or ABHA ID
export async function searchPatients(query) {
  const patients = await getAll(STORES.patients);
  const q = query.trim().toLowerCase();
  
  return patients.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.abhaId && p.abhaId.toLowerCase().includes(q))
  );
}

// Get patient medical history
export async function getPatientHistory(patientId) {
  const histories = await getAll(STORES.medicalHistories);
  return histories.find((h) => h.patientId === patientId) || null;
}

// Get patient consultations
export async function getPatientConsultations(patientId) {
  const consultations = await getByIndex(STORES.consultations, 'patientId', patientId);
  // Sort by date, newest first
  return consultations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Get patient reports
export async function getPatientReports(patientId) {
  const reports = await getByIndex(STORES.reports, 'patientId', patientId);
  // Sort by date, newest first
  return reports.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Get patient prescriptions (extracted from consultations)
export async function getPatientPrescriptions(patientId) {
  const consultations = await getPatientConsultations(patientId);
  return consultations
    .filter((c) => c.prescription && c.prescription.length > 0)
    .map((c) => ({
      consultationId: c.consultationId,
      doctorName: c.doctorName,
      specialization: c.specialization,
      date: c.date,
      prescription: c.prescription,
      notes: c.notes,
    }));
}

// Add a new report
export async function addReport(report) {
  await put(STORES.reports, report);
  return report;
}

// Add a new consultation
export async function addConsultation(consultation) {
  await put(STORES.consultations, consultation);
  return consultation;
}

// Update consultation
export async function updateConsultation(consultation) {
  await put(STORES.consultations, consultation);
  return consultation;
}
