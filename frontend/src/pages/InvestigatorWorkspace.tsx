import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Incident } from "../types/incident";
import { ArrowLeft, Paperclip } from "lucide-react";

// ── KAIROS Clinical Palette ────────────────────────────────────────────────
const BG = '#090F16';
const PANEL = '#0E1720';
const TEXT = '#EEF7FC';
const ACCENT = '#4DC4B5';
const MUTED = '#8FA8B4';
const BORDER = '#253642';

const inputStyle: React.CSSProperties = {
  backgroundColor: BG,
  border: `1px solid ${BORDER}`,
  color: TEXT,
  outline: 'none',
};

const ROOT_CAUSE_CATEGORIES = [
  'Human Error',
  'Equipment Failure',
  'Process Gap',
  'Communication Failure',
];

// ── Color Tokens ──────────────────────────────────────────────────────────
const NAVY    = '#1E2B5E';
const COBALT  = '#1B367A';
const ROYAL   = '#2952C4';
const SURFACE = '#F7F8FA';
const BG_PAGE = '#EDEEF3';
const BORDER  = '#D8DCE8';
const TEXT    = '#1A2447';
const MUTED   = '#6B7494';
const FAINT   = '#9BA4BC';
const GREEN   = '#16A34A';
const AMBER   = '#D97706';

const InvestigatorWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const incident = location.state?.incident as Incident | undefined;

  const [rootCauseCategory, setRootCauseCategory] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRootCauseSubmit = async () => {
    if (rootCause.length < 20) {
      alert("Root cause findings must be at least 20 characters");
      return;
    }
<<<<<<< HEAD
=======

>>>>>>> origin/main
    if (!rootCauseCategory) {
      alert("Please select a root cause category");
      return;
    }
<<<<<<< HEAD
    try {
      setLoading(true);
=======

    try {
      setLoading(true);

>>>>>>> origin/main
      const response = await fetch(
        `http://localhost:8000/api/v1/incidents/${incident!.id}/root-cause`,
        {
          method: "PATCH",
<<<<<<< HEAD
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rootCause, rootCauseCategory }),
        }
      );
      if (!response.ok) throw new Error("Failed");
      alert("Root Cause submitted successfully");
      setRootCause("");
      setRootCauseCategory("");
    } catch {
=======
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            rootCause,
            rootCauseCategory,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed");
      }

      alert("Root Cause submitted successfully");

      setRootCause("");
      setRootCauseCategory("");
    } catch (error) {
>>>>>>> origin/main
      alert("Validation failed");
    } finally {
      setLoading(false);
    }
  };

  if (!incident) {
    return (
<<<<<<< HEAD
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4" style={{ color: TEXT }}>Incident not found</h2>
          <button
            onClick={() => navigate("/investigator")}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: NAVY }}
=======
      <div className="space-y-6">
        <div
          className="p-6 rounded-xl border"
          style={{ backgroundColor: PANEL, borderColor: BORDER }}
        >
          <h2 className="text-2xl font-bold" style={{ color: TEXT }}>
            Incident not found
          </h2>
          <button
            onClick={() => navigate("/investigator")}
            className="mt-4 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            style={{ backgroundColor: ACCENT, color: BG }}
