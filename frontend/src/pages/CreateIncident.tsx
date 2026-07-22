import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateIncident } from '../hooks/useIncidents';
import { 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  Info, 
  MapPin, 
  Paperclip, 
  Trash2, 
  Upload 
} from 'lucide-react';

const SEVERITY_LEVELS = [
  {
    id: 'LOW',
    label: 'Low',
    desc: 'Minor incident / Near miss with no harm',
    dot: 'bg-emerald-500',
    borderActive: 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500',
  },
  {
    id: 'MEDIUM',
    label: 'Medium',
    desc: 'Moderate incident requiring minor intervention',
    dot: 'bg-amber-500',
    borderActive: 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500',
  },
  {
    id: 'HIGH',
    label: 'High',
    desc: 'Severe event causing significant harm or delay',
    dot: 'bg-orange-500',
    borderActive: 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500',
  },
  {
    id: 'CRITICAL',
    label: 'Critical',
    desc: 'Sentinel event / Critical patient safety risk',
    dot: 'bg-rose-600 animate-pulse',
    borderActive: 'border-rose-600 bg-rose-50/50 ring-1 ring-rose-600',
  },
];

const CATEGORIES = [
  'Medication Error / Discrepancy',
  'Patient Fall or Injury',
  'Equipment & Medical Device Failure',
  'Infection Control Incident',
  'Surgical / Procedural Complication',
  'Staff Safety & Physical Hazard',
  'Communication & Clinical Handover',
  'Environmental & Facility Safety',
  'Other Safety Event',
];

const DEPARTMENTS = [
  { id: 1, name: 'Intensive Care Unit (ICU)' },
  { id: 2, name: 'Emergency Department (ED)' },
  { id: 3, name: 'Surgery & Operating Theatres' },
  { id: 4, name: 'General Pediatrics' },
  { id: 5, name: 'Cardiology & Vascular' },
];

