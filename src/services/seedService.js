// Seed Service for MediKiosk prototype
// Initializes IndexedDB with mock data on first launch

import { putAll, getAll, STORES, clearStore } from './storageService';
import { mockPatients } from '../data/mockPatients';
import { mockDoctors } from '../data/mockDoctors';
import { mockConsultations } from '../data/mockConsultations';
import { mockReports } from '../data/mockReports';
import { mockMedicalHistories } from '../data/mockMedicalHistories';

const SEEDED_KEY = 'mediKiosk_seeded';

export async function seedDatabase() {
  // Check if already seeded
  if (localStorage.getItem(SEEDED_KEY)) {
    // Verify data exists
    const patients = await getAll(STORES.patients);
    if (patients.length > 0) {
      return false; // Already seeded
    }
  }
  
  // Seed all data
  await putAll(STORES.patients, mockPatients);
  await putAll(STORES.doctors, mockDoctors);
  await putAll(STORES.consultations, mockConsultations);
  await putAll(STORES.reports, mockReports);
  await putAll(STORES.medicalHistories, mockMedicalHistories);
  
  localStorage.setItem(SEEDED_KEY, 'true');
  return true;
}

export async function resetDatabase() {
  // Clear all stores
  await clearStore(STORES.patients);
  await clearStore(STORES.doctors);
  await clearStore(STORES.consultations);
  await clearStore(STORES.reports);
  await clearStore(STORES.medicalHistories);
  
  // Clear seeded flag
  localStorage.removeItem(SEEDED_KEY);
  
  // Re-seed
  await seedDatabase();
}
