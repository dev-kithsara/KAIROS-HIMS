import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ManagerDashboard } from './pages/ManagerDashboard';

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
      <ManagerDashboard />
    </QueryClientProvider>
  );
}

export default App;