<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8 flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Daftar User</h1>
          <p class="mt-2 text-sm text-gray-600">
            Manajemen daftar user dalam sistem
          </p>
        </div>
        <button
          @click="handleLogout"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

      <!-- Alert Messages -->
      <div v-if="errorMessage" class="mb-4 rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              {{ errorMessage }}
            </h3>
          </div>
        </div>
      </div>

      <div v-if="successMessage" class="mb-4 rounded-md bg-green-50 p-4 border-l-4 border-green-500">
        <div class="flex justify-between items-start">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                {{ successMessage }}
              </h3>
            </div>
          </div>
          <button
            @click="successMessage = ''"
            class="ml-2 text-green-700 hover:text-green-900"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Search and Add Button -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex-1 w-full sm:max-w-md">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari user (nama atau email)..."
                class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                @input="handleSearch"
              />
              <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button
            @click="openAddModal"
            class="w-full sm:w-auto px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah User
          </button>
        </div>

        <!-- Users Table -->
        <div v-if="isLoading" class="p-8 text-center">
          <svg class="animate-spin h-8 w-8 mx-auto text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-2 text-gray-600">Memuat data...</p>
        </div>

        <div v-else-if="filteredUsers.length === 0" class="p-8 text-center text-gray-500">
          {{ searchQuery ? 'Tidak ada hasil pencarian' : 'Tidak ada data user' }}
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(user, index) in paginatedUsers" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="role in user.roles"
                      :key="role.id"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getRoleColor(role.name)"
                    >
                      {{ role.label }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    @click="openEditModal(user)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(user)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} dari {{ filteredUsers.length }} user
          </div>
          <div class="flex gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <button
              v-for="page in displayedPages"
              :key="page"
              @click="currentPage = page"
              class="px-3 py-1 border rounded-md text-sm font-medium"
              :class="currentPage === page 
                ? 'bg-slate-900 text-white border-slate-900' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
            >
              {{ page }}
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      <!-- Add/Edit User Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        @click.self="closeModal"
      >
        <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              {{ isEditMode ? 'Edit User' : 'Tambah User Baru' }}
            </h3>
            
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="modalForm.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="modalForm.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="email@example.com"
                />
              </div>

              <div v-if="!isEditMode">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Password <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="modalForm.password"
                  type="password"
                  :required="!isEditMode"
                  minlength="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="Minimal 6 karakter"
                />
              </div>

              <div v-if="isEditMode">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  v-model="modalForm.role_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                >
                  <option value="">-- Pilih Role --</option>
                  <option v-for="role in availableRoles" :key="role.id" :value="role.id">
                    {{ role.label }}
                  </option>
                </select>
              </div>

              <div class="flex gap-3 mt-6">
                <button
                  type="submit"
                  :disabled="isSaving"
                  class="flex-1 px-4 py-2 bg-slate-900 text-white text-base font-medium rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isSaving ? 'Menyimpan...' : (isEditMode ? 'Update' : 'Simpan') }}
                </button>
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        @click.self="closeDeleteModal"
      >
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Konfirmasi Hapus User
            </h3>
            
            <p class="text-sm text-gray-500 mb-4">
              Apakah Anda yakin ingin menghapus user <strong>{{ userToDelete?.name }}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div class="flex gap-3 mt-4">
              <button
                @click="deleteUser"
                :disabled="isDeleting"
                class="flex-1 px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isDeleting ? 'Menghapus...' : 'Hapus' }}
              </button>
              <button
                @click="closeDeleteModal"
                class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useNuxtApp } from '#app';

const router = useRouter();
const { $axios } = useNuxtApp();

interface Role {
  id: string;
  name: string;
  label: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
}

const users = ref<User[]>([]);
const availableRoles = ref<Role[]>([]);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);

const isLoading = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditMode = ref(false);
const userToDelete = ref<User | null>(null);

const modalForm = ref({
  id: '',
  name: '',
  email: '',
  password: '',
  role_id: ''
});

// Get auth token (localStorage or cookie)
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    const ls = localStorage.getItem('authToken');
    if (ls) return ls;
    const match = document.cookie.match(/(?:^|; )authToken=([^;]+)/);
    if (match && match[1]) return decodeURIComponent(match[1]);
  }
  return null;
};

// Check authentication
const checkAuth = () => {
  const token = getAuthToken();
  if (!token) {
    errorMessage.value = 'Anda harus login terlebih dahulu';
    setTimeout(() => {
      router.push('/login');
    }, 2000);
    return false;
  }
  return true;
};

// Fetch all users
const fetchUsers = async () => {
  if (!checkAuth()) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const { data: result } = await $axios.get('/users');
    
    console.log('API Response:', result);

    if (result?.status === true) {
      users.value = result.data;
    } else {
      errorMessage.value = result?.message || 'Gagal memuat data user';
    }
  } catch (error: any) {
    console.error('Fetch users error:', error);
    console.error('Error response:', error.response?.data);
    
    const errorMsg = error.response?.data?.message || error.message || 'Terjadi kesalahan saat memuat data';
    errorMessage.value = errorMsg;
  } finally {
    isLoading.value = false;
  }
};

