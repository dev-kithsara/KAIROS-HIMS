import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { CreateIncident } from './pages/CreateIncident';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { IncidentDetails } from './pages/IncidentDetails';
import { Login } from './pages/Login';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/MainLayout'; 

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* 2. Wrap the entire routing system with AuthProvider. 
             This makes the 'user' state available to all components inside. */}
      <AuthProvider>
        <Routes>
          {/* 3. Public Route: Anyone can access the login page */}
          <Route path="/login" element={<Login />} />
          
          {/* 4. Protected Routes: We use a layout route structure.
                 The <ProtectedRoute /> acts as a gatekeeper. 
                 If it passes, it renders the <Outlet /> which contains the child routes. */}
          <Route element={<ProtectedRoute allowedRoles={['MANAGER', 'STAFF', 'INVESTIGATOR', 'ACTION_OWNER']} />}>
            <Route element={<MainLayout />}>
            {/* 5. These routes are only accessible if the user is authenticated */}
            <Route path="/" element={<ManagerDashboard />} />
            <Route path="/incidents/:id" element={<IncidentDetails />} />
            <Route path="/submit-incident" element={<CreateIncident />} />
            </Route>
            
          </Route>
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;