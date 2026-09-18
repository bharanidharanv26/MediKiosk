import React, { useState, useEffect } from 'react';
import {
  getPatientHistory,
  getPatientConsultations,
  getPatientReports,
  getPatientPrescriptions,
} from '../../services/patientService';
import { getPreviousProviders } from '../../services/doctorService';
import { addConsultation } from '../../services/patientService';
import Toast from '../common/Toast';
import {
  ArrowLeft, FileText, Stethoscope, Pill, Clock, AlertTriangle,
  Activity, Heart, Search, CheckCircle, Save
} from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview', icon: Heart },
  { id: 'history', label: 'Medical History', icon: FileText },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'consultations', label: 'Consultations', icon: Stethoscope },
  { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
  { id: 'current', label: 'Current Visit', icon: Stethoscope },
];

export default function DoctorPatientRecord({ patient, doctor, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [history, setHistory] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Current consultation form state
  const [consultationForm, setConsultationForm] = useState({
    symptoms: '',
    assessment: '',
    diagnosis: '',
    treatment: '',
    prescriptionText: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [consultationSaved, setConsultationSaved] = useState(false);

  useEffect(() => {
    loadPatientData();
  }, [patient.id]);

  const loadPatientData = async () => {
    try {
      const [h, c, r, p, prov] = await Promise.all([
        getPatientHistory(patient.id),
        getPatientConsultations(patient.id),
        getPatientReports(patient.id),
        getPatientPrescriptions(patient.id),
        getPreviousProviders(patient.id),
      ]);
      setHistory(h);
      setConsultations(c);
      setReports(r);
      setPrescriptions(p);
      setProviders(prov);
    } catch (err) {
      setToast({ message: 'Failed to load patient data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConsultation = async () => {
    if (!consultationForm.symptoms.trim()) {
      setToast({ message: 'Please enter symptoms', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const newConsultation = {
        consultationId: `CONS-${Date.now()}`,
        patientId: patient.id,
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialization: doctor.specialization,
        date: new Date().toISOString().split('T')[0],
        symptoms: consultationForm.symptoms,
        assessment: consultationForm.assessment,
        diagnosis: consultationForm.diagnosis,
        treatment: consultationForm.treatment,
        prescription: consultationForm.prescriptionText
          ? [{ medicine: consultationForm.prescriptionText, dosage: 'As prescribed', frequency: 'As directed', duration: 'As needed', instructions: '' }]
          : [],
        notes: consultationForm.notes,
        status: 'completed',
        createdAt: new Date().toISOString(),
      };

      await addConsultation(newConsultation);
      setConsultationSaved(true);
      setToast({ message: 'Consultation saved successfully!', type: 'success' });

      // Reload data to show new consultation
      await loadPatientData();
    } catch (err) {
      setToast({ message: 'Failed to save consultation', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">Loading patient record...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Search
      </button>

      {/* Patient Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl">
            {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-extrabold text-gray-900">
              {patient.name}
              <span className="text-base text-gray-500 font-normal ml-2">
                ({patient.age} y/o, {patient.gender})
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                {patient.id}
              </span>
              <span className="text-xs font-semibold text-gray-500 font-mono">
                {patient.abhaId}
              </span>
              <span className="text-xs font-semibold text-gray-400">
                Blood: {patient.bloodGroup}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Bar */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            {consultations.length} previous consultations
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <span className="w-2 h-2 bg-teal-500 rounded-full" />
            {reports.length} uploaded reports
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <span className="w-2 h-2 bg-purple-500 rounded-full" />
            {prescriptions.length} prescriptions
          </div>
          {providers.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="w-2 h-2 bg-amber-500 rounded-full" />
              {providers.length} previous doctors
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600 bg-teal-50/50'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Info */}
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

              {/* Known Conditions */}
              {history && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                      <AlertTriangle size={12} /> Known Conditions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {history.knownConditions.map((c, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-100">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                      <Pill size={12} /> Current Medications
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {history.currentMedications.map((m, i) => (
                        <span key={i} className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-purple-100">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Allergies */}
              {history && history.allergies.length > 0 && (
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <AlertTriangle size={12} /> Allergies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {history.allergies.map((a, i) => (
                      <span key={i} className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                        ⚠ {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Previous Healthcare Providers */}
              {providers.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                    <Stethoscope size={12} /> Previous Healthcare Providers
                  </p>
                  <div className="space-y-2">
                    {providers.map((prov, i) => (
                      <div key={i} className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-100">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{prov.doctorName}</p>
                          <p className="text-xs text-gray-500">{prov.specialization}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-gray-500">Last visit: {prov.lastConsultationDate}</p>
                          <p className="text-[10px] text-gray-400">{prov.consultationCount} consultation(s)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Consultation */}
              {consultations.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Clock size={12} /> Most Recent Consultation
                  </p>
                  <p className="text-sm font-bold text-gray-900">{consultations[0].doctorName} - {consultations[0].date}</p>
                  <p className="text-xs text-gray-600 mt-1">{consultations[0].symptoms}</p>
                </div>
              )}
            </div>
          )}

          {/* Medical History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {consultations.length === 0 ? (
                <div className="text-center py-12">
                  <FileText size={48} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-semibold">No medical history available</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                  {consultations.map((c) => (
                    <div key={c.consultationId} className="relative pl-16 pb-8">
                      <div className="absolute left-4 top-2 w-5 h-5 rounded-full bg-teal-600 border-4 border-white shadow-md z-10" />
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-gray-400" />
                            <span className="text-sm font-bold text-gray-900">{c.date}</span>
                          </div>
                          <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100 flex items-center gap-1">
                            <Stethoscope size={10} /> {c.doctorName}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{c.specialization}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                            <p className="text-[10px] font-bold text-amber-600 uppercase">Symptoms</p>
                            <p className="text-xs text-gray-700 mt-1">{c.symptoms}</p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                            <p className="text-[10px] font-bold text-blue-600 uppercase">Assessment</p>
                            <p className="text-xs text-gray-700 mt-1">{c.assessment}</p>
                          </div>
                        </div>
                        {c.notes && (
                          <div className="mt-3 bg-white rounded-lg p-3 border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-500 uppercase">Doctor Notes</p>
                            <p className="text-xs text-gray-600 mt-1">{c.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              {reports.length === 0 ? (
                <div className="text-center py-12">
                  <FileText size={48} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-semibold">No reports uploaded</p>
                </div>
              ) : (
                reports.map((report) => (
                  <ReportCard key={report.reportId} report={report} />
                ))
              )}
            </div>
          )}

          {/* Consultations Tab */}
          {activeTab === 'consultations' && (
            <div className="space-y-4">
              {consultations.length === 0 ? (
                <div className="text-center py-12">
                  <Stethoscope size={48} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-semibold">No consultations recorded</p>
                </div>
              ) : (
                consultations.map((c) => (
                  <div key={c.consultationId} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <span className="text-sm font-bold text-gray-900">{c.date}</span>
                      <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                        {c.doctorName} - {c.specialization}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2"><strong>Symptoms:</strong> {c.symptoms}</p>
                    <p className="text-xs text-gray-600 mb-2"><strong>Assessment:</strong> {c.assessment}</p>
                    <p className="text-xs text-gray-600"><strong>Treatment:</strong> {c.treatment}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Prescriptions Tab */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              {prescriptions.length === 0 ? (
                <div className="text-center py-12">
                  <Pill size={48} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-semibold">No prescriptions recorded</p>
                </div>
              ) : (
                prescriptions.map((presc) => (
                  <div key={presc.consultationId} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <span className="text-sm font-bold text-gray-900">{presc.date}</span>
                      <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                        {presc.doctorName}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {presc.prescription.map((med, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 border border-gray-100">
                          <p className="text-sm font-bold text-gray-900">{med.medicine}</p>
                          <p className="text-xs text-gray-500">{med.dosage} • {med.frequency} • {med.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Current Visit Tab */}
          {activeTab === 'current' && (
            <div className="space-y-6">
              {consultationSaved ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-2">Consultation Saved!</h3>
                  <p className="text-sm text-gray-500 mb-6">The patient's medical history has been updated.</p>
                  <button
                    onClick={() => {
                      setConsultationSaved(false);
                      setConsultationForm({
                        symptoms: '',
                        assessment: '',
                        diagnosis: '',
                        treatment: '',
                        prescriptionText: '',
                        notes: '',
                      });
                    }}
                    className="px-6 py-3 font-bold bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                  >
                    Start New Consultation
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                    <p className="text-sm font-bold text-teal-700 flex items-center gap-2">
                      <Stethoscope size={16} /> New Consultation for {patient.name}
                    </p>
                    <p className="text-xs text-teal-600 mt-1">
                      Fill in the consultation details below. This will be saved to the patient's medical record.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Current Symptoms *
                      </label>
                      <textarea
                        value={consultationForm.symptoms}
                        onChange={(e) => setConsultationForm({ ...consultationForm, symptoms: e.target.value })}
                        rows={3}
                        className="w-full p-4 rounded-xl border-2 border-gray-200 text-sm font-medium focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-50 resize-none transition-all"
                        placeholder="Describe the patient's current symptoms..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Clinical Assessment
                      </label>
                      <textarea
                        value={consultationForm.assessment}
                        onChange={(e) => setConsultationForm({ ...consultationForm, assessment: e.target.value })}
                        rows={3}
                        className="w-full p-4 rounded-xl border-2 border-gray-200 text-sm font-medium focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-50 resize-none transition-all"
                        placeholder="Clinical findings and assessment..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Diagnosis / Impression
                      </label>
                      <textarea
                        value={consultationForm.diagnosis}
                        onChange={(e) => setConsultationForm({ ...consultationForm, diagnosis: e.target.value })}
                        rows={2}
                        className="w-full p-4 rounded-xl border-2 border-gray-200 text-sm font-medium focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-50 resize-none transition-all"
                        placeholder="Diagnosis or clinical impression..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Treatment
                      </label>
                      <textarea
                        value={consultationForm.treatment}
                        onChange={(e) => setConsultationForm({ ...consultationForm, treatment: e.target.value })}
                        rows={2}
                        className="w-full p-4 rounded-xl border-2 border-gray-200 text-sm font-medium focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-50 resize-none transition-all"
                        placeholder="Treatment plan..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Prescription
                      </label>
                      <textarea
                        value={consultationForm.prescriptionText}
                        onChange={(e) => setConsultationForm({ ...consultationForm, prescriptionText: e.target.value })}
                        rows={3}
                        className="w-full p-4 rounded-xl border-2 border-gray-200 text-sm font-medium focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-50 resize-none transition-all"
                        placeholder="Medicine name, dosage, frequency, duration..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Doctor Notes
                      </label>
                      <textarea
                        value={consultationForm.notes}
                        onChange={(e) => setConsultationForm({ ...consultationForm, notes: e.target.value })}
                        rows={3}
                        className="w-full p-4 rounded-xl border-2 border-gray-200 text-sm font-medium focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-50 resize-none transition-all"
                        placeholder="Additional notes, follow-up instructions..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={onBack}
                      className="px-6 py-3 font-bold text-gray-500 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveConsultation}
                      disabled={saving || !consultationForm.symptoms.trim()}
                      className="px-8 py-3 font-bold bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-all shadow-lg flex items-center gap-2"
                    >
                      {saving ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Save size={18} /> Save Consultation
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Report Card Sub-component
function ReportCard({ report }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="font-bold text-gray-900">{report.title}</h4>
          <p className="text-xs text-gray-500">{report.type} • {report.date}</p>
        </div>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
          {report.source}
        </span>
      </div>

      {report.description && (
        <p className="text-xs text-gray-600 mb-3">{report.description}</p>
      )}

      {report.extractedText && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
          >
            <Search size={12} /> {expanded ? 'Hide' : 'View'} Extracted Text
          </button>
          {expanded && (
            <pre className="mt-3 text-xs text-gray-700 whitespace-pre-wrap font-mono bg-white p-4 rounded-lg border border-gray-100 max-h-60 overflow-y-auto leading-relaxed">
              {report.extractedText}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
