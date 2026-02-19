import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import TicketList from './pages/TicketList';
import TicketDetail from './pages/TicketDetail';
import CreateTicket from './pages/CreateTicket';
import AdminDashboard from './pages/AdminDashboard';

function PrivateRoute({ children, adminOnly }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.is_staff) return <Navigate to="/tickets" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/tickets" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/tickets" element={<PrivateRoute><TicketList /></PrivateRoute>} />
          <Route path="/ticket/:id" element={<PrivateRoute><TicketDetail /></PrivateRoute>} />
          <Route path="/new" element={<PrivateRoute><CreateTicket /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
