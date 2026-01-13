import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const instance = axios.create({
    baseURL: config.public.apiBaseUrl,
  });

  instance.interceptors.request.use((request) => {
    if (process.client) {
      let token: string | null = null;
      try {
        token = localStorage.getItem('authToken');
      } catch {}
      if (!token && typeof document !== 'undefined') {
        const match = document.cookie.match(/(?:^|; )authToken=([^;]+)/);
        if (match) token = decodeURIComponent(match[1]);
      }
      if (token) {
        request.headers = request.headers || {};
        (request.headers as any).Authorization = `Bearer ${token}`;
      }
    }
    return request;
  });

  return {
    provide: {
      axios: instance,
    },
  };
});
