import React, { useState, useEffect } from 'react';
import { logout, getCurrentDoctor } from '../../services/authService';
import { getAllPatients, searchPatients } from '../../services/patientService';
import Toast from '../common/Toast';
import DoctorSearch from './DoctorSearch';
import DoctorPatientRecord from './DoctorPatientRecord';
import {
  Heart, LogOut, Search, Users, FileText, ClipboardList, Menu, X, Award, Mail
} from 'lucide-react';

export default function DoctorDashboard({ onLogout }) {
  const [doctor, setDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState('search');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadDoctorData();
  }, []);

  const loadDoctorData = async () => {
    try {
      const d = await getCurrentDoctor();
      setDoctor(d);
    } catch (err) {
      setToast({ message: 'Failed to load doctor data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setActiveTab('record');
    setSidebarOpen(false);
  };

  const handleBackToSearch = () => {
    setSelectedPatient(null);
    setActiveTab('search');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">Loading doctor portal...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Doctor not found</p>
      </div>
    );
  }

  const navItems = [
    { id: 'search', label: 'Patient Search', icon: Search },
    { id: 'record', label: 'Patient Record', icon: FileText, disabled: !selectedPatient },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                <Heart size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight text-gray-900">
                  MEDIKIOSK
                </h1>
                <p className="text-[10px] text-teal-500 font-semibold uppercase tracking-widest">
                  Doctor Portal
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{doctor.name}</p>
              <p className="text-xs text-gray-400 font-semibold">{doctor.specialization}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar Navigation - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-60px)] sticky top-[60px]">
          {/* Doctor Profile */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-700 font-bold">
                {doctor.name.replace(/^Dr\.?\s+/i, '').split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{doctor.name}</p>
                <p className="text-xs text-gray-500">{doctor.specialization}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <Award size={12} /> {doctor.experience} yrs experience
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => !item.disabled && setActiveTab(item.id)}
                  disabled={item.disabled}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === item.id
                      ? 'bg-teal-50 text-teal-600 border border-teal-100'
                      : item.disabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Navigation</h3>
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (!item.disabled) {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }
                      }}
                      disabled={item.disabled}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        activeTab === item.id
                          ? 'bg-teal-50 text-teal-600 border border-teal-100'
                          : item.disabled
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 max-w-5xl">
          {activeTab === 'search' && (
            <DoctorSearch onSelectPatient={handleSelectPatient} />
          )}
          {activeTab === 'record' && selectedPatient && (
            <DoctorPatientRecord
              patient={selectedPatient}
              doctor={doctor}
              onBack={handleBackToSearch}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-3 px-6 text-center">
        <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider">
          Prototype • Demo Data Only • Not a Medical Device
        </p>
      </footer>
    </div>
  );
}
