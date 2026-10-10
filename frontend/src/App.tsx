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
import { TeamManagement } from './features/users/pages/TeamManagement';
import MyIncidentsPage from './features/incidents/pages/MyIncidentsPage';


const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

// Route the root path ("/") to the correct home page based on the user's role
// so that e.g. STAFF never renders the ManagerDashboard (which calls MANAGER-only APIs).
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
              <ProtectedRoute allowedRoles={['MANAGER', 'STAFF', 'INVESTIGATOR', 'ACTION_OWNER', 'ADMIN']} />
            }
          >
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/my-incidents" element={<MyIncidentsPage />} />
              <Route path="/submit-incident" element={<CreateIncident />} />
              <Route path="/incidents/:id" element={<IncidentDetails />} />
              <Route path="/investigator" element={<InvestigatorDashboard />} />
              <Route path="/investigator/:id" element={<InvestigatorWorkspace />} />
              <Route path="/action-owner" element={<ActionOwnerDashboard />} />
              <Route path="/action-owner/:id" element={<ActionOwnerIncidentDetails />} />

              {/* Manager & Admin Only - Department Registry & Team Management */}
              <Route element={<ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']} />}>
                <Route path="/incidents" element={<IncidentsList />} />
                <Route path="/team" element={<TeamManagement />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