// Fetch available roles
const fetchRoles = async () => {
  if (!checkAuth()) return;

  try {
    const { data: result } = await $axios.get('/roles');
    if (result?.status === 'success') {
      availableRoles.value = result.data;
    }
  } catch (error) {
    console.error('Fetch roles error:', error);
  }
};

// Filtered users based on search
const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return users.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query) || 
    user.email.toLowerCase().includes(query)
  );
});

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

const displayedPages = computed(() => {
  const pages = [];
  const maxPages = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPages / 2));
  let endPage = Math.min(totalPages.value, startPage + maxPages - 1);
  
  if (endPage - startPage < maxPages - 1) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Handle search
const handleSearch = () => {
  currentPage.value = 1;
};

// Open add modal
const openAddModal = () => {
  isEditMode.value = false;
  modalForm.value = {
    id: '',
    name: '',
    email: '',
    password: '',
    role_id: ''
  };
  showModal.value = true;
};

// Open edit modal
const openEditModal = (user: User) => {
  isEditMode.value = true;
  modalForm.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    password: '',
    role_id: user.roles[0]?.id || ''
  };
  showModal.value = true;
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  isEditMode.value = false;
  modalForm.value = {
    id: '',
    name: '',
    email: '',
    password: '',
    role_id: ''
  };
};

// Handle form submit
const handleSubmit = async () => {
  isSaving.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    if (isEditMode.value) {
      await updateUser();
    } else {
      await addUser();
    }
  } finally {
    isSaving.value = false;
  }
};

// Add new user
const addUser = async () => {
  try {
    const userName = modalForm.value.name;
    const { data: result } = await $axios.post('/auth/register', {
      name: modalForm.value.name,
      email: modalForm.value.email,
      password: modalForm.value.password,
    });

    if (result?.status === 'success') {
      // Tutup modal terlebih dahulu
      closeModal();
      
      // Refresh daftar user
      await fetchUsers();
      
      // Tampilkan pesan sukses
      successMessage.value = `✓ User "${userName}" berhasil ditambahkan`;
      
      // Auto dismiss after 5 seconds
      setTimeout(() => {
        successMessage.value = '';
      }, 5000);
    } else {
      errorMessage.value = result?.message || 'Gagal menambahkan user';
    }
  } catch (error) {
    console.error('Add user error:', error);
    errorMessage.value = 'Terjadi kesalahan saat menambahkan user';
  }
};

// Update user
const updateUser = async () => {
  try {
    const { data: result } = await $axios.put(`/users/${modalForm.value.id}`, {
      name: modalForm.value.name,
      email: modalForm.value.email,
      role_id: modalForm.value.role_id,
    });

    if (result?.status === 'success') {
      successMessage.value = `✓ User "${modalForm.value.name}" berhasil diupdate`;
      closeModal();
      await fetchUsers();
      
      // Auto dismiss after 5 seconds
      setTimeout(() => {
        successMessage.value = '';
      }, 5000);
    } else {
      errorMessage.value = result?.message || 'Gagal mengupdate user';
    }
  } catch (error) {
    console.error('Update user error:', error);
    errorMessage.value = 'Terjadi kesalahan saat mengupdate user';
  }
};

// Confirm delete user
const confirmDelete = (user: User) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

// Close delete modal
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  userToDelete.value = null;
};

// Delete user
const deleteUser = async () => {
  if (!userToDelete.value) return;

  isDeleting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const userName = userToDelete.value.name;
    const { data: result } = await $axios.delete(`/users/${userToDelete.value.id}`);

    if (result?.status === 'success') {
      // Tutup modal terlebih dahulu
      closeDeleteModal();
      
      // Refresh daftar user
      await fetchUsers();
      
      // Tampilkan pesan sukses
      successMessage.value = `✓ User "${userName}" berhasil dihapus`;
      
      // Auto dismiss after 5 seconds
      setTimeout(() => {
        successMessage.value = '';
      }, 5000);
    } else {
      errorMessage.value = result?.message || 'Gagal menghapus user';
    }
  } catch (error) {
    console.error('Delete user error:', error);
    errorMessage.value = 'Terjadi kesalahan saat menghapus user';
  } finally {
    isDeleting.value = false;
  }
};

// Get role color based on role name
const getRoleColor = (roleName: string) => {
  const colors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-800',
    user: 'bg-blue-100 text-blue-800',
    moderator: 'bg-green-100 text-green-800',
  };
  return colors[roleName] || 'bg-gray-100 text-gray-800';
};

// Handle logout
const handleLogout = () => {
  if (typeof window !== 'undefined') {
    // Clear localStorage
    localStorage.removeItem('authToken');
    
    // Clear cookie
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Redirect to login
    router.push('/login');
  }
};

// Initialize component
onMounted(() => {
  fetchUsers();
  fetchRoles();
});
</script>
