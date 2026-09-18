import React, { useState, useEffect } from 'react';
import { logout, getCurrentPatient } from '../../services/authService';
import { getPatientHistory, getPatientConsultations, getPatientReports, getPatientPrescriptions } from '../../services/patientService';
import Toast from '../common/Toast';
import PatientOverview from './PatientOverview';
import PatientMedicalHistory from './PatientMedicalHistory';
import PatientReports from './PatientReports';
import PatientConsultations from './PatientConsultations';
import PatientPrescriptions from './PatientPrescriptions';
import AddRecord from './AddRecord';
import {
  Heart, LogOut, LayoutDashboard, FileText, Stethoscope, Pill, Plus, Menu, X
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'history', label: 'Medical History', icon: FileText },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'consultations', label: 'Consultations', icon: Stethoscope },
  { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
  { id: 'add-record', label: 'Add Record', icon: Plus },
];

export default function PatientDashboard({ onLogout }) {
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ consultations: 0, reports: 0, prescriptions: 0 });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    try {
      const p = await getCurrentPatient();
      setPatient(p);
      
      if (p) {
        const [consultations, reports, prescriptions] = await Promise.all([
          getPatientConsultations(p.id),
          getPatientReports(p.id),
          getPatientPrescriptions(p.id),
        ]);
        setStats({
          consultations: consultations.length,
          reports: reports.length,
          prescriptions: prescriptions.length,
        });
      }
    } catch (err) {
      setToast({ message: 'Failed to load patient data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handleRecordAdded = () => {
    loadPatientData();
    setActiveTab('overview');
    setToast({ message: 'Record added successfully!', type: 'success' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">Loading patient portal...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Patient not found</p>
      </div>
    );
  }

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
                <p className="text-[10px] text-blue-500 font-semibold uppercase tracking-widest">
                  Patient Portal
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{patient.name}</p>
              <p className="text-xs text-gray-400 font-semibold">{patient.abhaId}</p>
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
        <aside className={`hidden lg:block w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-60px)] sticky top-[60px]`}>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
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
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
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
          {/* Patient Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl">
                {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-extrabold text-gray-900">
                  Welcome, {patient.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                    {patient.id}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    {patient.abhaId}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">
                    {patient.age} y/o • {patient.gender}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">
                    Blood: {patient.bloodGroup}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
              <p className="text-2xl font-extrabold text-blue-600">{stats.consultations}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Consultations</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
              <p className="text-2xl font-extrabold text-teal-600">{stats.reports}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reports</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
              <p className="text-2xl font-extrabold text-emerald-600">{stats.prescriptions}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Prescriptions</p>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && <PatientOverview patient={patient} />}
          {activeTab === 'history' && <PatientMedicalHistory patientId={patient.id} />}
          {activeTab === 'reports' && <PatientReports patientId={patient.id} />}
          {activeTab === 'consultations' && <PatientConsultations patientId={patient.id} />}
          {activeTab === 'prescriptions' && <PatientPrescriptions patientId={patient.id} />}
          {activeTab === 'add-record' && <AddRecord patientId={patient.id} onRecordAdded={handleRecordAdded} />}
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
