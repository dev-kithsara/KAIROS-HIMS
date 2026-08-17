import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateIncident, useDepartments } from '../hooks/useIncidents';
import { useAuthContext } from '../context/AuthContext';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  MapPin,
  Paperclip,
  Trash2,
  Upload,
} from 'lucide-react';

// ── KAIROS Clinical Palette ────────────────────────────────────────────────
const BG = '#090F16';
const PANEL = '#0E1720';
const TEXT = '#EEF7FC';
const TEAL = '#45A79A';
const ACCENT = '#4DC4B5';
const MUTED = '#8FA8B4';
const BORDER = '#253642';
const DANGER = '#EF4444';

const SEVERITY_LEVELS = [
  {
    id: 'LOW',
    label: 'Low',
    desc: 'Minor incident / Near miss with no harm',
    color: '#22C55E',
  },
  {
    id: 'MEDIUM',
    label: 'Medium',
    desc: 'Moderate incident requiring minor intervention',
    color: '#EAB308',
  },
  {
    id: 'HIGH',
    label: 'High',
    desc: 'Severe event causing significant harm or delay',
    color: '#F97316',
  },
  {
    id: 'CRITICAL',
    label: 'Critical',
    desc: 'Sentinel event / Critical patient safety risk',
    color: '#EF4444',
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

const inputStyle: React.CSSProperties = {
  backgroundColor: BG,
  border: `1px solid ${BORDER}`,
  color: TEXT,
  outline: 'none',
};

export const CreateIncident: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const createIncidentMutation = useCreateIncident();
  const { data: departments, isLoading: isDepartmentsLoading } = useDepartments();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('LOW');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [departmentId, setDepartmentId] = useState<number>(user?.departmentId ?? 1);
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
    <div className="space-y-6">
      {/* Page Header */}
      <div
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 rounded-xl border"
        style={{ backgroundColor: PANEL, borderColor: BORDER }}
      >
        <div>
          <button
            onClick={() => navigate('/')}
            className="text-sm mb-3 hover:underline inline-flex items-center gap-1.5"
            style={{ color: ACCENT }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <h1 className="text-2xl font-bold tracking-tight" style={{ color: TEXT }}>
            Log New Incident Report
          </h1>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Submit confidential safety event details to the designated department
            manager for review &amp; audit.
          </p>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs shrink-0"
          style={{ backgroundColor: BG, border: `1px solid ${BORDER}`, color: MUTED }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TEAL }} />
          <span className="font-mono" style={{ color: TEAL }}>
            FORM-INC-01
          </span>
        </div>
      </div>

      {/* Error Notice */}
      {errorMsg && (
        <div
          className="flex items-start gap-3 p-4 rounded-xl border-l-4"
          style={{
            backgroundColor: PANEL,
            borderLeftColor: DANGER,
            borderTop: `1px solid ${BORDER}`,
            borderRight: `1px solid ${BORDER}`,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: DANGER }} />
          <div className="text-sm" style={{ color: MUTED }}>
            <strong className="font-semibold" style={{ color: DANGER }}>
              Unable to submit report:
            </strong>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: General Event Info */}
        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: PANEL, borderColor: BORDER }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>
              1. General Event Information
            </h2>
            <span className="text-xs" style={{ color: MUTED }}>
              * Required fields
            </span>
          </div>

          <div className="space-y-5">
            {/* Incident Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-xs font-medium mb-1.5"
                style={{ color: MUTED }}
              >
                Incident Summary Title <span style={{ color: DANGER }}>*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Near-miss medication dosage variance in ICU Bay 3"
                style={inputStyle}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg focus:border-[#4DC4B5] placeholder:text-[#475569] transition-colors"
                required
              />
            </div>

            {/* Category & Department Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="category"
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: MUTED }}
                >
                  Event Classification / Category <span style={{ color: DANGER }}>*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={inputStyle}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg focus:border-[#4DC4B5] transition-colors"
                  required
                >
                  <option value="" style={{ color: MUTED }}>
                    -- Select Category --
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} style={{ color: TEXT }}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: MUTED }}
                >
                  Department (Incident Location) <span style={{ color: DANGER }}>*</span>
                </label>
                <select
                  id="department"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(Number(e.target.value))}
                  style={inputStyle}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg focus:border-[#4DC4B5] transition-colors"
                  required
                >
                  {isDepartmentsLoading ? (
                    <option value={departmentId} style={{ color: MUTED }}>
                      Loading departments...
                    </option>
                  ) : (
                    departments?.map((dept) => (
                      <option key={dept.id} value={dept.id} style={{ color: TEXT }}>
                        {dept.name}
                      </option>
                    ))
                  )}
                </select>
                <p className="text-[11px] mt-1.5" style={{ color: MUTED }}>
                  Select the department this incident belongs to.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Severity & Location */}
        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: PANEL, borderColor: BORDER }}
        >
          <h2
            className="text-sm font-semibold uppercase tracking-wider mb-5"
            style={{ color: ACCENT }}
          >
            2. Risk Assessment &amp; Location
          </h2>

          <div className="space-y-5">
            {/* Severity Cards */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: MUTED }}>
                Severity Rating <span style={{ color: DANGER }}>*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {SEVERITY_LEVELS.map((level) => {
                  const isSelected = severity === level.id;
                  return (
                    <div
                      key={level.id}
                      onClick={() => setSeverity(level.id as any)}
                      className="p-3.5 border rounded-xl cursor-pointer transition-all flex flex-col justify-between"
                      style={{
                        borderColor: isSelected ? level.color : BORDER,
                        backgroundColor: isSelected ? `${level.color}14` : BG,
                        boxShadow: isSelected ? `0 0 0 1px ${level.color} inset` : 'none',
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="text-xs font-bold"
                          style={{ color: isSelected ? level.color : TEXT }}
                        >
                          {level.label}
                        </span>
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: level.color }}
                        />
                      </div>
                      <p
                        className="text-[11px] leading-snug"
                        style={{ color: isSelected ? TEXT : MUTED }}
                      >
                        {level.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exact Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-xs font-medium mb-1.5"
                style={{ color: MUTED }}
              >
                Specific Location of Event <span style={{ color: DANGER }}>*</span>
              </label>
              <div className="relative">
                <MapPin
                  className="w-4 h-4 absolute left-3 top-3"
                  style={{ color: MUTED }}
                />
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. ICU 2nd Floor, Room 204 or Central Storage Room B"
                  style={inputStyle}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg focus:border-[#4DC4B5] placeholder:text-[#475569] transition-colors"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Clinical Narrative */}
        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: PANEL, borderColor: BORDER }}
        >
          <h2
            className="text-sm font-semibold uppercase tracking-wider mb-5"
            style={{ color: ACCENT }}
          >
            3. Incident Narrative
          </h2>

          <label
            htmlFor="description"
            className="block text-xs font-medium mb-1.5"
            style={{ color: MUTED }}
          >
            Detailed Clinical Narrative &amp; Chronology{' '}
            <span style={{ color: DANGER }}>*</span>
          </label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a chronological account of the incident, relevant patient/equipment details, immediate corrective actions taken, and staff members present..."
            style={inputStyle}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg resize-none focus:border-[#4DC4B5] placeholder:text-[#475569] transition-colors"
            required
          />
        </div>

        {/* Section 4: Attachments */}
        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: PANEL, borderColor: BORDER }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: ACCENT }}
            >
              4. Supporting Documentation
            </h2>
            <span className="text-xs" style={{ color: MUTED }}>
              Optional (Max 5 files)
            </span>
          </div>

          <div className="space-y-4">
            {/* File Drop Area */}
            <div
              className="relative cursor-pointer text-center p-5 rounded-lg border border-dashed transition-colors hover:border-[#4DC4B5]"
              style={{ backgroundColor: BG, borderColor: BORDER }}
            >
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
                style={{ backgroundColor: `${TEAL}1A`, color: TEAL }}
              >
                <Upload className="w-4 h-4" />
              </div>
              <p className="text-xs font-medium" style={{ color: TEXT }}>
                <span className="font-semibold underline" style={{ color: ACCENT }}>
                  Select files to upload
                </span>{' '}
                or drag and drop files here
              </p>
              <p className="text-[11px] mt-1" style={{ color: MUTED }}>
                Accepted formats: JPG, PNG, PDF (Up to 5MB each)
              </p>
            </div>

            {/* Uploaded Files Table/List */}
            {files.length > 0 && (
              <div className="space-y-2 pt-2">
                <div
                  className="text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: MUTED }}
                >
                  Attached Files ({files.length}/5)
                </div>
                <div className="divide-y divide-[#253642] rounded-lg overflow-hidden border border-[#253642]">
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 flex items-center justify-between text-xs"
                      style={{ backgroundColor: BG }}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Paperclip className="w-3.5 h-3.5 shrink-0" style={{ color: MUTED }} />
                        <span className="font-medium truncate" style={{ color: TEXT }}>
                          {file.name}
                        </span>
                        <span className="text-[10px]" style={{ color: MUTED }}>
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="p-1 transition-colors hover:text-[#EF4444]"
                        style={{ color: MUTED }}
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
        <div
          className="rounded-xl border p-4 flex items-center justify-between gap-3"
          style={{ backgroundColor: PANEL, borderColor: BORDER }}
        >
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2.5 text-xs font-medium rounded-lg transition-colors hover:text-[#EEF7FC]"
            style={{ color: MUTED }}
          >
            Cancel &amp; Exit
          </button>

          <button
            type="submit"
            disabled={createIncidentMutation.isPending}
            className="px-6 py-2.5 text-xs font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            style={{
              backgroundColor: ACCENT,
              color: BG,
            }}
          >
            {createIncidentMutation.isPending ? (
              <>
                <div
                  className="w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: `${BG} ${BG} transparent ${BG}` }}
                />
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

      {/* Success Modal */}
      {successCreatedId && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          style={{ backgroundColor: '#00000099' }}
        >
          <div
            className="rounded-xl p-6 max-w-md w-full text-center shadow-xl border"
            style={{ backgroundColor: PANEL, borderColor: BORDER }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: '#22C55E1A', color: '#22C55E' }}
            >
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: TEXT }}>
              Incident Report Logged
            </h3>
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: MUTED }}>
              Report{' '}
              <span
                className="font-mono font-bold"
                style={{ color: ACCENT }}
              >
                #{successCreatedId}
              </span>{' '}
              has been logged into the registry and assigned to the department
              manager for review.
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
                className="flex-1 py-2.5 px-3 rounded-lg font-semibold text-xs transition-colors"
                style={{
                  backgroundColor: BG,
                  color: TEXT,
                  border: `1px solid ${BORDER}`,
                }}
              >
                Log Another Event
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-2.5 px-3 rounded-lg font-semibold text-xs transition-colors"
                style={{ backgroundColor: ACCENT, color: BG }}
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