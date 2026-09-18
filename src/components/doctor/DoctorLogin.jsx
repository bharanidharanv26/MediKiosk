import React, { useState, useEffect } from 'react';
import { Stethoscope, Heart, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { loginDoctor } from '../../services/authService';
import { getAllDoctors } from '../../services/doctorService';
import Toast from '../common/Toast';

export default function DoctorLogin({ onLogin, onBack }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    const data = await getAllDoctors();
    setDoctors(data);
    if (data.length > 0) {
      setSelectedDoctorId(data[0].id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      setToast({ message: 'Please select a doctor', type: 'error' });
      return;
    }
    if (!password) {
      setToast({ message: 'Please enter password', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const doctor = await loginDoctor(selectedDoctorId, password);
      onLogin(doctor);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex flex-col">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-semibold transition-colors"
          >
            <ArrowLeft size={18} /> Back to Home
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
              <Heart size={20} className="text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-gray-900">
              MEDIKIOSK
            </span>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-8 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Stethoscope size={32} />
              </div>
              <h2 className="text-2xl font-extrabold mb-2">Doctor Portal</h2>
              <p className="text-teal-100 text-sm font-medium">
                Secure access to patient consultation records.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Doctor Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Select Doctor
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {doctors.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setSelectedDoctorId(doc.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                        selectedDoctorId === doc.id
                          ? 'border-teal-500 bg-teal-50 shadow-sm'
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-700 font-bold text-sm">
                        {doc.name.replace(/^Dr\.?\s+/i, '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{doc.name}</p>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                          {doc.specialization} • {doc.cabin}
                        </p>
                      </div>
                      {selectedDoctorId === doc.id && (
                        <span className="w-4 h-4 bg-teal-600 rounded-full flex items-center justify-center">
                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Doctor ID (display only) */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Doctor ID
                </label>
                <input
                  type="text"
                  value={selectedDoctor?.id || ''}
                  readOnly
                  className="w-full p-3 border-2 border-gray-200 rounded-xl font-mono text-sm bg-gray-50 text-gray-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Password for {selectedDoctor?.name || 'doctor'}
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 p-3.5 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50 transition-all"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 font-semibold text-center">
                Demo: password is doctor123 for all doctors
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 font-bold bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Stethoscope size={18} /> Sign In
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
