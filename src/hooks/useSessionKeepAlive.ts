import { useState, useEffect, useRef, useCallback } from 'react';
import { guestSessionsApi } from '../api/guestSessions.api';

const SESSION_DURATION_SECONDS = 10 * 60; // 10 minutos (600s)
const THROTTLE_INTERVAL_MS = 2 * 60 * 1000; // Máximo una petición keep-alive cada 2 minutos

interface UseSessionKeepAliveProps {
  onSessionExpired: () => void;
}

export const useSessionKeepAlive = ({ onSessionExpired }: UseSessionKeepAliveProps) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(SESSION_DURATION_SECONDS);
  const lastPingRef = useRef<number>(Date.now());
  const timerRef = useRef<number | null>(null);

  // Función que llama al endpoint keep-alive del backend
  const sendHeartbeat = useCallback(async () => {
    try {
      await guestSessionsApi.keepAlive();
      lastPingRef.current = Date.now();
      setSecondsLeft(SESSION_DURATION_SECONDS);
    } catch (error) {
      console.error('Error al extender la sesión:', error);
    }
  }, []);

  // Manejador que detecta actividad y aplica throttle
  const handleUserActivity = useCallback(() => {
    const now = Date.now();

    // Si ya pasaron al menos 2 minutos desde el último ping al backend, refrescamos
    if (now - lastPingRef.current >= THROTTLE_INTERVAL_MS) {
      sendHeartbeat();
    } else {
      // Si interactúa activamente, reiniciamos el reloj visual local
      setSecondsLeft(SESSION_DURATION_SECONDS);
    }
  }, [sendHeartbeat]);

  // 1. Efecto: Temporizador visual decrementado cada segundo
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          onSessionExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onSessionExpired]);

  // 2. Efecto: Listeners de actividad del usuario
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [handleUserActivity]);

  // Formato MM:SS para renderizar en la interfaz
  const formattedTime = `${Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`;

  const isLowTime = secondsLeft <= 60; // Advertencia cuando quede 1 minuto o menos

  return {
    formattedTime,
    isLowTime,
    resetManually: sendHeartbeat,
  };
};