<template>
  <div class="w-full bg-white">
    <!-- Title -->
    <div class="text-center py-8 border-t border-gray-200">
      <h1 class="title-elegant">
        Judynata Fotografi
      </h1>
      <p class="subtitle-elegant mt-3">
        Menyisir Keheningan dalam Hitam dan Putih
      </p>
    </div>
    
    <!-- Navigation Bar -->
    <nav class="w-full shadow-sm">
      <!-- Desktop Navigation - Horizontal -->
      <div class="hidden lg:flex items-center justify-center gap-8 px-8 border-t border-b border-gray-200">
        <NuxtLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.href"
          class="px-4 py-4 text-sm font-medium transition-all duration-200 tracking-wide rounded-md"
          :class="isActive(item.href)
            ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/20'
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'"
        >
          {{ item.name }}
        </NuxtLink>
        
        <!-- CMS Dropdown Menu -->
        <div class="relative">
          <button
            @click="isCmsDropdownOpen = !isCmsDropdownOpen"
            class="px-4 py-4 text-sm font-medium transition-all duration-200 tracking-wide rounded-md flex items-center gap-2"
            :class="isCmsDropdownOpen
              ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/20'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'"
          >
            CMS
            <svg
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': isCmsDropdownOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <!-- CMS Dropdown Content -->
          <div
            v-show="isCmsDropdownOpen"
            class="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          >
            <NuxtLink
              v-for="item in cmsMenuItems"
              :key="item.name"
              :to="item.href"
              class="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 border-b border-gray-100 last:border-b-0"
              @click="isCmsDropdownOpen = false"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>
        
        <!-- Pemesanan Dropdown Menu -->
        <div class="relative">
          <button
            @click="isBelanjaDropdownOpen = !isBelanjaDropdownOpen"
            class="px-4 py-4 text-sm font-medium transition-all duration-200 tracking-wide rounded-md flex items-center gap-2"
            :class="isBelanjaDropdownOpen
              ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/20'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'"
          >
            PEMESANAN
            <svg
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': isBelanjaDropdownOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <!-- Pemesanan Dropdown Content -->
          <div
            v-show="isBelanjaDropdownOpen"
            class="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          >
            <NuxtLink
              v-for="item in belanjaMenuItems"
              :key="item.name"
              :to="item.href"
              class="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 border-b border-gray-100 last:border-b-0"
              @click="isBelanjaDropdownOpen = false"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>
        
        <!-- User Dropdown Menu -->
        <div class="relative">
          <button
            @click="isUserDropdownOpen = !isUserDropdownOpen"
            class="px-4 py-4 text-sm font-medium transition-all duration-200 tracking-wide rounded-md flex items-center gap-2"
            :class="isUserDropdownOpen
              ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/20'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'"
          >
            USER
            <svg
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': isUserDropdownOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <!-- Dropdown Content -->
          <div
            v-show="isUserDropdownOpen"
            class="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          >
            <NuxtLink
              v-for="item in userMenuItems"
              :key="item.name"
              :to="item.href"
              class="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 border-b border-gray-100"
              @click="isUserDropdownOpen = false"
            >
              {{ item.name }}
            </NuxtLink>
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

    <!-- Mobile Navigation - Vertical with Hamburger -->
    <div class="lg:hidden">
      <!-- Hamburger Button -->
      <button
        @click="isOpen = !isOpen"
        class="p-4 focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            v-if="!isOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Mobile Menu - Vertical with Dividers -->
      <div
        v-show="isOpen"
        class="flex flex-col bg-white border-t border-gray-200"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.href"
          class="px-6 py-4 text-sm font-medium border-b border-gray-200 transition-all duration-200 tracking-wide"
          :class="isActive(item.href)
            ? 'bg-slate-900 text-white'
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'"
          @click="isOpen = false"
        >
          {{ item.name }}
        </NuxtLink>
        
        <!-- CMS Menu Mobile -->
        <div class="border-b border-gray-200">
          <button
            @click="isCmsDropdownOpenMobile = !isCmsDropdownOpenMobile"
            class="w-full px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 tracking-wide flex items-center justify-between"
          >
            CMS
            <svg
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': isCmsDropdownOpenMobile }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div v-show="isCmsDropdownOpenMobile" class="bg-gray-50">
            <NuxtLink
              v-for="item in cmsMenuItems"
              :key="item.name"
              :to="item.href"
              class="block px-10 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              @click="isOpen = false; isCmsDropdownOpenMobile = false"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>
        
        <!-- Pemesanan Menu Mobile -->
        <div class="border-b border-gray-200">
          <button
            @click="isBelanjaDropdownOpenMobile = !isBelanjaDropdownOpenMobile"
            class="w-full px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 tracking-wide flex items-center justify-between"
          >
            PEMESANAN
            <svg
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': isBelanjaDropdownOpenMobile }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div v-show="isBelanjaDropdownOpenMobile" class="bg-gray-50">
            <NuxtLink
              v-for="item in belanjaMenuItems"
              :key="item.name"
              :to="item.href"
              class="block px-10 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              @click="isOpen = false; isBelanjaDropdownOpenMobile = false"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>
        
        <!-- User Menu Mobile -->
        <div class="border-b border-gray-200">
          <button
            @click="isUserDropdownOpenMobile = !isUserDropdownOpenMobile"
            class="w-full px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 tracking-wide flex items-center justify-between"
          >
            USER
            <svg
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': isUserDropdownOpenMobile }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div v-show="isUserDropdownOpenMobile" class="bg-gray-50">
            <NuxtLink
              v-for="item in userMenuItems"
              :key="item.name"
              :to="item.href"
              class="block px-10 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              @click="isOpen = false; isUserDropdownOpenMobile = false"
            >
              {{ item.name }}
            </NuxtLink>
            <button
              @click="handleLogout"
              class="w-full text-left block px-10 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from '#imports';

const isOpen = ref(false);
const isUserDropdownOpen = ref(false);
const isUserDropdownOpenMobile = ref(false);
const isCmsDropdownOpen = ref(false);
const isCmsDropdownOpenMobile = ref(false);
const isBelanjaDropdownOpen = ref(false);
const isBelanjaDropdownOpenMobile = ref(false);
const route = useRoute();
const router = useRouter();
const currentPath = computed(() => route?.path || '');

const isActive = (href: string) => currentPath.value === href;

const navItems = [
  { name: 'HOME', href: '/home' },
  { name: 'TENTANG JUDY', href: '/tentang-judy' },
  { name: 'INSTAGRAM', href: 'https://www.instagram.com/judynad/' },
  { name: 'INTERIOR', href: '/interior' },
  { name: 'PAKET SEWA', href: '#' },
  { name: 'ORDER', href: '/orders' },
];

const cmsMenuItems = [
  { name: 'Foto', href: '/cms-foto' },
  { name: 'Kategori', href: '/cms-kategori' },
];

const belanjaMenuItems = [
  { name: 'Syarat dan Ketentuan', href: '/syarat-ketentuan' },
  { name: 'Login Pelanggan', href: '/login-pelanggan' },
  { name: 'Pilih Foto', href: '/pilih-foto' },
];

const userMenuItems = [
  { name: 'Login', href: '/login' },
  { name: 'Daftar User', href: '/daftar-user' },
  { name: 'Kelola User', href: '/kelola-user' },
];

const handleLogout = () => {
  if (typeof window !== 'undefined') {
    // Clear localStorage
    localStorage.removeItem('authToken');
    
    // Clear cookie
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Redirect to login
    window.location.href = '/login';
  }
};
</script>
