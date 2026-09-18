import React, { useState, useEffect } from 'react';
import { getPatientReports } from '../../services/patientService';
import { FileText, Eye, Download, Search } from 'lucide-react';

export default function PatientReports({ patientId }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      const data = await getPatientReports(patientId);
      setReports(data);
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

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <FileText size={48} className="text-gray-200 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-400 mb-2">No reports uploaded yet</h3>
        <p className="text-sm text-gray-300">Upload or scan your medical reports to view them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
        <FileText size={20} className="text-blue-600" /> Medical Reports
      </h3>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div
            key={report.reportId}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedReport(report)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-gray-900">{report.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{report.type}</p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                {report.source}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{report.date}</span>
              <span>Uploaded: {new Date(report.uploadedAt).toLocaleDateString()}</span>
            </div>
            {report.description && (
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{report.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold">{selectedReport.title}</h3>
                  <p className="text-blue-100 text-sm font-medium mt-1">{selectedReport.type} • {selectedReport.date}</p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold text-gray-500">Source:</span>
                  <span className="font-bold text-gray-900">{selectedReport.source}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold text-gray-500">Uploaded:</span>
                  <span className="font-bold text-gray-900">{new Date(selectedReport.uploadedAt).toLocaleString()}</span>
                </div>
                {selectedReport.description && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</p>
                    <p className="text-sm text-gray-700">{selectedReport.description}</p>
                  </div>
                )}

                {/* Extracted Text */}
                {selectedReport.extractedText && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-1">
                      <Search size={10} /> Extracted Text (OCR)
                    </p>
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                      {selectedReport.extractedText}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-5 py-2.5 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
