<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Masuk ke akun Anda
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ errorMessage }}
              </h3>
            </div>
          </div>
        </div>

        <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                {{ successMessage }}
              </h3>
            </div>
          </div>
        </div>

        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email</label>
            <input
              id="email-address"
              v-model="formData.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="formData.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <NuxtLink to="/daftar-user" class="font-medium text-slate-600 hover:text-slate-500">
              Belum punya akun? Daftar
            </NuxtLink>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">Masuk</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useNuxtApp } from '#app';

const router = useRouter();
const { $axios } = useNuxtApp();

const formData = ref({
  email: '',
  password: ''
});

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const { data: result } = await $axios.post('/auth/login', formData.value);

    const status = String(result?.status ?? '').toLowerCase();
    const token = result?.data?.token ?? result?.token ?? '';
    const role = result?.data?.role ?? (result?.user?.roles?.[0]?.name ?? '');
    const isSuccess = status === 'success' || result?.status === true || result?.success === true || !!token;

    if (isSuccess) {
      // Store token in localStorage
      if (token) {
        localStorage.setItem('authToken', token);
        if (role) localStorage.setItem('userRole', role);
        if (formData.value.email) {
          localStorage.setItem('userEmail', formData.value.email);
        }
        // Also persist in cookie (12 hours)
        if (typeof document !== 'undefined') {
          const maxAge = 60 * 60 * 12;
          document.cookie = `authToken=${encodeURIComponent(token)}; path=/; max-age=${maxAge}`;
          const roleVal = role || '';
          document.cookie = `userRole=${encodeURIComponent(roleVal)}; path=/; max-age=${maxAge}`;
          document.cookie = `userEmail=${encodeURIComponent(formData.value.email)}; path=/; max-age=${maxAge}`;
        }
        // Update axios default header immediately
        $axios.defaults.headers.common = $axios.defaults.headers.common || {};
        $axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      successMessage.value = 'Login berhasil! Mengalihkan...';
      // Redirect to home immediately
      router.push('/home');
      // Fallback redirect if router hasn't navigated
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.location.pathname !== '/home') {
          window.location.href = '/home';
        }
      }, 200);
    } else {
      errorMessage.value = result?.message || 'Login gagal. Periksa email dan password Anda.';
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = 'Terjadi kesalahan. Pastikan server API berjalan.';
  } finally {
    isLoading.value = false;
  }
};

// If already logged in, redirect away from login page
onMounted(() => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      router.push('/home');
    }
  }
});
</script>
