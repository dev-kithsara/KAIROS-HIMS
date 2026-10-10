// frontend/src/App.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { CreateIncident } from './features/incidents/pages/CreateIncident';
import { IncidentsList } from './features/incidents/pages/IncidentsList';
import { ManagerDashboard } from './features/incidents/pages/ManagerDashboard';
import { IncidentDetails } from './features/incidents/pages/IncidentDetails';
import InvestigatorDashboard from './features/incidents/pages/InvestigatorDashboard';
import InvestigatorWorkspace from './features/incidents/pages/InvestigatorWorkspace';
import { Login } from './features/auth/pages/Login';
import { ActionOwnerDashboard } from './features/incidents/pages/ActionOwnerDashboard';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuthContext } from './features/auth/context/AuthContext';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { MainLayout } from './shared/components/MainLayout';
import ActionOwnerIncidentDetails from './features/incidents/pages/ActionOwnerIncidentDetails';
import MyIncidentsPage from './features/incidents/pages/MyIncidentsPage';

// Manager Modernized Clinical Governance Pages
import { ManagerIncidentDetails } from './features/manager/pages/ManagerIncidentDetails';
import { ManagerAnalytics } from './features/manager/pages/ManagerAnalytics';
import { ManagerTeam } from './features/manager/pages/ManagerTeam';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

// Route the root path ("/") to the correct home page based on the user's role
const HomeRoute = () => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-[#0F1E42] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  switch (user?.role) {
    case 'INVESTIGATOR':
      return <InvestigatorDashboard />;
    case 'ACTION_OWNER':
      return <ActionOwnerDashboard />;
    case 'STAFF':
      return <MyIncidentsPage />;
    case 'MANAGER':
    case 'ADMIN':
      return <ManagerDashboard />;
    default:
      return <MyIncidentsPage />;
  }
};

// Smart Incident Route: Serves Manager Governance view to Managers/Admins, otherwise staff view
const IncidentViewRoute = () => {
  const { user } = useAuthContext();
  if (user?.role === 'MANAGER' || user?.role === 'ADMIN') {
    return <ManagerIncidentDetails />;
  }
  return <IncidentDetails />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={['MANAGER', 'STAFF', 'INVESTIGATOR', 'ACTION_OWNER', 'ADMIN']}
              />
            }
          >
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/my-incidents" element={<MyIncidentsPage />} />
              <Route path="/submit-incident" element={<CreateIncident />} />
              
              {/* Incident Details (Smart Route: Managers see 4-Tab Governance, Staff see standard view) */}
              <Route path="/incidents/:id" element={<IncidentViewRoute />} />
              <Route path="/manager/incidents/:id" element={<ManagerIncidentDetails />} />

              <Route path="/investigator" element={<InvestigatorDashboard />} />
              <Route path="/investigator/:id" element={<InvestigatorWorkspace />} />
              <Route path="/action-owner" element={<ActionOwnerDashboard />} />
              <Route path="/action-owner/:id" element={<ActionOwnerIncidentDetails />} />

              {/* Manager & Admin Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']} />}>
                <Route path="/incidents" element={<IncidentsList />} />
                <Route path="/team" element={<ManagerTeam />} />
                <Route path="/analytics" element={<ManagerAnalytics />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;