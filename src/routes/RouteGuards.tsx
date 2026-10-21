import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

// Spinner de carga mientras se valida la cookie con el backend
const AuthLoadingScreen = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    <span className="text-xs text-slate-400 font-medium tracking-wide">
      Verificando sesión...
    </span>
  </div>
);

// Protege /dashboard: Solo usuarios con sesión válida
export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

// Protege /: Si ya tiene sesión activa, lo envía directo a /dashboard
export const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};