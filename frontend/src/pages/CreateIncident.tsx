import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateIncident } from '../hooks/useIncidents';
import { 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  MapPin, 
  Paperclip, 
  ShieldAlert, 
  Trash2, 
  UploadCloud 
} from 'lucide-react';

const SEVERITY_OPTIONS = [
  { id: 'LOW', label: 'Low', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100', active: 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300' },
  { id: 'MEDIUM', label: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100', active: 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-300' },
  { id: 'HIGH', label: 'High', color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100', active: 'bg-orange-600 text-white border-orange-600 shadow-md ring-2 ring-orange-300' },
  { id: 'CRITICAL', label: 'Critical', color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100', active: 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300' },
];

const CATEGORIES = [
  'Medication Error',
  'Patient Fall',
  'Equipment / Device Failure',
  'Infection Control',
  'Surgical / Procedural',
  'Staff Safety / Injury',
  'Documentation / Communication',
  'Facility / Environmental Hazard',
  'Other',
];

const DEPARTMENTS = [
  { id: 1, name: 'Intensive Care Unit (ICU)' },
  { id: 2, name: 'Emergency Department (ED)' },
  { id: 3, name: 'Surgery & Operating Theatres' },
  { id: 4, name: 'General Pediatrics' },
  { id: 5, name: 'Cardiology' },
];

export const CreateIncident: React.FC = () => {
  const navigate = useNavigate();
  const createIncidentMutation = useCreateIncident();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('LOW');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [departmentId, setDepartmentId] = useState<number>(1);
  const [files, setFiles] = useState<File[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successCreatedId, setSuccessCreatedId] = useState<number | null>(null);

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    if (files.length + selectedFiles.length > 5) {
      setErrorMsg('You can upload a maximum of 5 evidence files.');
      return;
    }

    const invalidType = selectedFiles.find(
      (f) => !['image/jpeg', 'image/png', 'application/pdf'].includes(f.type)
    );
    if (invalidType) {
      setErrorMsg('Only JPG, PNG, and PDF files are allowed as evidence.');
      return;
    }

    setErrorMsg(null);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Frontend Validations
    if (!title.trim() || title.length < 5) {
      setErrorMsg('Title must be at least 5 characters long.');
      return;
    }
    if (!description.trim() || description.length < 10) {
      setErrorMsg('Description must be at least 10 characters long.');
      return;
    }
    if (!category) {
      setErrorMsg('Please select a valid incident category.');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Please enter the location where the incident occurred.');
      return;
    }

    // Build FormData
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('severity', severity);
    formData.append('category', category);
    formData.append('location', location);
    formData.append('departmentId', String(departmentId));

    files.forEach((file) => {
      formData.append('evidence', file);
    });

    try {
      const created = await createIncidentMutation.mutateAsync(formData);
      setSuccessCreatedId(created.id);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit incident report.';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Staff Portal</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 p-6 sm:p-8 text-white">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
                <ShieldAlert className="w-8 h-8 text-teal-300" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Report Safety Incident</h1>
                <p className="text-teal-100 text-sm mt-1">Submit a confidential hospital safety incident report to your department manager.</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            {/* Error Alert */}
            {errorMsg && (
              <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Submission Error</h4>
                  <p className="mt-0.5 text-rose-700">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Incident Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-800 mb-2">
                Incident Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Patient near-miss medication discrepancy in ICU Bay 4"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 placeholder:text-slate-400 text-sm transition-all"
                required
              />
            </div>

            {/* Severity & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-800 mb-2">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 text-sm transition-all bg-white"
                  required
                >
                  <option value="">-- Select Category --</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label htmlFor="department" className="block text-sm font-semibold text-slate-800 mb-2">
                  Target Department <span className="text-rose-500">*</span>
                </label>
                <select
                  id="department"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 text-sm transition-all bg-white"
                  required
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Severity Pill Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Severity Level <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SEVERITY_OPTIONS.map((opt) => {
                  const isSelected = severity === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSeverity(opt.id as any)}
                      className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isSelected ? opt.active : opt.color
                      }`}
                    >
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-slate-800 mb-2">
                Exact Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., ICU 2nd Floor, Room 204 or Medication Room A"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 placeholder:text-slate-400 text-sm transition-all"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-800 mb-2">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened, clinical context, immediate actions taken, and individuals involved..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 placeholder:text-slate-400 text-sm transition-all"
                required
              ></textarea>
            </div>

            {/* Evidence Attachments Upload Zone */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Evidence & Attachments <span className="text-xs font-normal text-slate-500">(Optional, Max 5 files - JPG, PNG, PDF)</span>
              </label>
              
              <div className="border-2 border-dashed border-slate-300 hover:border-teal-500 transition-colors rounded-2xl p-6 text-center bg-slate-50/50 relative cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-10 h-10 text-teal-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">
                  <span className="text-teal-600 font-semibold underline">Click to upload</span> or drag and drop evidence files
                </p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG or PDF up to 5MB each</p>
              </div>

              {/* Uploaded File Previews */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Selected Files ({files.length}/5):</h4>
                  <div className="space-y-2">
                    {files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-slate-100/80 rounded-xl text-sm border border-slate-200"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <Paperclip className="w-4 h-4 text-teal-600 shrink-0" />
                          <span className="font-medium text-slate-800 truncate">{file.name}</span>
                          <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={createIncidentMutation.isPending}
                className="px-8 py-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 rounded-xl shadow-lg shadow-teal-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                {createIncidentMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Submit Incident Report</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>

      {/* Success Modal */}
      {successCreatedId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-slate-100">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Incident Reported!</h3>
            <p className="text-slate-600 text-sm mt-2">
              Incident <span className="font-bold text-slate-900">#{successCreatedId}</span> has been successfully logged into the system and sent to the department manager for review.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setSuccessCreatedId(null);
                  setTitle('');
                  setDescription('');
                  setLocation('');
                  setCategory('');
                  setFiles([]);
                }}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Report Another
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 px-4 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
