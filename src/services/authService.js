// Authentication Service for MediKiosk prototype
// Uses localStorage for session state

import { getAll, getByIndex } from './storageService';
import { STORES } from './storageService';

const SESSION_KEY = 'medikiosk_session';

// Session management
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function isLoggedIn() {
  return getSession() !== null;
}

export function getUserRole() {
  const session = getSession();
  return session?.role || null;
}

// Patient authentication
export async function loginPatient(abhaId) {
  const patients = await getAll(STORES.patients);
  const patient = patients.find(
    (p) => p.abhaId && p.abhaId.trim().toUpperCase() === abhaId.trim().toUpperCase()
  );
  
  if (!patient) {
    throw new Error('Patient record not found. Please check your ABHA ID.');
  }
  
  const session = {
    role: 'patient',
    id: patient.id,
    name: patient.name,
    abhaId: patient.abhaId,
  };
  
  saveSession(session);
  return patient;
}

// Doctor authentication
export async function loginDoctor(doctorId, password) {
  const doctors = await getAll(STORES.doctors);
  const doctor = doctors.find(
    (d) => d.id.trim().toUpperCase() === doctorId.trim().toUpperCase()
  );
  
  if (!doctor) {
    throw new Error('Doctor ID not found. Please check your credentials.');
  }
  
  if (doctor.password !== password) {
    throw new Error('Invalid password. Please try again.');
  }
  
  const session = {
    role: 'doctor',
    id: doctor.id,
    name: doctor.name,
    specialization: doctor.specialization,
  };
  
  saveSession(session);
  return doctor;
}

// Logout
export function logout() {
  clearSession();
}

// Get current user based on role
export async function getCurrentPatient() {
  const session = getSession();
  if (!session || session.role !== 'patient') return null;
  
  const patients = await getAll(STORES.patients);
  return patients.find((p) => p.id === session.id) || null;
}

export async function getCurrentDoctor() {
  const session = getSession();
  if (!session || session.role !== 'doctor') return null;
  
  const doctors = await getAll(STORES.doctors);
  return doctors.find((d) => d.id === session.id) || null;
}
