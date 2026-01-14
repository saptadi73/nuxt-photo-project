<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div class="flex flex-col gap-2">
          <h1 class="text-2xl lg:text-5xl font-caveat font-bold text-gray-900">CMS Kategori</h1>
          <p class="text-xl lg:text-2xl font-caveat text-gray-600">Kelola kategori foto dengan tambah, edit, dan hapus.</p>
        </div>
        <button
          @click="handleLogout"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

      <!-- Alert Messages -->
      <div v-if="errorMessage" class="mb-4 rounded-md bg-red-50 p-4 text-red-800 text-sm font-medium">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="mb-4 rounded-md bg-green-50 p-4 text-green-800 text-sm font-medium">
        {{ successMessage }}
      </div>

      <!-- Kategori Table -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div class="relative w-full sm:max-w-md">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari kategori..."
              class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              @input="handleSearch"
            />
            <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            @click="openAddModal"
            class="w-full sm:w-auto px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Kategori
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="p-8 text-center">
          <svg class="animate-spin h-8 w-8 mx-auto text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-2 text-gray-600">Memuat data...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredKategori.length === 0" class="p-8 text-center text-gray-500">
          {{ searchQuery ? 'Tidak ada hasil pencarian' : 'Tidak ada data kategori' }}
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(kategori, index) in paginatedKategori" :key="kategori.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="kategori.url_foto" class="h-12 w-12 rounded overflow-hidden bg-gray-100">
                    <img :src="`${apiBaseUrl}${kategori.url_foto}`" :alt="kategori.nama" class="h-full w-full object-cover">
                  </div>
                  <div v-else class="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ kategori.nama }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-500 truncate">{{ kategori.deskripsi || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button @click="openEditModal(kategori)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button @click="confirmDelete(kategori)" class="text-red-600 hover:text-red-900">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredKategori.length) }} dari {{ filteredKategori.length }} kategori
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
              :class="currentPage === page ? 'bg-slate-900 text-white border-slate-900' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
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

      <!-- Add/Edit Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        @click.self="closeModal"
      >
        <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              {{ isEditMode ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
            </h3>
            <div v-if="isEditMode && modalForm.id" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
              <strong>ID:</strong> {{ modalForm.id }}
            </div>
            
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Form Summary (untuk debug & transparency) -->
              <div v-if="isEditMode" class="p-3 bg-gray-50 border border-gray-300 rounded text-xs">
                <strong>Data yang akan dikirim:</strong>
                <div class="mt-2 space-y-1 font-mono text-gray-700">
                  <div><strong>Nama:</strong> {{ modalForm.nama }}</div>
                  <div><strong>Deskripsi:</strong> {{ modalForm.deskripsi || '(kosong)' }}</div>
                  <div><strong>Foto:</strong> {{ modalForm.url_foto ? 'File baru dipilih' : 'Tidak ada file baru' }}</div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kategori <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="modalForm.nama"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="Masukkan nama kategori"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  v-model="modalForm.deskripsi"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="Masukkan deskripsi kategori (opsional)"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Foto Display Kategori
                  <span class="text-gray-500 text-xs">(JPG, PNG, GIF, WebP - Max 5MB)</span>
                </label>
                
                <!-- Preview Foto -->
                <div v-if="fotoPreview" class="mb-3 relative rounded-md overflow-hidden border-2 border-slate-300 bg-gray-100">
                  <img 
                    :src="fotoPreview" 
                    alt="Preview" 
                    class="w-full h-48 object-cover block"
                    @error="() => { console.error('Image failed to load'); }"
                    @load="() => { console.log('Image loaded successfully'); }"
                  >
                  
                  <!-- Overlay on hover -->
                  <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100 group">
                    <div class="flex gap-2">
                      <!-- Remove button -->
                      <button
                        type="button"
                        @click="removeFoto"
                        class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        title="Hapus foto"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Preview label -->
                  <div class="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                    ✓ Preview
                  </div>
                </div>

                <!-- File Input -->
                <div v-if="!fotoPreview" class="relative border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-slate-500 transition-colors cursor-pointer group bg-white hover:bg-gray-50">
                  <input
                    ref="fotoInputRef"
                    type="file"
                    accept="image/*"
                    @change="handleFotoChange"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div class="pointer-events-none">
                    <svg class="mx-auto h-12 w-12 text-gray-400 group-hover:text-slate-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="text-sm text-gray-600 mt-2 group-hover:text-slate-700">
                      {{ modalForm.url_foto ? 'Ubah foto' : 'Klik atau drag & drop foto' }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">JPG, PNG, GIF atau WebP (Max 5MB)</p>
                  </div>
                </div>
                
                <!-- File Input When Preview Exists - untuk change foto -->
                <div v-if="fotoPreview" class="relative mt-2 p-2 border border-dashed border-gray-300 rounded-md text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    ref="fotoInputRef"
                    type="file"
                    accept="image/*"
                    @change="handleFotoChange"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div class="pointer-events-none text-sm text-gray-600">
                    <svg class="inline h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Ubah foto
                  </div>
                </div>
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
              Konfirmasi Hapus Kategori
            </h3>
            
            <p class="text-sm text-gray-500 mb-4">
              Apakah Anda yakin ingin menghapus kategori <strong>{{ kategoriToDelete?.nama }}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div class="flex gap-3 mt-4">
              <button
                @click="deleteKategori"
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
const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl;

interface Kategori {
  id: string;
  nama: string;
  deskripsi?: string;
  url_foto?: string;
}

const kategori = ref<Kategori[]>([]);
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
const kategoriToDelete = ref<Kategori | null>(null);

const modalForm = ref({
  id: '',
  nama: '',
  deskripsi: '',
  url_foto: null as File | null
});

const fotoPreview = ref('');
const fotoInputRef = ref<HTMLInputElement | null>(null);

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    const ls = localStorage.getItem('authToken');
    if (ls) return ls;
    const match = document.cookie.match(/(?:^|; )authToken=([^;]+)/);
    if (match && match[1]) return decodeURIComponent(match[1]);
  }
  return null;
};

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

// Fetch all kategori
const fetchKategori = async () => {
  if (!checkAuth()) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const { data: result } = await $axios.get('/kategori');
    
    console.log('Fetch kategori result:', result);

    if (result?.status === true) {
      kategori.value = result.data;
      console.log('Kategori loaded:', kategori.value);
    } else {
      errorMessage.value = result?.message || 'Gagal memuat data kategori';
    }
  } catch (err: any) {
    console.error('Fetch kategori error:', err);
    console.error('Error response:', err.response?.data);
    errorMessage.value = err.response?.data?.message || 'Terjadi kesalahan saat memuat data kategori';
  } finally {
    isLoading.value = false;
  }
};

// Filtered kategori based on search
const filteredKategori = computed(() => {
  if (!searchQuery.value) {
    return kategori.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return kategori.value.filter(k => 
    k.nama.toLowerCase().includes(query) || 
    (k.deskripsi && k.deskripsi.toLowerCase().includes(query))
  );
});

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredKategori.value.length / itemsPerPage.value) || 1);

const paginatedKategori = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredKategori.value.slice(start, end);
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
    nama: '',
    deskripsi: '',
    url_foto: null
  };
  fotoPreview.value = '';
  console.log('Add modal opened - preview reset');
  showModal.value = true;
};

