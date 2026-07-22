import React, { useState } from 'react';

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
}

export const RejectModal: React.FC<RejectModalProps> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  // Don't render anything if the modal is closed
  if (!isOpen) return null;

  const handleSubmit = () => {
    // Basic frontend validation (matches our Zod schema)
    if (reason.trim().length < 10) {
      setError('Reason must be at least 10 characters long.');
      return;
    }
    if (reason.length > 500) {
      setError('Reason cannot exceed 500 characters.');
      return;
    }

    setError('');
    onConfirm(reason.trim());
  };

  return (
    // Modal Overlay (Dark background)
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      
      {/* Modal Content Box */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Reject Incident</h3>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 mb-4">
            Please provide a reason for rejecting this incident. This will be recorded in the system.
          </p>
          
          <textarea
            className={`w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 ${
              error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
            rows={4}
            placeholder="Enter rejection reason (min 10 characters)..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError(''); // Clear error when user starts typing
            }}
            disabled={isLoading}
          ></textarea>
          
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        {/* Footer (Buttons) */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
          >
            {isLoading ? 'Rejecting...' : 'Confirm Rejection'}
          </button>
        </div>

      </div>
    </div>
  );
};