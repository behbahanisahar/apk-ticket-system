import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { isRetryableError } from './lib/apiError';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (!isRetryableError(error)) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});
import { lazy, Suspense } from 'react';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const TicketList = lazy(() => import('./pages/TicketList'));
const TicketDetail = lazy(() => import('./pages/TicketDetail'));
const CreateTicket = lazy(() => import('./pages/CreateTicket'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function LoadingSpinner() {
  return (
    <div className="flex min-h-[200px] items-center justify-center" role="status" aria-label="در حال بارگذاری">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

function PrivateRoute({ children, adminOnly }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.is_staff) return <Navigate to="/tickets" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to="/tickets" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-center"
        dir="rtl"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast: 'font-sans',
            title: 'font-sans',
            description: 'font-sans',
          },
        }}
      />
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicRoute><Suspense fallback={<LoadingSpinner />}><Landing /></Suspense></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Suspense fallback={<LoadingSpinner />}><Login /></Suspense></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Suspense fallback={<LoadingSpinner />}><Register /></Suspense></PublicRoute>} />
          <Route path="/tickets" element={<PrivateRoute><Suspense fallback={<LoadingSpinner />}><TicketList /></Suspense></PrivateRoute>} />
          <Route path="/ticket/:id" element={<PrivateRoute><Suspense fallback={<LoadingSpinner />}><TicketDetail /></Suspense></PrivateRoute>} />
          <Route path="/new" element={<PrivateRoute><Suspense fallback={<LoadingSpinner />}><CreateTicket /></Suspense></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute adminOnly><Suspense fallback={<LoadingSpinner />}><AdminDashboard /></Suspense></PrivateRoute>} />
        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