// Open edit modal
const openEditModal = (kat: Kategori) => {
  isEditMode.value = true;
  modalForm.value = {
    id: kat.id,
    nama: kat.nama,
    deskripsi: kat.deskripsi || '',
    url_foto: null
  };
  
  const previewUrl = kat.url_foto ? `${apiBaseUrl}${kat.url_foto}` : '';
  fotoPreview.value = previewUrl;
  
  console.log('Edit modal opened:', {
    id: kat.id,
    nama: kat.nama,
    deskripsi: kat.deskripsi,
    url_foto: kat.url_foto,
    previewUrl: previewUrl
  });
  
  showModal.value = true;
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  modalForm.value = {
    id: '',
    nama: '',
    deskripsi: '',
    url_foto: null
  };
  fotoPreview.value = '';
  if (fotoInputRef.value) {
    fotoInputRef.value.value = '';
  }
};

// Handle foto file selection
const handleFotoChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  console.log('File selected:', file?.name, 'Type:', file?.type, 'Size:', file?.size);
  
  if (file) {
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'].includes(file.type)) {
      errorMessage.value = 'Format file harus JPG, PNG, GIF, atau WebP';
      console.error('Invalid file type:', file.type);
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'Ukuran file maksimal 5MB';
      console.error('File too large:', file.size);
      return;
    }
    
    modalForm.value.url_foto = file;
    console.log('File stored in modalForm');
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      fotoPreview.value = result;
      console.log('Preview generated, length:', result.length);
    };
    reader.onerror = (e) => {
      console.error('FileReader error:', e);
    };
    reader.readAsDataURL(file);
    console.log('Reading file as DataURL...');
  } else {
    console.warn('No file selected');
  }
};