>>>>>>> origin/main
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const inputStyle = {
    backgroundColor: BG_PAGE,
    border: `1.5px solid ${BORDER}`,
    color: TEXT,
    borderRadius: '12px',
    padding: '10px 14px',
    width: '100%',
    outline: 'none',
    fontSize: '14px',
    transition: 'all 0.15s',
  } as React.CSSProperties;

  return (
<<<<<<< HEAD
    <div className="space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate("/investigator")}
        className="text-sm font-semibold hover:underline flex items-center gap-1"
        style={{ color: ROYAL }}
      >
        ← Back to Dashboard
      </button>

      {/* Page Title */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: `linear-gradient(135deg, ${NAVY} 0%, #192651 60%, ${COBALT} 100%)`,
          boxShadow: '0 4px 24px rgba(17,17,132,0.18)',
        }}
      >
        <h1 className="text-2xl font-bold text-white">Investigator Workspace</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Review the incident details and submit your Root Cause Analysis.
        </p>
      </div>

      {/* Incident Information */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, boxShadow: '0 1px 6px rgba(17,17,132,0.06)' }}
      >
        <h2 className="text-base font-bold mb-5" style={{ color: TEXT }}>Incident Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { label: 'Title',    value: incident.title },
            { label: 'Status',   value: incident.status },
            { label: 'Severity', value: incident.severity },
            { label: 'Category', value: incident.category },
            { label: 'Location', value: incident.location },
            { label: 'Created',  value: new Date(incident.createdAt).toLocaleDateString() },
          ].map(({ label, value }) => (
            <div key={label} className="p-4 rounded-xl" style={{ backgroundColor: BG_PAGE, border: `1px solid ${BORDER}` }}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: FAINT }}>{label}</p>
              <p className="text-sm font-semibold" style={{ color: TEXT }}>{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: BG_PAGE, border: `1px solid ${BORDER}` }}>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: FAINT }}>Description</p>
          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{incident.description}</p>
        </div>
      </div>

      {/* Reporter Information */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, boxShadow: '0 1px 6px rgba(17,17,132,0.06)' }}
      >
        <h2 className="text-base font-bold mb-5" style={{ color: TEXT }}>Reporter Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#EBF0FA', border: '1px solid #C0CBE0' }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: ROYAL }}>Reporter</p>
            <p className="text-sm font-semibold" style={{ color: TEXT }}>{incident.reporter?.name ?? "Unknown"}</p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#EBF0FA', border: '1px solid #C0CBE0' }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: ROYAL }}>Department</p>
            <p className="text-sm font-semibold" style={{ color: TEXT }}>{incident.department?.name ?? "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Evidence Attachments */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, boxShadow: '0 1px 6px rgba(17,17,132,0.06)' }}
      >
        <h2 className="text-base font-bold mb-4" style={{ color: TEXT }}>Evidence Attachments</h2>
        {incident.attachments && incident.attachments.length > 0 ? (
          <div className="space-y-2">
            {incident.attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-xl p-3"
                style={{ backgroundColor: BG_PAGE, border: `1px solid ${BORDER}` }}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: TEXT }}>{file.fileName}</p>
                  <p className="text-xs mt-0.5" style={{ color: FAINT }}>{file.fileType}</p>
                </div>
                <a
                  href={`http://localhost:8000/${file.filePath}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl px-4 py-1.5 text-xs font-semibold text-white"
                  style={{ backgroundColor: ROYAL }}
                >
                  View
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: FAINT }}>No evidence uploaded.</p>
        )}
      </div>

      {/* Root Cause Analysis */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, boxShadow: '0 1px 6px rgba(17,17,132,0.06)' }}
      >
        <h2 className="text-base font-bold mb-5" style={{ color: TEXT }}>Root Cause Analysis</h2>

        <div className="mb-5">
          <label className="block text-sm font-semibold mb-2" style={{ color: TEXT }}>
            Root Cause Category
          </label>
          <select
            value={rootCauseCategory}
            onChange={(e) => setRootCauseCategory(e.target.value)}
            style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = ROYAL; e.currentTarget.style.boxShadow = '0 0 0 3px #EBF0FA'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <option value="">Select Category</option>
            <option value="Human Error">Human Error</option>
            <option value="Equipment Failure">Equipment Failure</option>
            <option value="Process Gap">Process Gap</option>
            <option value="Communication Failure">Communication Failure</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold mb-2" style={{ color: TEXT }}>
            Detailed Findings
          </label>
          <textarea
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
            rows={5}
            placeholder="Describe the root cause findings..."
            style={{ ...inputStyle, resize: 'none' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = ROYAL; e.currentTarget.style.boxShadow = '0 0 0 3px #EBF0FA'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = 'none'; }}
          />
          <p className="mt-1.5 text-xs font-medium" style={{ color: rootCause.length < 20 ? AMBER : GREEN }}>
            {rootCause.length}/20 minimum characters
          </p>
        </div>

        <button
          onClick={handleRootCauseSubmit}
          disabled={loading}
          className="rounded-xl px-6 py-3 text-sm font-bold text-white transition-all disabled:opacity-50"
          style={{ backgroundColor: NAVY, boxShadow: '0 2px 8px rgba(17,17,132,0.22)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = COBALT; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = NAVY; }}
        >
          {loading ? "Submitting..." : "Submit Findings"}
        </button>
=======
    <div className="space-y-6">
      {/* Page Header */}
      <div
        className="p-6 rounded-xl border"
        style={{ backgroundColor: PANEL, borderColor: BORDER }}
      >
        <button
          onClick={() => navigate("/investigator")}
          className="text-sm mb-3 hover:underline inline-flex items-center gap-1.5"
          style={{ color: ACCENT }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold tracking-tight" style={{ color: TEXT }}>
          Investigator Workspace
        </h1>
        <p className="text-sm mt-1" style={{ color: MUTED }}>
          Review the incident details and submit your Root Cause Analysis.
        </p>
      </div>

      {/* Incident Information */}
      <div
        className="p-6 rounded-xl border"
        style={{ backgroundColor: PANEL, borderColor: BORDER }}
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: ACCENT }}>
          Incident Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs" style={{ color: MUTED }}>Title</p>
            <p className="font-semibold mt-1" style={{ color: TEXT }}>{incident.title}</p>
          </div>

          <div>
            <p className="text-xs" style={{ color: MUTED }}>Status</p>
            <p className="font-semibold mt-1" style={{ color: TEXT }}>{incident.status}</p>
          </div>

          <div>
            <p className="text-xs" style={{ color: MUTED }}>Severity</p>
            <p className="mt-1" style={{ color: TEXT }}>{incident.severity}</p>
          </div>

          <div>
            <p className="text-xs" style={{ color: MUTED }}>Category</p>
            <p className="mt-1" style={{ color: TEXT }}>{incident.category}</p>
          </div>

          <div>
            <p className="text-xs" style={{ color: MUTED }}>Location</p>
            <p className="mt-1" style={{ color: TEXT }}>{incident.location}</p>
          </div>

          <div>
            <p className="text-xs" style={{ color: MUTED }}>Created</p>
            <p className="mt-1" style={{ color: TEXT }}>
              {new Date(incident.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs" style={{ color: MUTED }}>Description</p>
          <p className="mt-2 leading-6" style={{ color: TEXT }}>{incident.description}</p>
        </div>
      </div>

      {/* Reporter Information */}
      <div
        className="p-6 rounded-xl border"
        style={{ backgroundColor: PANEL, borderColor: BORDER }}
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: ACCENT }}>
          Reporter Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs" style={{ color: MUTED }}>Reporter</p>
            <p className="font-semibold mt-1" style={{ color: TEXT }}>
              {incident.reporter?.name ?? "Unknown"}
            </p>
          </div>

          <div>
            <p className="text-xs" style={{ color: MUTED }}>Department</p>
            <p className="font-semibold mt-1" style={{ color: TEXT }}>
              {incident.department?.name ?? "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Evidence Attachments */}
      <div
        className="p-6 rounded-xl border"
        style={{ backgroundColor: PANEL, borderColor: BORDER }}
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: ACCENT }}>
          Evidence Attachments
        </h2>

        {incident.attachments && incident.attachments.length > 0 ? (
          <div className="space-y-3">
            {incident.attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border p-3"
                style={{ backgroundColor: BG, borderColor: BORDER }}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Paperclip className="w-4 h-4 shrink-0" style={{ color: MUTED }} />
                  <div className="truncate">
                    <p className="font-medium truncate" style={{ color: TEXT }}>
                      {file.fileName}
                    </p>
                    <p className="text-xs" style={{ color: MUTED }}>{file.fileType}</p>
                  </div>
                </div>

                <a
                  href={`http://localhost:8000/${file.filePath}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg text-sm font-medium shrink-0"
                  style={{ backgroundColor: ACCENT, color: BG }}
                >
                  View
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: MUTED }}>No evidence uploaded.</p>
        )}
      </div>

      {/* Root Cause Analysis */}
      <div
        className="p-6 rounded-xl border"
        style={{ backgroundColor: PANEL, borderColor: BORDER }}
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: ACCENT }}>
          Root Cause Analysis
        </h2>

        <div className="mb-6">
          <label className="mb-2 block text-xs font-medium" style={{ color: MUTED }}>
            Root Cause Category
          </label>
          <select
            value={rootCauseCategory}
            onChange={(e) => setRootCauseCategory(e.target.value)}
            style={inputStyle}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg focus:border-[#4DC4B5] transition-colors"
          >
            <option value="" style={{ color: MUTED }}>
              Select Category
            </option>
            {ROOT_CAUSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} style={{ color: TEXT }}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-xs font-medium" style={{ color: MUTED }}>
            Detailed Findings
          </label>
          <textarea
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
            rows={5}
            placeholder="Describe the root cause findings..."
            style={inputStyle}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg resize-none focus:border-[#4DC4B5] placeholder:text-[#475569] transition-colors"
          />
          <p className="mt-2 text-xs" style={{ color: MUTED }}>Minimum 20 characters</p>
        </div>

        <button
          onClick={handleRootCauseSubmit}
          disabled={loading}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
          style={{ backgroundColor: ACCENT, color: BG }}
        >
          {loading ? "Submitting..." : "Submit Findings"}
        </button>
>>>>>>> origin/main
      </div>
    </div>
  );
};

export default InvestigatorWorkspace;