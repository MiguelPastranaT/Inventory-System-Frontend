import { apiClient } from './axiosClient';

export interface CreateSessionResponse {
  message: string;
  expiresAt: string;
}

export interface ValidateSessionResponse {
  valid: boolean;
  message: string;
  expiresAt?: string;
}

export const guestSessionsApi = {
  // Inicia la sesión temporal y guarda la cookie httpOnly
  createSession: async (): Promise<CreateSessionResponse> => {
    const { data } = await apiClient.post<CreateSessionResponse>('/guest-sessions');
    return data;
  },

  // Valida si la cookie actual sigue activa
  validateSession: async (): Promise<ValidateSessionResponse> => {
    const { data } = await apiClient.get<ValidateSessionResponse>('/guest-sessions');
    return data;
  },

  // Refresca el temporizador mediante el latido
  keepAlive: async () => {
    const { data } = await apiClient.post('/guest-sessions/keep-alive');
    return data;
  },

  // Cierra y purga todo
  logout: async () => {
    const { data } = await apiClient.post('/guest-sessions/logout');
    return data;
  },
};