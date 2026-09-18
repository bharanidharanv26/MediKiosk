import React, { useState } from 'react';
import { addReport } from '../../services/patientService';
import CameraScanner from '../common/CameraScanner';
import {
  Camera, Upload, FileText, ArrowLeft, CheckCircle, AlertCircle
} from 'lucide-react';

const recordTypes = [
  'Blood Test', 'X-Ray', 'MRI', 'CT Scan', 'Prescription',
  'Discharge Summary', 'Doctor Report', 'Other'
];

export default function AddRecord({ patientId, onRecordAdded }) {
  const [mode, setMode] = useState(null); // 'scan', 'upload', 'manual'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Manual form state
  const [formData, setFormData] = useState({
    type: 'Blood Test',
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    doctorName: '',
    hospital: '',
  });

  const handleScanComplete = async (extractedText, imageDataUrl) => {
    setLoading(true);
    try {
      const report = {
        reportId: `REP-${Date.now()}`,
        patientId,
        title: 'Scanned Report',
        type: 'Other',
        date: new Date().toISOString().split('T')[0],
        uploadedAt: new Date().toISOString(),
        source: 'Scanned Report',
        description: 'Report scanned via camera',
        extractedText,
        image: imageDataUrl,
      };
      await addReport(report);
      setSuccess(true);
      setTimeout(() => onRecordAdded(), 1500);
    } catch (err) {
      alert('Failed to save report');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      // Read file as data URL for preview
      const reader = new FileReader();
      reader.onload = async () => {
        const report = {
          reportId: `REP-${Date.now()}`,
          patientId,
          title: file.name.replace(/\.[^/.]+$/, ''),
          type: 'Other',
          date: new Date().toISOString().split('T')[0],
          uploadedAt: new Date().toISOString(),
          source: 'Uploaded Report',
          description: `File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
          extractedText: '',
          image: file.type.startsWith('image/') ? reader.result : null,
        };
        await addReport(report);
        setSuccess(true);
        setTimeout(() => onRecordAdded(), 1500);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert('Failed to upload file');
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    try {
      const report = {
        reportId: `REP-${Date.now()}`,
        patientId,
        title: formData.title,
        type: formData.type,
        date: formData.date,
        uploadedAt: new Date().toISOString(),
        source: 'Manual Entry',
        description: formData.description,
        extractedText: formData.description,
        doctorName: formData.doctorName,
        hospital: formData.hospital,
        image: null,
      };
      await addReport(report);
      setSuccess(true);
      setTimeout(() => onRecordAdded(), 1500);
    } catch (err) {
      alert('Failed to save record');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h3 className="text-xl font-extrabold text-gray-900 mb-2">Record Saved!</h3>
        <p className="text-sm text-gray-500">Your medical record has been added successfully.</p>
      </div>
    );
  }

  if (mode === 'scan') {
    return (
      <CameraScanner
        onCapture={handleScanComplete}
        onCancel={() => setMode(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
        <FileText size={20} className="text-blue-600" /> Add Medical Record
      </h3>

      {!mode ? (
        /* Mode Selection */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setMode('scan')}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <div className="w-16 h-16 bg-blue-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
              <Camera size={28} className="text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Scan Report</h4>
            <p className="text-xs text-gray-500">Use your camera to scan a medical document</p>
          </button>

          <button
            onClick={() => setMode('upload')}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md hover:border-teal-200 transition-all group"
          >
            <div className="w-16 h-16 bg-teal-50 group-hover:bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
              <Upload size={28} className="text-teal-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Upload Report</h4>
            <p className="text-xs text-gray-500">Upload a PDF, JPG, or PNG file</p>
          </button>

          <button
            onClick={() => setMode('manual')}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md hover:border-emerald-200 transition-all group"
          >
            <div className="w-16 h-16 bg-emerald-50 group-hover:bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
              <FileText size={28} className="text-emerald-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Add Manually</h4>
            <p className="text-xs text-gray-500">Enter report details manually</p>
          </button>
        </div>
      ) : mode === 'upload' ? (
        /* Upload Mode */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <button
            onClick={() => setMode(null)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-blue-300 transition-colors">
            <Upload size={48} className="text-gray-300 mx-auto mb-4" />
            <h4 className="font-bold text-gray-700 mb-2">Upload Medical Report</h4>
            <p className="text-sm text-gray-400 mb-6">Supports PDF, JPG, JPEG, PNG files</p>
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 cursor-pointer transition-colors">
              <Upload size={16} /> Choose File
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>

          {loading && (
            <div className="mt-4 flex items-center justify-center gap-3 text-sm text-gray-500">
              <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
              Processing file...
            </div>
          )}
        </div>
      ) : (
        /* Manual Entry Mode */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <button
            onClick={() => setMode(null)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Record Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                >
                  {recordTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                  placeholder="e.g., Complete Blood Count"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Doctor Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                  placeholder="Dr. Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Hospital / Clinic (Optional)
              </label>
              <input
                type="text"
                value={formData.hospital}
                onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                placeholder="Hospital or clinic name"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Description / Report Details
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="w-full p-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all resize-none"
                placeholder="Enter report details, test results, or findings..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="w-full py-4 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle size={18} /> Save Record
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
