<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8 flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Kelola User</h1>
          <p class="mt-2 text-sm text-gray-600">
            Manajemen user dan role dalam sistem
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

      <div v-if="successMessage" class="mb-4 rounded-md bg-green-50 p-4">
        <div class="flex">
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">
              {{ successMessage }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-800">Daftar User</h2>
          <button
            @click="fetchUsers"
            class="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            Refresh
          </button>
        </div>

        <div v-if="isLoading" class="p-8 text-center">
          <svg class="animate-spin h-8 w-8 mx-auto text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-2 text-gray-600">Memuat data...</p>
        </div>

        <div v-else-if="users.length === 0" class="p-8 text-center text-gray-500">
          Tidak ada data user
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
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
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
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
                    Edit Role
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
      </div>

      <!-- Edit Role Modal -->
      <div
        v-if="showEditModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        @click.self="closeEditModal"
      >
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Edit Role: {{ selectedUser?.name }}
            </h3>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Pilih Role
              </label>
              <select
                v-model="selectedRoleId"
                class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              >
                <option value="">-- Pilih Role --</option>
                <option v-for="role in availableRoles" :key="role.id" :value="role.id">
                  {{ role.label }}
                </option>
              </select>
            </div>

            <div class="flex gap-3 mt-4">
              <button
                @click="updateUserRole"
                :disabled="!selectedRoleId || isUpdating"
                class="flex-1 px-4 py-2 bg-slate-900 text-white text-base font-medium rounded-md shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isUpdating ? 'Menyimpan...' : 'Simpan' }}
              </button>
              <button
                @click="closeEditModal"
                class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Batal
              </button>
            </div>
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
                class="flex-1 px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isDeleting ? 'Menghapus...' : 'Hapus' }}
              </button>
              <button
                @click="closeDeleteModal"
                class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
import { ref, onMounted } from 'vue';
import { useRouter, useNuxtApp } from '#app';

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

const router = useRouter();
const { $axios } = useNuxtApp();

const users = ref<User[]>([]);
const availableRoles = ref<Role[]>([]);
const isLoading = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedUser = ref<User | null>(null);
const selectedRoleId = ref('');
const userToDelete = ref<User | null>(null);

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
    if (result?.status === true) {
      availableRoles.value = result.data;
    }
  } catch (error: any) {
    console.error('Fetch roles error:', error);
    console.error('Error response:', error.response?.data);
  }
};

// Open edit modal
const openEditModal = (user: User) => {
  selectedUser.value = user;
  selectedRoleId.value = user.roles[0]?.id || '';
  showEditModal.value = true;
};

// Close edit modal
const closeEditModal = () => {
  showEditModal.value = false;
  selectedUser.value = null;
  selectedRoleId.value = '';
};

// Update user role
const updateUserRole = async () => {
  if (!selectedUser.value || !selectedRoleId.value) return;

  isUpdating.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const { data: result } = await $axios.post('/users/update/role', {
      id: selectedUser.value.id,
      role_id: selectedRoleId.value,
    });

    if (result?.status === true) {
      successMessage.value = 'Role user berhasil diperbarui';
      closeEditModal();
      await fetchUsers();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    } else {
      errorMessage.value = result?.message || 'Gagal memperbarui role user';
    }
  } catch (error: any) {
    console.error('Update role error:', error);
    console.error('Error response:', error.response?.data);
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat memperbarui role';
  } finally {
    isUpdating.value = false;
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
    const { data: result } = await $axios.delete(`/users/${userToDelete.value.id}`);

    if (result?.status === true) {
      successMessage.value = 'User berhasil dihapus';
      closeDeleteModal();
      await fetchUsers();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    } else {
      errorMessage.value = result?.message || 'Gagal menghapus user';
    }
  } catch (error: any) {
    console.error('Delete user error:', error);
    console.error('Error response:', error.response?.data);
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat menghapus user';
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
