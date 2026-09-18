import React, { useState, useEffect } from 'react';
import { getPatientHistory, getPatientConsultations, getPatientReports } from '../../services/patientService';
import { Shield, Pill, AlertTriangle, Clock, FileText, Stethoscope } from 'lucide-react';

export default function PatientOverview({ patient }) {
  const [history, setHistory] = useState(null);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [patient.id]);

  const loadData = async () => {
    try {
      const [h, c, r] = await Promise.all([
        getPatientHistory(patient.id),
        getPatientConsultations(patient.id),
        getPatientReports(patient.id),
      ]);
      setHistory(h);
      setRecentConsultations(c.slice(0, 3));
      setRecentReports(r.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Shield size={16} /> Basic Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-400 font-semibold">Patient ID</p>
            <p className="text-sm font-bold text-gray-900">{patient.id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold">ABHA ID</p>
            <p className="text-sm font-bold text-gray-900 font-mono">{patient.abhaId}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold">Age / Gender</p>
            <p className="text-sm font-bold text-gray-900">{patient.age} / {patient.gender}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold">Blood Group</p>
            <p className="text-sm font-bold text-gray-900">{patient.bloodGroup}</p>
          </div>
        </div>
      </div>

      {/* Known Conditions & Medications */}
      {history && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertTriangle size={16} /> Known Conditions
            </h3>
            <div className="flex flex-wrap gap-2">
              {history.knownConditions.map((condition, i) => (
                <span key={i} className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-100">
                  {condition}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Pill size={16} /> Current Medications
            </h3>
            <div className="flex flex-wrap gap-2">
              {history.currentMedications.map((med, i) => (
                <span key={i} className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-purple-100 flex items-center gap-1">
                  <Pill size={10} /> {med}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Allergies */}
      {history && history.allergies.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-extrabold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertTriangle size={16} /> Allergies
          </h3>
          <div className="flex flex-wrap gap-2">
            {history.allergies.map((allergy, i) => (
              <span key={i} className="bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-100">
                ⚠ {allergy}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Consultations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Stethoscope size={16} /> Recent Consultations
          </h3>
          {recentConsultations.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No consultations yet</p>
          ) : (
            <div className="space-y-3">
              {recentConsultations.map((c) => (
                <div key={c.consultationId} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-gray-900">{c.doctorName}</p>
                    <p className="text-[10px] font-semibold text-gray-400">{c.date}</p>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{c.symptoms}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <FileText size={16} /> Recent Reports
          </h3>
          {recentReports.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No reports uploaded yet</p>
          ) : (
            <div className="space-y-3">
              {recentReports.map((r) => (
                <div key={r.reportId} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-gray-900">{r.title}</p>
                    <p className="text-[10px] font-semibold text-gray-400">{r.date}</p>
                  </div>
                  <p className="text-xs text-gray-500">{r.type} • {r.source}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Last Doctor Visit */}
      {history && history.lastDoctorVisit && (
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-sm font-extrabold text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Clock size={16} /> Last Doctor Visit
          </h3>
          <p className="text-lg font-bold text-gray-900">{history.lastDoctorName}</p>
          <p className="text-sm text-gray-500">{history.lastDoctorVisit}</p>
        </div>
      )}
    </div>
  );
}
