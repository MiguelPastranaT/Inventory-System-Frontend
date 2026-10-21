import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Clock,
  ShieldAlert,
  ArrowRight,
  Database,
  Layers,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { LanguageSelector } from '../components/LanguageSelector';
import { useAuth } from '../context/AuthContext';

export const WelcomeView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStartSession = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Inicia la sesión de invitado y actualiza el estado global en AuthContext
      await login();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión de invitado:', error);
      setErrorMessage(
        'No se pudo conectar con el servidor. Verifica que el backend esté encendido.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Barra superior */}
      <header className="max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <a
          href={import.meta.env.VITE_PORTFOLIO_URL || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t('welcome.back_portfolio')}
        </a>
        <LanguageSelector />
      </header>

      {/* Contenido principal */}
      <main className="max-w-4xl mx-auto px-6 py-8 flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-950/70 border border-blue-800 text-blue-300 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          {t('welcome.badge')}
        </span>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl">
          {t('welcome.title')}
        </h1>
        <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
          {t('welcome.description')}
        </p>

        {/* Alerta de sesión temporal */}
        <div className="mt-8 w-full max-w-2xl bg-amber-950/30 border border-amber-800/60 rounded-xl p-5 text-left flex gap-4 items-start shadow-inner">
          <div className="p-2 bg-amber-900/40 border border-amber-700/50 rounded-lg text-amber-300 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-amber-200 flex items-center gap-2">
              {t('welcome.guest_alert_title')}
            </h2>
            <p className="mt-1 text-xs text-amber-300/80 leading-relaxed">
              {t('welcome.guest_alert_desc')}
            </p>
          </div>
        </div>

        {/* Mensaje de error de conexión en caso de fallo */}
        {errorMessage && (
          <div className="mt-4 w-full max-w-2xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Botón de acción */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <button
            onClick={handleStartSession}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-sm px-7 py-3.5 rounded-lg shadow-lg shadow-blue-900/20 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {t('welcome.start_button')}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Tarjetas arquitectónicas */}
        <div className="mt-16 w-full text-left">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-6">
            {t('welcome.features_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400 mb-3">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200">
                {t('welcome.feature_crud_title')}
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                {t('welcome.feature_crud_desc')}
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 mb-3">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200">
                {t('welcome.feature_isolation_title')}
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                {t('welcome.feature_isolation_desc')}
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-purple-400 mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200">
                {t('welcome.feature_lifecycle_title')}
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                {t('welcome.feature_lifecycle_desc')}
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl w-full mx-auto px-6 py-6 text-center text-xs text-slate-400">
        NestJS + MongoDB Sandbox &bull; React + Vite Frontend
      </footer>
    </div>
  );
};