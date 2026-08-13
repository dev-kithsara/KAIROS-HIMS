import React, { useState } from 'react';

// ── KAIROS Clinical Palette ─────────────────────────────────────────
const PANEL   = '#0E1720';
const TEXT    = '#EEF7FC';
const MUTED   = '#8FA8B4';
const BORDER  = '#253642';
const DANGER  = '#EF4444';
const TEAL    = '#45A79A';

interface AssignUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: number) => void;
  isLoading: boolean;
  title: string;
  description: string;
  availableUsers: { id: number; name: string; role: string }[];
}

export const AssignUserModal: React.FC<AssignUserModalProps> = ({
  isOpen, onClose, onConfirm, isLoading, title, description, availableUsers,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (selectedUserId === '') { setError('Please select a user from the list.'); return; }
    setError('');
    onConfirm(Number(selectedUserId));
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50" style={{ backgroundColor: 'rgba(9,15,22,0.85)' }}>
      <div
        className="rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        style={{ backgroundColor: PANEL, border: `1px solid ${BORDER}` }}
      >
        {/* Header */}
        <div className="px-6 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <h3 className="text-lg font-bold" style={{ color: TEXT }}>{title}</h3>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm mb-4" style={{ color: MUTED }}>{description}</p>

          <select
            className="w-full rounded-lg p-3 text-sm outline-none transition-all cursor-pointer"
            style={{
              backgroundColor: '#090F16',
              border: `1px solid ${error ? DANGER : BORDER}`,
              color: TEXT,
            }}
            value={selectedUserId}
            onChange={(e) => { setSelectedUserId(Number(e.target.value)); if (error) setError(''); }}
            disabled={isLoading}
            onFocus={(e) => { (e.target as HTMLElement).style.borderColor = error ? DANGER : TEAL; }}
            onBlur={(e)  => { (e.target as HTMLElement).style.borderColor = error ? DANGER : BORDER; }}
          >
            <option value="" disabled style={{ backgroundColor: PANEL }}>-- Select a User --</option>
            {availableUsers.map(user => (
              <option key={user.id} value={user.id} style={{ backgroundColor: PANEL }}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>

          {error && <p className="text-xs mt-1" style={{ color: DANGER }}>{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-3" style={{ borderTop: `1px solid ${BORDER}` }}>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-50"
            style={{ color: MUTED, border: `1px solid ${BORDER}`, backgroundColor: 'transparent' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: TEAL, color: '#090F16', border: `1px solid ${TEAL}` }}
          >
            {isLoading ? 'Assigning...' : 'Confirm Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};