export const CreateIncident: React.FC = () => {
  const navigate = useNavigate();
  const createIncidentMutation = useCreateIncident();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('LOW');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [departmentId, setDepartmentId] = useState<number>(1);
  const [files, setFiles] = useState<File[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successCreatedId, setSuccessCreatedId] = useState<number | null>(null);

  // Handle File Input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    if (files.length + selectedFiles.length > 5) {
      setErrorMsg('Maximum 5 evidence files permitted per incident report.');
      return;
    }

    const invalid = selectedFiles.find(
      (f) => !['image/jpeg', 'image/png', 'application/pdf'].includes(f.type)
    );
    if (invalid) {
      setErrorMsg('Accepted file types: JPG, PNG, and PDF only.');
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

    if (!title.trim() || title.length < 5) {
      setErrorMsg('Incident summary title must be at least 5 characters.');
      return;
    }
    if (!category) {
      setErrorMsg('Please select an incident category.');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Please specify the exact location of occurrence.');
      return;
    }
    if (!description.trim() || description.length < 10) {
      setErrorMsg('Clinical description must be at least 10 characters.');
      return;
    }

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
      const msg = err.response?.data?.message || err.message || 'Failed to record incident report.';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased">
      
      {/* Top Application Header Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-teal-500 text-slate-900 flex items-center justify-center font-bold text-xs tracking-wider">
              KH
            </div>
            <span className="font-semibold text-sm tracking-wide text-slate-100">KAIROS HIMS</span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">Clinical Safety & Risk Management</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-300">
            <span className="hidden md:inline-block px-2.5 py-1 bg-slate-800 rounded border border-slate-700 font-mono">
              ROLE: STAFF REPORTING
            </span>
            <button
              onClick={() => navigate('/')}
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <span className="hover:underline cursor-pointer" onClick={() => navigate('/')}>Dashboard</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span>Incident Reporting</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-slate-700">New Safety Event</span>
        </nav>

        {/* Page Title & Context Header */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-slate-900">Log New Incident Report</h1>
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 text-xs font-mono rounded">
                FORM-INC-01
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Submit confidential safety event details to the designated department manager for review & audit.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200 shrink-0">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>All reports are logged with mandatory audit trail timestamps.</span>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Error Notice */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 border-l-4 border-rose-600 rounded-r text-rose-900 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Unable to submit report:</strong>
                <p className="mt-0.5 text-rose-700">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Section 1: General Event Info */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">1. General Event Information</h2>
              <span className="text-xs text-slate-400">* Required fields</span>
            </div>

            <div className="p-6 space-y-5">
              
              {/* Incident Title */}
              <div>
                <label htmlFor="title" className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Incident Summary Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Near-miss medication dosage variance in ICU Bay 3"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 text-slate-900 placeholder:text-slate-400 transition-colors"
                  required
                />
              </div>

              {/* Category & Department Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div>
                  <label htmlFor="category" className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Event Classification / Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 text-slate-900 transition-colors"
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

                <div>
                  <label htmlFor="department" className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Target Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="department"
                    value={departmentId}
                    onChange={(e) => setDepartmentId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 text-slate-900 transition-colors"
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

            </div>
          </div>

          {/* Section 2: Clinical Severity & Location */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">2. Risk Assessment & Location</h2>
            </div>

            <div className="p-6 space-y-5">
              
              {/* Severity Cards */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Severity Rating <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {SEVERITY_LEVELS.map((level) => {
                    const isSelected = severity === level.id;
                    return (
                      <div
                        key={level.id}
                        onClick={() => setSeverity(level.id as any)}
                        className={`p-3.5 border rounded cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected ? level.borderActive : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-slate-900">{level.label}</span>
                          <span className={`w-2.5 h-2.5 rounded-full ${level.dot}`} />
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">{level.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Exact Location */}
              <div>
                <label htmlFor="location" className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Specific Location of Event <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. ICU 2nd Floor, Room 204 or Central Storage Room B"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 text-slate-900 placeholder:text-slate-400 transition-colors"
                    required
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: Clinical Narrative */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">3. Incident Narrative</h2>
            </div>

            <div className="p-6">
              <label htmlFor="description" className="block text-xs font-semibold text-slate-800 mb-1.5">
                Detailed Clinical Narrative & Chronology <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a chronological account of the incident, relevant patient/equipment details, immediate corrective actions taken, and staff members present..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 text-slate-900 placeholder:text-slate-400 transition-colors"
                required
              />
            </div>
          </div>

          {/* Section 4: Attachments */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">4. Supporting Documentation</h2>
              <span className="text-xs text-slate-400">Optional (Max 5 files)</span>
            </div>

            <div className="p-6 space-y-4">
              
              {/* File Drop Area */}
              <div className="border border-dashed border-slate-300 hover:border-slate-400 rounded-lg p-5 text-center bg-slate-50/50 relative cursor-pointer transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-8 h-8 rounded-full bg-slate-200/70 text-slate-600 flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-4 h-4" />
                </div>
                <p className="text-xs font-medium text-slate-700">
                  <span className="text-slate-900 font-semibold underline">Select files to upload</span> or drag and drop files here
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Accepted formats: JPG, PNG, PDF (Up to 5MB each)</p>
              </div>

              {/* Uploaded Files Table/List */}
              {files.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Attached Files ({files.length}/5)
                  </div>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded overflow-hidden">
                    {files.map((file, idx) => (
                      <div key={idx} className="p-2.5 bg-white flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 truncate">
                          <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium text-slate-800 truncate">{file.name}</span>
                          <span className="text-slate-400 text-[10px]">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Form Actions Footer Bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel & Exit
            </button>

            <button
              type="submit"
              disabled={createIncidentMutation.isPending}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-black disabled:opacity-50 rounded transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {createIncidentMutation.isPending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Recording Incident...</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  <span>Submit Incident Report</span>
                </>
              )}
            </button>
          </div>

        </form>

      </main>

      {/* Success Modal */}
      {successCreatedId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-center shadow-xl border border-slate-200">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Incident Report Logged</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Report <span className="font-mono font-bold text-slate-900">#INC-{successCreatedId}</span> has been logged into the registry and assigned to the department manager for review.
            </p>
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setSuccessCreatedId(null);
                  setTitle('');
                  setDescription('');
                  setLocation('');
                  setCategory('');
                  setFiles([]);
                }}
                className="flex-1 py-2 px-3 border border-slate-300 rounded text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Log Another Event
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-2 px-3 bg-slate-900 text-white rounded font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
