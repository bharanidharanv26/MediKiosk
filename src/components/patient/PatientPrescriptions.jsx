import React, { useState, useEffect } from 'react';
import { getPatientPrescriptions } from '../../services/patientService';
import { Pill, Clock, Stethoscope } from 'lucide-react';

export default function PatientPrescriptions({ patientId }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      const data = await getPatientPrescriptions(patientId);
      setPrescriptions(data);
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

  if (prescriptions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <Pill size={48} className="text-gray-200 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-400 mb-2">No prescriptions yet</h3>
        <p className="text-sm text-gray-300">Your prescriptions will appear here after consultations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
        <Pill size={20} className="text-blue-600" /> Prescription History
      </h3>

      <div className="space-y-4">
        {prescriptions.map((presc) => (
          <div key={presc.consultationId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-900">{presc.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 flex items-center gap-1">
                  <Stethoscope size={10} /> {presc.doctorName}
                </span>
                <span className="text-xs font-semibold text-gray-500">{presc.specialization}</span>
              </div>
            </div>

            {/* Medicines */}
            <div className="space-y-3">
              {presc.prescription.map((med, i) => (
                <div key={i} className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{med.medicine}</p>
                      <p className="text-xs text-gray-500 mt-1">{med.dosage}</p>
                    </div>
                    <span className="text-xs font-bold text-purple-600 bg-white px-2 py-1 rounded-lg border border-purple-200">
                      {med.frequency}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <span>Duration: {med.duration}</span>
                    {med.instructions && <span className="italic">"{med.instructions}"</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            {presc.notes && (
              <div className="mt-4 bg-blue-50 rounded-xl p-3 border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Doctor Notes</p>
                <p className="text-sm text-gray-600">{presc.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
