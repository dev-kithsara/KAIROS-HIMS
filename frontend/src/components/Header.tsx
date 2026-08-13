import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { getDepartmentName } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <header className="h-16 border-b border-[#253642] bg-[#0E1720] flex items-center justify-end px-6 shrink-0">
      {/* Right Side: Profile Info and Logout */}
      <div className="flex items-center gap-6">
        {/* User Info */}
        <div className="flex flex-col items-end">
          {/* Department Name and User Name */}
          <span className="text-sm font-semibold text-[#EEF7FC]">
            {getDepartmentName(user.departmentId)} &bull; {user.name}
          </span>
          {/* Role Badge */}
          <span className="text-[10px] font-bold tracking-wider text-[#4DC4B5] uppercase bg-[#45A79A]/10 px-2 py-0.5 rounded mt-0.5">
            {user.role.replace('_', ' ')}
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="h-8 w-px bg-[#253642]"></div>

        {/* Logout Button */}
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to logout?')) logout();
          }}
          className="text-sm font-medium text-[#8FA8B4] hover:text-[#EF4444] transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};
