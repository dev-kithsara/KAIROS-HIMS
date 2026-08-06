import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { CreateIncident } from './pages/CreateIncident';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { IncidentDetails } from './pages/IncidentDetails';
import InvestigatorDashboard from "./pages/InvestigatorDashboard";
import InvestigatorWorkspace from "./pages/InvestigatorWorkspace";
import { Login } from './pages/Login';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/MainLayout';

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
          <Route element={<ProtectedRoute allowedRoles={['MANAGER', 'STAFF', 'INVESTIGATOR', 'ACTION_OWNER']} />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<ManagerDashboard />} />
              <Route path="/incidents/:id" element={<IncidentDetails />} />
              <Route path="/submit-incident" element={<CreateIncident />} />
              <Route path="/investigator" element={<InvestigatorDashboard />} />
              <Route path="/investigator/:id" element={<InvestigatorWorkspace />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;