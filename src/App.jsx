import React, { useState, useEffect } from 'react';
import { initDB } from './services/storageService';
import { seedDatabase, resetDatabase } from './services/seedService';
import { getSession, isLoggedIn, getUserRole, logout } from './services/authService';
import LandingPage from './components/LandingPage';
import PatientLogin from './components/patient/PatientLogin';
import PatientDashboard from './components/patient/PatientDashboard';
import DoctorLogin from './components/doctor/DoctorLogin';
import DoctorDashboard from './components/doctor/DoctorDashboard';

export default function App() {
  const [view, setView] = useState('loading'); // loading, landing, patient-login, patient-dashboard, doctor-login, doctor-dashboard
  const [toast, setToast] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize IndexedDB
      await initDB();
      
      // Seed database with mock data
      const wasSeeded = await seedDatabase();
      if (wasSeeded) {
        console.log('Database seeded with demo data');
      }

      // Check existing session
      if (isLoggedIn()) {
        const role = getUserRole();
        if (role === 'patient') {
          setView('patient-dashboard');
        } else if (role === 'doctor') {
          setView('doctor-dashboard');
        } else {
          setView('landing');
        }
      } else {
        setView('landing');
      }
    } catch (err) {
      console.error('Failed to initialize app:', err);
      setView('landing');
    }
  };

  const handleSelectPortal = (portal) => {
    if (portal === 'patient') {
      setView('patient-login');
    } else if (portal === 'doctor') {
      setView('doctor-login');
    }
  };

  const handlePatientLogin = (patient) => {
    setView('patient-dashboard');
  };

  const handleDoctorLogin = (doctor) => {
    setView('doctor-dashboard');
  };

  const handlePatientLogout = () => {
    logout();
    setView('landing');
  };

  const handleDoctorLogout = () => {
    logout();
    setView('landing');
  };

  const handleResetDemo = async () => {
    if (window.confirm('Reset all demo records? This will restore original demo data.')) {
      await resetDatabase();
      logout();
      setView('landing');
      setToast({ message: 'Demo data has been reset.', type: 'success' });
    }
  };

  // Loading state
  if (view === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">MEDIKIOSK</h2>
          <p className="text-sm text-gray-500 font-medium">Loading healthcare platform...</p>
          <div className="mt-4">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-lg bg-emerald-50 border-emerald-200 text-emerald-800">
          <span className="text-sm font-semibold">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 p-0.5 rounded hover:bg-black/5 transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {/* Reset Demo Button - Always visible */}
      {view !== 'loading' && (
        <button
          onClick={handleResetDemo}
          className="fixed bottom-4 right-4 z-[90] px-3 py-2 text-[10px] font-bold text-gray-400 hover:text-gray-600 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
          title="Reset Demo Data"
        >
          Reset Demo Data
        </button>
      )}

      {view === 'landing' && (
        <LandingPage onSelectPortal={handleSelectPortal} />
      )}

      {view === 'patient-login' && (
        <PatientLogin
          onLogin={handlePatientLogin}
          onBack={() => setView('landing')}
        />
      )}

      {view === 'patient-dashboard' && (
        <PatientDashboard onLogout={handlePatientLogout} />
      )}

      {view === 'doctor-login' && (
        <DoctorLogin
          onLogin={handleDoctorLogin}
          onBack={() => setView('landing')}
        />
      )}

      {view === 'doctor-dashboard' && (
        <DoctorDashboard onLogout={handleDoctorLogout} />
      )}
    </>
  );
}