// Remove foto
const removeFoto = () => {
  modalForm.value.url_foto = null;
  fotoPreview.value = '';
  if (fotoInputRef.value) {
    fotoInputRef.value.value = '';
  }
};

// Handle form submit
const handleSubmit = async () => {
  isSaving.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    if (isEditMode.value) {
      await updateKategori();
    } else {
      await addKategori();
    }
  } finally {
    isSaving.value = false;
  }
};

// Add new kategori
const addKategori = async () => {
  try {
    const formData = new FormData();
    formData.append('nama', modalForm.value.nama);
    formData.append('deskripsi', modalForm.value.deskripsi);
    
    if (modalForm.value.url_foto) {
      formData.append('url_foto', modalForm.value.url_foto);
    }

    const { data: result } = await $axios.post('/kategori', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (result?.status === true) {
      successMessage.value = 'Kategori berhasil ditambahkan';
      closeModal();
      await fetchKategori();
      
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    } else {
      errorMessage.value = result?.message || 'Gagal menambahkan kategori';
    }
  } catch (error: any) {
    console.error('Add kategori error:', error);
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat menambahkan kategori';
  }
};

// Update kategori
const updateKategori = async () => {
  try {
    // Validate nama
    if (!modalForm.value.nama || modalForm.value.nama.trim().length === 0) {
      errorMessage.value = 'Nama kategori harus diisi';
      return;
    }

    const formData = new FormData();
    // PENTING: Tambahkan _method=PUT untuk FormData update
    formData.append('_method', 'PUT');
    formData.append('nama', modalForm.value.nama.trim());
    formData.append('deskripsi', modalForm.value.deskripsi?.trim() || '');
    
    if (modalForm.value.url_foto) {
      formData.append('url_foto', modalForm.value.url_foto);
    }

    // Debug logging
    console.log('Update kategori dengan data:', {
      id: modalForm.value.id,
      nama: modalForm.value.nama,
      deskripsi: modalForm.value.deskripsi,
      url_foto: modalForm.value.url_foto ? 'File dipilih' : 'Tidak ada file'
    });

    // PENTING: Gunakan POST method dengan _method=PUT di FormData
    const { data: result } = await $axios.post(`/kategori/${modalForm.value.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Update response:', result);

    if (result?.status === true) {
      // Verify response data
      console.log('Response kategori data:', {
        nama: result.data?.nama,
        deskripsi: result.data?.deskripsi,
        url_foto: result.data?.url_foto
      });
      
      successMessage.value = 'Kategori berhasil diupdate';
      closeModal();
      await fetchKategori();
      
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    } else {
      errorMessage.value = result?.message || 'Gagal mengupdate kategori';
    }
  } catch (error: any) {
    console.error('Update kategori error:', error);
    console.error('Error response:', error.response?.data);
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat mengupdate kategori';
  }
};

// Confirm delete kategori
const confirmDelete = (kat: Kategori) => {
  kategoriToDelete.value = kat;
  showDeleteModal.value = true;
};

// Close delete modal
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  kategoriToDelete.value = null;
};

// Delete kategori
const deleteKategori = async () => {
  if (!kategoriToDelete.value) return;

  isDeleting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const { data: result } = await $axios.delete(`/kategori/${kategoriToDelete.value.id}`);

    if (result?.status === true) {
      successMessage.value = 'Kategori berhasil dihapus';
      closeDeleteModal();
      await fetchKategori();
      
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    } else {
      errorMessage.value = result?.message || 'Gagal menghapus kategori';
    }
  } catch (error: any) {
    console.error('Delete kategori error:', error);
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat menghapus kategori';
  } finally {
    isDeleting.value = false;
  }
};

// Handle logout
const handleLogout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  }
};

// Initialize component
onMounted(() => {
  fetchKategori();
});
</script>
