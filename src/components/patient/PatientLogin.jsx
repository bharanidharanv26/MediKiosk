import React, { useState } from 'react';
import { Search, Heart, ArrowLeft, Shield } from 'lucide-react';
import { loginPatient } from '../../services/authService';
import Toast from '../common/Toast';

export default function PatientLogin({ onLogin, onBack }) {
  const [abhaId, setAbhaId] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!abhaId.trim()) {
      setToast({ message: 'Please enter your ABHA ID', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const patient = await loginPatient(abhaId);
      onLogin(patient);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex flex-col">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
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
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search size={32} />
              </div>
              <h2 className="text-2xl font-extrabold mb-2">Patient Portal</h2>
              <p className="text-blue-100 text-sm font-medium">
                Access your personal healthcare records.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Enter your ABHA ID
                </label>
                <input
                  type="text"
                  value={abhaId}
                  onChange={(e) => setAbhaId(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl font-mono text-center text-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                  placeholder="ABHA-XXXX-XXXX-XXXX"
                  required
                />
                <p className="text-xs text-gray-400 mt-2 font-medium">
                  Your 16-digit Ayushman Bharat Health Account ID
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search size={18} /> Verify & Continue
                  </>
                )}
              </button>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                  Demo ABHA IDs
                </p>
                <div className="space-y-1">
                  <p className="text-xs font-mono text-gray-600">ABHA-1234-5678-9012</p>
                  <p className="text-xs font-mono text-gray-600">ABHA-2345-6789-0123</p>
                  <p className="text-xs font-mono text-gray-600">ABHA-3456-7890-1234</p>
                  <p className="text-xs font-mono text-gray-600">ABHA-4567-8901-2345</p>
                </div>
              </div>
            </form>
          </div>

          {/* Security Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-300 font-semibold">
            <Shield size={14} /> Prototype • Demo Data Only
          </div>
        </div>
      </main>
    </div>
  );
}
