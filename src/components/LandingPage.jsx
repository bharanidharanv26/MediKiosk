import React from 'react';
import { Heart, User, Stethoscope, Shield, ArrowRight } from 'lucide-react';

export default function LandingPage({ onSelectPortal }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                MEDIKIOSK
              </h1>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
                Smart Healthcare Self-Service & Medical Continuity Platform
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-gray-300 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 hidden sm:block">
            Prototype • Demo Data Only
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full text-center">
          {/* Hero */}
          <div className="mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Heart size={40} className="text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              MEDIKIOSK
            </h2>
            <p className="text-xl text-gray-600 font-medium mb-3">
              Smart Healthcare Self-Service & Medical Continuity Platform
            </p>
            <p className="text-base text-gray-400 max-w-lg mx-auto">
              One secure digital record for continuous and informed healthcare.
            </p>
          </div>

          {/* Portal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Patient Portal */}
            <button
              onClick={() => onSelectPortal('patient')}
              className="group bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-300 text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 bg-blue-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                  <User size={32} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
                  PATIENT PORTAL
                </h3>
                <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
                  Access your medical records, upload reports and track your healthcare history.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                    Patient Login <ArrowRight size={16} />
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-300 font-semibold">
                    <Shield size={12} /> Secure
                  </div>
                </div>
              </div>
            </button>

            {/* Doctor Portal */}
            <button
              onClick={() => onSelectPortal('doctor')}
              className="group bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-teal-300 shadow-lg hover:shadow-2xl transition-all duration-300 text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 bg-teal-50 group-hover:bg-teal-100 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                  <Stethoscope size={32} className="text-teal-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
                  DOCTOR PORTAL
                </h3>
                <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
                  Access patient records, previous treatments and consultation history.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-teal-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                    Doctor Login <ArrowRight size={16} />
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-300 font-semibold">
                    <Shield size={12} /> Secure
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 max-w-2xl mx-auto">
            <h4 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-4">
              Demo Credentials
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Patient Login</p>
                <p className="text-sm font-semibold text-gray-700">ABHA ID:</p>
                <p className="text-xs font-mono text-gray-500">ABHA-1234-5678-9012</p>
                <p className="text-xs font-mono text-gray-500">ABHA-2345-6789-0123</p>
                <p className="text-xs font-mono text-gray-500">ABHA-3456-7890-1234</p>
                <p className="text-xs font-mono text-gray-500">ABHA-4567-8901-2345</p>
              </div>
              <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">Doctor Login</p>
                <p className="text-sm font-semibold text-gray-700">Doctor ID + Password:</p>
                <p className="text-xs font-mono text-gray-500">DOC-001 / doctor123</p>
                <p className="text-xs font-mono text-gray-500">DOC-002 / doctor123</p>
                <p className="text-xs font-mono text-gray-500">DOC-003 / doctor123</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-4 px-6 text-center">
        <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider">
          Prototype using fictional demo data. Not intended for real medical diagnosis, treatment, or storage of real patient information.
        </p>
      </footer>
    </div>
  );
}
