// IndexedDB Storage Service for MediKiosk prototype
// Uses IndexedDB for structured data, localStorage for session state

const DB_NAME = 'mediKioskDB';
const DB_VERSION = 1;

const STORES = {
  patients: 'patients',
  doctors: 'doctors',
  consultations: 'consultations',
  reports: 'reports',
  medicalHistories: 'medicalHistories',
};

let dbInstance = null;

// Initialize IndexedDB
export function initDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object stores
      if (!db.objectStoreNames.contains(STORES.patients)) {
        db.createObjectStore(STORES.patients, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.doctors)) {
        db.createObjectStore(STORES.doctors, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.consultations)) {
        const consultationStore = db.createObjectStore(STORES.consultations, { keyPath: 'consultationId' });
        consultationStore.createIndex('patientId', 'patientId', { unique: false });
        consultationStore.createIndex('doctorId', 'doctorId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.reports)) {
        const reportStore = db.createObjectStore(STORES.reports, { keyPath: 'reportId' });
        reportStore.createIndex('patientId', 'patientId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.medicalHistories)) {
        db.createObjectStore(STORES.medicalHistories, { keyPath: 'patientId' });
      }
    };
  });
}

// Generic CRUD operations
function transaction(storeName, mode = 'readonly') {
  const tx = dbInstance.transaction(storeName, mode);
  return tx.objectStore(storeName);
}

export async function getAll(storeName) {
  await initDB();
  return new Promise((resolve, reject) => {
    const store = transaction(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getById(storeName, id) {
  await initDB();
  return new Promise((resolve, reject) => {
    const store = transaction(storeName);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getByIndex(storeName, indexName, value) {
  await initDB();
  return new Promise((resolve, reject) => {
    const store = transaction(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function put(storeName, data) {
  await initDB();
  return new Promise((resolve, reject) => {
    const store = transaction(storeName, 'readwrite');
    const request = store.put(data);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function putAll(storeName, dataArray) {
  await initDB();
  return new Promise((resolve, reject) => {
    const tx = dbInstance.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    
    dataArray.forEach(item => store.put(item));
    
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearStore(storeName) {
  await initDB();
  return new Promise((resolve, reject) => {
    const store = transaction(storeName, 'readwrite');
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteById(storeName, id) {
  await initDB();
  return new Promise((resolve, reject) => {
    const store = transaction(storeName, 'readwrite');
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export { STORES };
