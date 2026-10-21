import { Routes, Route, Navigate } from 'react-router-dom';
import { WelcomeView } from '../pages/WelcomeView';
import { DashboardView } from '../pages/DashboardView';
import { ProtectedRoute, PublicRoute } from './RouteGuards';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas exclusivas para invitados sin sesión */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<WelcomeView />} />
      </Route>

      {/* Rutas protegidas que requieren sesión activa */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardView />} />
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};