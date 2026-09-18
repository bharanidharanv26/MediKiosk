import React, { useState, useEffect } from 'react';
import { getPatientConsultations } from '../../services/patientService';
import { Stethoscope, Clock, FileText } from 'lucide-react';

export default function PatientConsultations({ patientId }) {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      const data = await getPatientConsultations(patientId);
      setConsultations(data);
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

  if (consultations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <Stethoscope size={48} className="text-gray-200 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-400 mb-2">No consultations yet</h3>
        <p className="text-sm text-gray-300">Your consultation history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
        <Stethoscope size={20} className="text-blue-600" /> Consultation History
      </h3>

      <div className="space-y-4">
        {consultations.map((c) => (
          <div key={c.consultationId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-900">{c.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 flex items-center gap-1">
                  <Stethoscope size={10} /> {c.doctorName}
                </span>
                <span className="text-xs font-semibold text-gray-500">{c.specialization}</span>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Symptoms</p>
                <p className="text-sm text-gray-700">{c.symptoms}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Assessment</p>
                <p className="text-sm text-gray-700">{c.assessment}</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Treatment</p>
                <p className="text-sm text-gray-700">{c.treatment}</p>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">Prescription</p>
                {c.prescription && c.prescription.length > 0 ? (
                  <div className="space-y-1">
                    {c.prescription.map((p, i) => (
                      <p key={i} className="text-xs text-gray-700">
                        <span className="font-bold">{p.medicine}</span> - {p.dosage}, {p.frequency}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No prescription</p>
                )}
              </div>
            </div>

            {/* Notes */}
            {c.notes && (
              <div className="mt-4 bg-teal-50 rounded-xl p-4 border border-teal-100">
                <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <FileText size={10} /> Doctor Notes
                </p>
                <p className="text-sm text-gray-600">{c.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
