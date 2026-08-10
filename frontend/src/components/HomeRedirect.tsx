import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { ManagerDashboard } from '../pages/ManagerDashboard';

export const HomeRedirect: React.FC = () => {
  const { user } = useAuthContext();

  if (user?.role === 'INVESTIGATOR') {
    return <Navigate to="/investigator" replace />;
  }

  if (user?.role === 'ACTION_OWNER') {
    return <Navigate to="/action-owner" replace />;
  }

  return <ManagerDashboard />;
};
