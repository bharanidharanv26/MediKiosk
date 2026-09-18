import React, { useState } from 'react';
import { searchPatients } from '../../services/patientService';
import { Search, User, ArrowRight } from 'lucide-react';
import Toast from '../common/Toast';

export default function DoctorSearch({ onSelectPatient }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const data = await searchPatients(query);
      setResults(data);
      if (data.length === 0) {
        setToast({ message: 'No patients found matching your search', type: 'info' });
      }
    } catch (err) {
      setToast({ message: 'Search failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
        <Search size={20} className="text-teal-600" /> Patient Search
      </h3>

      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Search by Patient ID, ABHA ID, or Name
            </label>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 p-4 border-2 border-gray-200 rounded-xl font-medium text-lg focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50 transition-all"
                placeholder="e.g., ABHA-1234-5678-9012 or PAT-1001 or Arjun"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-8 py-3 font-bold bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-all shadow-lg flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search size={16} /> Search Patient
                </>
              )}
            </button>
            <p className="text-xs text-gray-400 font-medium">
              Search by Patient ID, ABHA ID, or patient name
            </p>
          </div>
        </form>

        {/* Demo hints */}
        <div className="mt-4 bg-teal-50 rounded-xl p-4 border border-teal-100">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">Quick Search</p>
          <div className="flex flex-wrap gap-2">
            {['ABHA-1234-5678-9012', 'PAT-1001', 'Arjun Sharma', 'Priya Kumar'].map((hint) => (
              <button
                key={hint}
                onClick={() => {
                  setQuery(hint);
                }}
                className="text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-teal-200 text-teal-700 hover:bg-teal-100 transition-colors"
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searched && (
        <div className="space-y-4">
          <h4 className="text-sm font-extrabold text-gray-500 uppercase tracking-widest">
            Search Results ({results.length})
          </h4>

          {results.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <User size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-400 mb-2">No patients found</h3>
              <p className="text-sm text-gray-300">Try searching with a different ID or name</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((patient) => (
                <div
                  key={patient.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg">
                        {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{patient.name}</h4>
                        <div className="flex flex-wrap items-center gap-3 mt-1">
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                            {patient.id}
                          </span>
                          <span className="text-xs font-semibold text-gray-500 font-mono">
                            {patient.abhaId}
                          </span>
                          <span className="text-xs font-semibold text-gray-400">
                            {patient.age} y/o • {patient.gender}
                          </span>
                          <span className="text-xs font-semibold text-gray-400">
                            Blood: {patient.bloodGroup}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectPatient(patient)}
                      className="px-6 py-3 font-bold bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-md flex items-center gap-2 transition-all"
                    >
                      View Record <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
