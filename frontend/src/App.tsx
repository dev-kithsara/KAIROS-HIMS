import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { CreateIncident } from './pages/CreateIncident';
import { Routes, Route } from 'react-router-dom';
import { IncidentDetails } from './pages/IncidentDetails';
import { Login } from './pages/Login';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
      <Route path="/login" element={<Login />} />
         
        {/* Protected Routes (We will add route guards later) */}
        {/* Home page shows the dashboard */}
        <Route path="/" element={<ManagerDashboard />} />
        
        {/* Staff Incident Submission Form */}
        <Route path="/submit-incident" element={<CreateIncident />} />
        
        {/* Dynamic route for incident details */}
        <Route path="/incidents/:id" element={<IncidentDetails />} />
      </Routes>
      
    </QueryClientProvider>
  );
}

export default App;
