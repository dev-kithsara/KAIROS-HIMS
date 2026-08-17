import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { CreateIncident } from './pages/CreateIncident';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { IncidentDetails } from './pages/IncidentDetails';
import { IncidentsList } from './pages/IncidentsList';
import InvestigatorDashboard from './pages/InvestigatorDashboard';
import InvestigatorWorkspace from './pages/InvestigatorWorkspace';
import { Login } from './pages/Login';
import { ActionOwnerDashboard } from './pages/ActionOwnerDashboard';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/MainLayout';
import ActionOwnerIncidentDetails from './pages/ActionOwnerIncidentDetails';
import MyIncidentsPage from "./pages/MyIncidentsPage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

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
              <ProtectedRoute allowedRoles={['MANAGER', 'STAFF', 'INVESTIGATOR', 'ACTION_OWNER']} />
            }
          >
            <Route element={<MainLayout />}>
              <Route path="/" element={<ManagerDashboard />} />
              <Route path="/incidents" element={<IncidentsList />} />
              <Route path="/incidents/:id" element={<IncidentDetails />} />
              <Route path="/my-incidents" element={<MyIncidentsPage />} />
              <Route path="/submit-incident" element={<CreateIncident />} />
              <Route path="/investigator" element={<InvestigatorDashboard />} />
              <Route path="/investigator/:id" element={<InvestigatorWorkspace />} />
              <Route path="/action-owner" element={<ActionOwnerDashboard />} />
              <Route path="/action-owner/:id" element={<ActionOwnerIncidentDetails />} />
              <Route path="/action-owner/incidents/:id" element={<ActionOwnerIncidentDetails />} 
              
/>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
