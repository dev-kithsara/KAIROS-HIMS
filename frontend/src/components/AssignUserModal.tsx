import React, { useState } from 'react';

interface AssignUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: number) => void;
  isLoading: boolean;
  title: string;
  description: string;
  // In a real app, we would fetch this list from the backend (e.g., /api/users?role=INVESTIGATOR)
  // For now, we pass a hardcoded list of users for testing
  availableUsers: { id: number; name: string; role: string }[];
}

export const AssignUserModal: React.FC<AssignUserModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading,
  title,
  description,
  availableUsers
}) => {
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (selectedUserId === '') {
      setError('Please select a user from the list.');
      return;
    }
    setError('');
    onConfirm(Number(selectedUserId));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>

        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          
          <select
            className={`w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 ${
              error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
            value={selectedUserId}
            onChange={(e) => {
              setSelectedUserId(Number(e.target.value));
              if (error) setError('');
            }}
            disabled={isLoading}
          >
            <option value="" disabled>-- Select a User --</option>
            {availableUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
          
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

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
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {isLoading ? 'Assigning...' : 'Confirm Assignment'}
          </button>
        </div>

      </div>
    </div>
  );
};