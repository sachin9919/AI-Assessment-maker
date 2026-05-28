'use client';

const TOKEN_KEY = 'vedaai_token';

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `token=${token}; Path=/; SameSite=Lax`;
};

export const clearStoredToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = 'token=; Path=/; Max-Age=0; SameSite=Lax';
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getStoredToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};
