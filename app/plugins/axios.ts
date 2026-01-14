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
        if (match && match[1]) token = decodeURIComponent(match[1]);
      }
      if (token) {
        request.headers = request.headers || {};
        (request.headers as any).Authorization = `Bearer ${token}`;
      }
    }
    
    // Console log untuk request
    console.log(`%c[API REQUEST]`, 'color: #0066cc; font-weight: bold;', {
      method: request.method?.toUpperCase(),
      url: request.url,
      baseURL: request.baseURL,
      data: request.data,
      headers: request.headers
    });
    
    return request;
  });

  // Log semua responses
  instance.interceptors.response.use(
    (response) => {
      console.log(`%c[API RESPONSE - SUCCESS]`, 'color: #00aa00; font-weight: bold;', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data,
        headers: response.headers
      });
      return response;
    },
    (error) => {
      console.log(`%c[API RESPONSE - ERROR]`, 'color: #ff0000; font-weight: bold;', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        message: error.message
      });
      return Promise.reject(error);
    }
  );

  return {
    provide: {
      axios: instance,
    },
  };
});
