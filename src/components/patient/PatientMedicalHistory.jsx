import React, { useState, useEffect } from 'react';
import { getPatientConsultations } from '../../services/patientService';
import { Clock, Stethoscope, FileText, Pill } from 'lucide-react';

export default function PatientMedicalHistory({ patientId }) {
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
        <FileText size={48} className="text-gray-200 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-400 mb-2">No medical records yet</h3>
        <p className="text-sm text-gray-300">Your consultation history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
        <FileText size={20} className="text-blue-600" /> Medical History
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        {consultations.map((c, index) => (
          <div key={c.consultationId} className="relative pl-16 pb-8">
            {/* Timeline dot */}
            <div className="absolute left-4 top-2 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-md z-10" />

            {/* Consultation Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {/* Date Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-sm font-bold text-gray-900">{c.date}</span>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 flex items-center gap-1">
                  <Stethoscope size={10} /> {c.doctorName}
                </span>
              </div>

              {/* Doctor Info */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Doctor</p>
                <p className="text-sm font-bold text-gray-900">{c.doctorName}</p>
                <p className="text-xs text-gray-500">{c.specialization}</p>
              </div>

              {/* Symptoms */}
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Symptoms</p>
                <p className="text-sm text-gray-700 bg-amber-50 p-3 rounded-xl border border-amber-100">
                  {c.symptoms}
                </p>
              </div>

              {/* Assessment */}
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Assessment</p>
                <p className="text-sm text-gray-700">{c.assessment}</p>
              </div>

              {/* Treatment */}
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Treatment</p>
                <p className="text-sm text-gray-700">{c.treatment}</p>
              </div>

              {/* Prescription */}
              {c.prescription && c.prescription.length > 0 && (
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Pill size={10} /> Prescription
                  </p>
                  <div className="space-y-2">
                    {c.prescription.map((p, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="font-bold text-purple-700">{p.medicine}</span>
                        <span className="text-gray-500">-</span>
                        <span className="text-gray-600">{p.dosage}, {p.frequency}, {p.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {c.notes && (
                <div className="mt-4 bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Doctor Notes</p>
                  <p className="text-sm text-gray-600">{c.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
