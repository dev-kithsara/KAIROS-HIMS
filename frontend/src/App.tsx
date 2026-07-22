import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { Routes, Route } from 'react-router-dom';
import { IncidentDetails } from './pages/IncidentDetails';

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
      
      {/* React Router Configuration */}
      <Routes>
        {/* Home page shows the dashboard */}
        <Route path="/" element={<ManagerDashboard />} />
        
        {/* Dynamic route for incident details */}
        <Route path="/incidents/:id" element={<IncidentDetails />} />
      </Routes>
      
    </QueryClientProvider>
  );
}

export default App;
