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

    if (!rootCauseCategory) {
      alert("Please select a root cause category");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8000/api/v1/incidents/${incident!.id}/root-cause`,
        {
          method: "PATCH",
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
      alert("Validation failed");
    } finally {
      setLoading(false);
    }
  };

  if (!incident) {
    return (
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
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
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
      </div>
    </div>
  );
};

export default InvestigatorWorkspace;