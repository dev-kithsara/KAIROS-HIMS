import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  AlertCircle,
  ExternalLink,
  FileText,
  Upload,
} from 'lucide-react';
import {
  actionOwnerApi,
  type ActionStatus,
} from '../api/actionOwner.api';

const BORDER = '#D8DCE8';

const formatDate = (isoString: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoString));

const formatDateTime = (isoString: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString));

export const ActionOwnerIncidentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const actionId = Number(id);

  const [activeTab, setActiveTab] = useState<'progress' | 'evidence' | 'support'>('progress');
  const [status, setStatus] = useState<ActionStatus>('OPEN');
  const [progressNote, setProgressNote] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch Action Record
  const {
    data: item,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['action-owner-detail', actionId],
    queryFn: () => actionOwnerApi.detail(actionId),
    enabled: Number.isInteger(actionId) && actionId > 0,
  });

  // Fetch Decision Support Insights
  const { data: insights } = useQuery({
    queryKey: ['action-owner-insights', actionId],
    queryFn: () => actionOwnerApi.insights(actionId),
    enabled: Boolean(item),
  });

  // Sync state from fetched action record
  useEffect(() => {
    if (item) {
      setStatus(item.status);
      setProgressNote(item.progressNote ?? '');
      setVerificationNotes(item.verificationNotes ?? '');
    }
  }, [item]);

  // Mutations
  const updateProgressMutation = useMutation({
    mutationFn: (payload: {
      status: ActionStatus;
      progressNote: string;
      verificationNotes?: string;
    }) => actionOwnerApi.progress(actionId, payload),
    onSuccess: () => {
      toast.success('Progress saved and logged to audit trail.');
      queryClient.invalidateQueries({ queryKey: ['action-owner-detail', actionId] });
      queryClient.invalidateQueries({ queryKey: ['action-owner-dashboard'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to update progress.');
    },
  });

  const resubmitMutation = useMutation({
    mutationFn: (payload: { progressNote: string; verificationNotes: string }) =>
      actionOwnerApi.resubmit(actionId, payload),
    onSuccess: () => {
      toast.success('Action resubmitted for Manager verification.');
      queryClient.invalidateQueries({ queryKey: ['action-owner-detail', actionId] });
      queryClient.invalidateQueries({ queryKey: ['action-owner-dashboard'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to resubmit action.');
    },
  });

  const uploadEvidenceMutation = useMutation({
    mutationFn: (file: File) => actionOwnerApi.uploadEvidence(actionId, file),
    onSuccess: () => {
      toast.success('Evidence file uploaded and attached to audit record.');
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['action-owner-detail', actionId] });
      queryClient.invalidateQueries({ queryKey: ['action-owner-dashboard'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to upload evidence.');
    },
  });

  // Secure File Download/View Handler
  const handleViewEvidence = async (evidenceId: number, fileName: string) => {
    try {
      const blob = await actionOwnerApi.viewEvidence(actionId, evidenceId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
      toast.success('Evidence file retrieved securely.');
    } catch {
      toast.error('Failed to download evidence file.');
    }
  };

  const isLocked = item?.reviewStatus === 'VERIFIED';
  const isReturned = item?.reviewStatus === 'RETURNED_FOR_REVISION';
  const isCompleting = status === 'COMPLETED';

  // Submission handler
  const handleSaveProgress = () => {
    if (progressNote.trim().length < 5) {
      toast.error('Progress note must be at least 5 characters long.');
      return;
    }

    if (isCompleting && verificationNotes.trim().length < 10) {
      toast.error('Verification notes (minimum 10 characters) are required for completion.');
      return;
    }

    if (isReturned && isCompleting) {
      resubmitMutation.mutate({
        progressNote: progressNote.trim(),
        verificationNotes: verificationNotes.trim(),
      });
    } else {
      updateProgressMutation.mutate({
        status,
        progressNote: progressNote.trim(),
        verificationNotes: isCompleting ? verificationNotes.trim() : undefined,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-white border border-[#D8DCE8]" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-2xl bg-white border border-[#D8DCE8]" />
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-red-600" />
        <h3 className="mt-3 text-lg font-bold text-red-800">Action Not Found</h3>
        <p className="mt-1 text-sm text-red-600">
          This action does not exist or you do not have permission to view it.
        </p>
        <button
          type="button"
          onClick={() => navigate('/action-owner')}
          className="mt-4 rounded-lg bg-[#1E2B5E] px-4 py-2 text-xs font-semibold text-white cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Due state display text
  const dueStateText = (() => {
    if (item.status === 'COMPLETED') {
      return item.reviewStatus === 'VERIFIED' ? 'Verified' : 'Submitted for verification';
    }
    if (item.overdue) return `${Math.abs(item.dueInDays)} day(s) overdue`;
    if (item.dueInDays === 0) return 'Due today';
    return `${item.dueInDays} day(s) remaining`;
  })();

  return (
    <div className="space-y-5 pb-12 text-[#1A2447]">
      {/* ── Back Navigation ──────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => navigate('/action-owner')}
        className="flex items-center gap-1.5 text-sm font-semibold text-[#2952C4] hover:underline cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to assigned actions
      </button>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header
        className="rounded-2xl p-6 text-white md:p-8"
        style={{ backgroundColor: '#1E2B5E' }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Action Record ACT-{String(item.id).padStart(4, '0')} • Incident #{item.incident.id}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
              {item.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-blue-100/80">
              {item.description}
            </p>
          </div>

          {/* Status & Priority Tags */}
          <div className="flex flex-col items-start gap-2 shrink-0 lg:items-end">
            <span
              className={`rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${
                item.reviewStatus === 'VERIFIED'
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                  : item.reviewStatus === 'RETURNED_FOR_REVISION'
                  ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                  : item.reviewStatus === 'COMPLETED_PENDING_VERIFICATION'
                  ? 'border-sky-400 bg-sky-500/20 text-sky-200'
                  : 'border-white/20 bg-white/10 text-white'
              }`}
            >
              {item.reviewStatus === 'RETURNED_FOR_REVISION'
                ? 'Revision Required'
                : item.reviewStatus === 'COMPLETED_PENDING_VERIFICATION'
                ? 'Awaiting Verification'
                : item.reviewStatus === 'VERIFIED'
                ? 'Verified'
                : item.status.replaceAll('_', ' ')}
            </span>

            <div className="flex items-center gap-2 text-xs text-blue-200">
              <span className="font-semibold uppercase tracking-wider">{item.type}</span>
              <span>•</span>
              <span
                className={`rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                  item.priority === 'CRITICAL'
                    ? 'bg-red-500/30 text-red-200 border border-red-400/40'
                    : item.priority === 'HIGH'
                    ? 'bg-orange-500/30 text-orange-200 border border-orange-400/40'
                    : 'bg-white/15 text-blue-100'
                }`}
              >
                {item.priority} priority
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Manager Feedback Alerts ─────────────────────────────────── */}
      {isReturned && (
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: '#FEF3C7',
            borderLeft: '4px solid #F59E0B',
          }}
        >
          <h3 className="text-sm font-bold text-amber-900">
            Manager returned this action for revision.
          </h3>
          <p className="mt-1 text-sm text-amber-800">
            {item.managerReviewComment ||
              'The manager indicated further remediation evidence or protocol adjustment is required.'}
          </p>
        </div>
      )}

      {isLocked && (
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: '#D1FAE5',
            borderLeft: '4px solid #10B981',
          }}
        >
          <h3 className="text-sm font-bold text-emerald-900">
            Manager verified this action.
          </h3>
          <p className="mt-1 text-sm text-emerald-800">
            {item.managerReviewComment || 'Verified and closed.'}
            {item.effectiveness && ` • Effectiveness: ${item.effectiveness}`}
            {item.effectivenessScore != null && ` (${item.effectivenessScore}%)`}
          </p>
        </div>
      )}

      {/* ── Metadata Cards Grid ──────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Incident */}
        <div
          className="rounded-xl bg-white p-4"
          style={{ border: `1px solid ${BORDER}` }}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7494]">
            Incident
          </p>
          <p className="mt-1.5 text-sm font-bold text-[#1A2447]">
            #{item.incident.id} {item.incident.category && (
              <span className="text-[#2952C4]">{item.incident.category}</span>
            )} {item.incident.title}
          </p>
        </div>

        {/* Department */}
        <div
          className="rounded-xl bg-white p-4"
          style={{ border: `1px solid ${BORDER}` }}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7494]">
            Department
          </p>
          <p className="mt-1.5 text-sm font-bold text-[#1A2447]">
            {item.incident.department.name}
          </p>
        </div>

        {/* Due Date */}
        <div
          className="rounded-xl bg-white p-4"
          style={{ border: `1px solid ${BORDER}` }}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7494]">
            Due Date
          </p>
          <p className="mt-1.5 text-sm font-bold text-[#1A2447]">
            {formatDate(item.dueDate)}
          </p>
        </div>

        {/* Due State */}
        <div
          className="rounded-xl bg-white p-4"
          style={{ border: `1px solid ${BORDER}` }}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7494]">
            Due State
          </p>
          <p
            className={`mt-1.5 text-sm font-bold ${
              item.status === 'COMPLETED'
                ? 'text-emerald-700'
                : item.overdue
                ? 'text-red-700'
                : item.dueInDays <= 3
                ? 'text-amber-700'
                : 'text-[#1A2447]'
            }`}
          >
            {dueStateText}
          </p>
        </div>
      </div>

      {/* ── Tab Bar ──────────────────────────────────────────────────── */}
      <nav
        className="flex gap-1 border-b"
        style={{ borderColor: BORDER }}
        aria-label="Action workspace tabs"
      >
        {([
          { key: 'progress', label: 'Progress' },
          { key: 'evidence', label: 'Evidence & audit' },
          { key: 'support', label: 'Decision support' },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 text-sm font-semibold transition cursor-pointer rounded-t-lg ${
              activeTab === tab.key
                ? 'bg-[#1E2B5E] text-white'
                : 'text-[#6B7494] hover:bg-slate-100 hover:text-[#1A2447]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── TAB 1: PROGRESS ──────────────────────────────────────────── */}
      {activeTab === 'progress' && (
        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          {/* Progress Update Card */}
          <section
            className="rounded-2xl bg-white p-6 space-y-5"
            style={{ border: `1px solid ${BORDER}` }}
          >
            <div>
              <h2 className="text-lg font-bold text-[#1A2447]">Progress update</h2>
              <p className="text-xs text-[#6B7494] mt-0.5">
                Record a meaningful update. Completion requires an evidence-oriented verification note.
              </p>
            </div>

            {/* Status + Verification Notes Row */}
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <select
                  id="action-status-select"
                  disabled={isLocked}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ActionStatus)}
                  className="rounded-lg border border-[#D8DCE8] bg-white px-3 py-2 text-sm font-semibold text-[#1A2447] outline-none transition focus:border-[#2952C4] focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="OPEN">Not started</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              {isCompleting && (
                <span className="text-xs text-[#6B7494]">submit for verification</span>
              )}
            </div>

            {/* Verification Notes (shown when completing) */}
            {isCompleting && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4">
                <textarea
                  id="verification-notes"
                  disabled={isLocked}
                  rows={3}
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Mandatory independent dual-verification checklist implemented across all ICU nursing shifts..."
                  className="w-full rounded-lg border border-blue-200 bg-white p-3 text-sm text-[#1A2447] outline-none transition focus:border-[#2952C4] focus:ring-2 focus:ring-blue-100 resize-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
            )}

            {/* Progress Note */}
            <div>
              <textarea
                id="progress-note"
                disabled={isLocked}
                rows={3}
                value={progressNote}
                onChange={(e) => setProgressNote(e.target.value)}
                placeholder="Mandatory independent dual-verification checklist implemented across all ICU nursing shifts. Bedside briefing completed for 100% on-duty nursing staff and 48-hour compliance audit confirmed zero protocol bypass."
                className="w-full rounded-lg border border-[#D8DCE8] bg-white p-3 text-sm text-[#1A2447] outline-none transition focus:border-[#2952C4] focus:ring-2 focus:ring-blue-100 resize-none disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
              <p className="mt-1 text-[11px] text-[#6B7494]">
                Progress note: minimum 5 characters • Verification note on complete: 10 characters
              </p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="button"
                onClick={handleSaveProgress}
                disabled={
                  isLocked ||
                  updateProgressMutation.isPending ||
                  resubmitMutation.isPending ||
                  progressNote.trim().length < 5 ||
                  (isCompleting && verificationNotes.trim().length < 10)
                }
                className="rounded-lg px-5 py-2.5 text-sm font-bold text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-700 hover:bg-emerald-800"
              >
                {updateProgressMutation.isPending || resubmitMutation.isPending
                  ? 'Saving...'
                  : isReturned && isCompleting
                  ? 'Resubmit for verification'
                  : 'Submit for verification'}
              </button>
            </div>
          </section>

          {/* Due-Date Risk Card */}
          <aside
            className="rounded-2xl bg-white p-6 space-y-4"
            style={{ border: `1px solid ${BORDER}` }}
          >
            <div>
              <h3 className="text-lg font-bold text-[#1A2447]">Due-date risk</h3>
              <p className="text-xs text-[#6B7494] mt-0.5">
                Rule-based planning aid. It never changes work-flow status.
              </p>
            </div>

            {/* Risk Score */}
            <div className="py-2">
              <span
                className={`text-4xl font-extrabold ${
                  item.completionRisk.level === 'HIGH'
                    ? 'text-red-600'
                    : item.completionRisk.level === 'MEDIUM'
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {item.completionRisk.score}%
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B7494] mt-1">
                {item.completionRisk.level} completion risk
              </p>
            </div>

            {/* Risk Factors */}
            <ul className="space-y-1.5 text-xs text-[#6B7494]">
              {item.completionRisk.factors.map((factor, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#6B7494] shrink-0" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>

            {/* Accuracy feedback */}
            <div className="flex items-center gap-3 pt-2 text-xs text-[#6B7494]">
              <span
                className="font-semibold text-[#2952C4] cursor-pointer hover:underline"
              >
                Accurate
              </span>
              <span
                className="font-semibold text-[#6B7494] cursor-pointer hover:underline"
              >
                Not useful
              </span>
            </div>
          </aside>
        </div>
      )}

      {/* ── TAB 2: EVIDENCE & AUDIT ──────────────────────────────────── */}
      {activeTab === 'evidence' && (
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Secure Evidence Upload */}
          <section
            className="rounded-2xl bg-white p-6 space-y-5"
            style={{ border: `1px solid ${BORDER}` }}
          >
            <div>
              <h2 className="text-lg font-bold text-[#1A2447]">Secure evidence</h2>
              <p className="text-xs text-[#6B7494] mt-0.5">
                JPG, PNG, or PDF up to 5 MB. Access is restricted to author and workflow users.
              </p>
            </div>

            {/* File Picker Row */}
            <div className="flex items-center gap-3">
              <label
                htmlFor="evidence-file-input"
                className={`rounded-lg border border-[#D8DCE8] bg-slate-50 px-4 py-2 text-sm font-medium text-[#6B7494] cursor-pointer hover:bg-slate-100 transition ${
                  isLocked ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Choose File
              </label>
              <input
                id="evidence-file-input"
                type="file"
                disabled={isLocked}
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <span className="text-sm text-[#6B7494]">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </span>

              {selectedFile && (
                <button
                  type="button"
                  onClick={() => selectedFile && uploadEvidenceMutation.mutate(selectedFile)}
                  disabled={uploadEvidenceMutation.isPending || isLocked}
                  className="ml-auto rounded-lg bg-[#1E2B5E] px-4 py-2 text-sm font-bold text-white hover:bg-[#152048] cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {uploadEvidenceMutation.isPending ? 'Uploading...' : 'Upload evidence'}
                  </div>
                </button>
              )}

              {!selectedFile && (
                <button
                  type="button"
                  disabled
                  className="ml-auto rounded-lg bg-[#1E2B5E] px-4 py-2 text-sm font-bold text-white opacity-50 cursor-not-allowed"
                >
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload evidence
                  </div>
                </button>
              )}
            </div>

            {/* Evidence List */}
            <div>
              {!item.evidence?.length ? (
                <p className="rounded-lg border border-[#D8DCE8] bg-slate-50 p-6 text-center text-sm text-[#6B7494]">
                  No evidence has been uploaded.
                </p>
              ) : (
                <div className="divide-y divide-[#D8DCE8] rounded-lg border border-[#D8DCE8] bg-white">
                  {item.evidence.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-5 w-5 text-[#2952C4] shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#1A2447] truncate">
                            {file.fileName}
                          </p>
                          <p className="text-[11px] text-[#6B7494]">
                            {Math.round(file.fileSize / 1024)} KB • {formatDate(file.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleViewEvidence(file.id, file.fileName)}
                        className="flex items-center gap-1 text-xs font-semibold text-[#2952C4] hover:underline cursor-pointer shrink-0 ml-3"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Action History & Audit Trail */}
          <section
            className="rounded-2xl bg-white p-6 space-y-4"
            style={{ border: `1px solid ${BORDER}` }}
          >
            <div>
              <h2 className="text-lg font-bold text-[#1A2447]">Action history and audit trail</h2>
              <p className="text-xs text-[#6B7494] mt-0.5">
                Progress, evidence, return, resubmission, and verification events.
              </p>
            </div>

            {!item.history?.length ? (
              <p className="text-sm text-[#6B7494]">No audit entries recorded.</p>
            ) : (
              <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {item.history.map((event, idx) => (
                  <div key={event.id || idx} className="relative pl-5 border-l-2 border-blue-200">
                    <span className="absolute -left-[5px] top-0.5 h-2.5 w-2.5 rounded-full bg-[#2952C4] border-2 border-white" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#1A2447]">
                        {event.eventType.replaceAll('_', ' ')}
                      </p>
                      <p className="text-[11px] text-[#6B7494] mt-0.5">
                        {formatDateTime(event.createdAt)}
                        {event.actor && (
                          <span>
                            {' '}
                            • {event.actor.role && `${event.actor.role}: `}
                            {event.actor.name}
                          </span>
                        )}
                      </p>
                      {(event.note || event.notes) && (
                        <p className="mt-1.5 text-sm text-[#3B4565] leading-relaxed">
                          {event.note || event.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ── TAB 3: DECISION SUPPORT ──────────────────────────────────── */}
      {activeTab === 'support' && (
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Related Action History */}
          <section
            className="rounded-2xl bg-white p-6 space-y-4"
            style={{ border: `1px solid ${BORDER}` }}
          >
            <div>
              <h2 className="text-lg font-bold text-[#1A2447]">Related action history</h2>
              <p className="text-xs text-[#6B7494] mt-0.5">
                Authorized historical matches for reference; use professional judgement.
              </p>
            </div>

            {!insights?.similarActions?.length ? (
              <p className="text-sm text-[#6B7494]">
                No authorized related actions were found.
              </p>
            ) : (
              <div className="space-y-3">
                {insights.similarActions.map((sim) => (
                  <div
                    key={sim.id}
                    className="rounded-lg border border-[#D8DCE8] bg-slate-50/70 p-4 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#2952C4]">
                        ACT-{String(sim.id).padStart(4, '0')}
                      </span>
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#1E2B5E]">
                        {Math.round(sim.similarityScore * 100)}% Match
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#1A2447]">{sim.title}</h4>
                    <p className="text-xs text-[#6B7494] line-clamp-2 leading-relaxed">
                      {sim.description}
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[11px] text-[#6B7494]">
                      <span>Incident #{sim.incident.id}</span>
                      <span className="font-semibold text-emerald-700">
                        {sim.effectiveness || 'Verified Effective'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recommended Approaches */}
          <section
            className="rounded-2xl bg-white p-6 space-y-4"
            style={{ border: `1px solid ${BORDER}` }}
          >
            <div>
              <h2 className="text-lg font-bold text-[#1A2447]">Recommended approaches</h2>
              <p className="text-xs text-[#6B7494] mt-0.5">
                Drawn from manager-verified actions; recommendations do not replace approval.
              </p>
            </div>

            {!insights?.recommendations?.length ? (
              <p className="text-sm text-[#6B7494]">
                Recommendations will appear when verified effective actions are available.
              </p>
            ) : (
              <div className="space-y-3">
                {insights.recommendations.map((rec) => (
                  <div
                    key={rec.key}
                    className="rounded-lg border border-[#D8DCE8] bg-white p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#1A2447]">{rec.title}</h4>
                      {rec.effectivenessScore != null && (
                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          {rec.effectivenessScore}% Effectiveness
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6B7494] leading-relaxed">
                      {rec.description}
                    </p>
                    <p className="text-[11px] text-[#9BA4BC]">
                      Source: Incident #{rec.sourceIncident.id} – {rec.sourceIncident.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default ActionOwnerIncidentDetails;