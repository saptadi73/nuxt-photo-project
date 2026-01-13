<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl font-bold text-gray-900">CMS Foto</h1>
          <p class="text-sm text-gray-600">Kelola foto: tambah, edit, hapus, dengan pencarian dan pagination.</p>
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

      <div v-if="errorMessage" class="mb-4 rounded-md bg-red-50 p-4 text-red-800 text-sm font-medium">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="mb-4 rounded-md bg-green-50 p-4 text-green-800 text-sm font-medium">
        {{ successMessage }}
      </div>

      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div class="relative w-full sm:max-w-md">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari foto (judul)..."
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
            Tambah Foto
          </button>
        </div>

        <div v-if="isLoading" class="p-8 text-center">
          <svg class="animate-spin h-8 w-8 mx-auto text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-2 text-gray-600">Memuat data...</p>
        </div>

        <div v-else-if="filteredPhotos.length === 0" class="p-8 text-center text-gray-500">
          {{ searchQuery ? 'Tidak ada hasil pencarian' : 'Tidak ada data foto' }}
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rental</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(foto, index) in paginatedPhotos" :key="foto.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ foto.judul }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-700">
                    {{ getKategoriName(foto.id_kategori) || '-' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  Rp {{ formatNumber(foto.harga) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <img
                    v-if="foto.url_thumbnail"
                    :src="getImageUrl(foto.url_thumbnail)"
                    :alt="foto.judul"
                    class="h-12 w-12 object-cover rounded-md border"
                  />
                  <span v-else class="text-xs text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="foto.is_rental ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ foto.is_rental ? 'Rental' : 'Beli' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button @click="openEditModal(foto)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button @click="confirmDelete(foto)" class="text-red-600 hover:text-red-900">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredPhotos.length) }} dari {{ filteredPhotos.length }} foto
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
        <div class="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                {{ isEditMode ? 'Edit Foto' : 'Tambah Foto' }}
              </h3>
              <p class="text-sm text-gray-500">Unggah thumbnail, watermark, dan file download.</p>
            </div>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Judul <span class="text-red-500">*</span></label>
                <input
                  v-model="modalForm.judul"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Harga (Rp) <span class="text-red-500">*</span></label>
                <input
                  v-model="modalForm.harga"
                  type="number"
                  min="0"
                  step="1000"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <div class="relative">
                  <input
                    v-model="kategoriSearch"
                    @focus="showKategoriDropdown = true"
                    @blur="closeKategoriDropdown"
                    type="text"
                    placeholder="Cari kategori..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  />
                  <svg class="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  
                  <!-- Kategori Dropdown -->
                  <div
                    v-show="showKategoriDropdown && filteredKategoriList.length > 0"
                    class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto"
                  >
                    <div
                      v-for="kat in filteredKategoriList"
                      :key="kat.id"
                      @click="selectKategori(kat)"
                      class="px-3 py-2 cursor-pointer hover:bg-slate-100 border-b border-gray-100 last:border-b-0"
                    >
                      <div class="text-sm font-medium text-gray-900">{{ kat.nama }}</div>
                      <div v-if="kat.deskripsi" class="text-xs text-gray-500">{{ kat.deskripsi }}</div>
                    </div>
                  </div>

                  <!-- Selected Kategori Display -->
                  <div v-if="selectedKategoriDisplay" class="mt-2">
                    <span class="inline-block px-3 py-1 bg-slate-100 text-slate-800 text-sm rounded-md">
                      {{ selectedKategoriDisplay.nama }}
                      <button
                        type="button"
                        @click="clearKategori"
                        class="ml-2 text-slate-600 hover:text-slate-900"
                      >
                        ✕
                      </button>
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2 pt-6">
                <input id="is_rental" v-model="modalForm.is_rental" type="checkbox" class="h-4 w-4 text-slate-900 border-gray-300 rounded" />
                <label for="is_rental" class="text-sm text-gray-700">Tersedia untuk rental</label>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <!-- Thumbnail Upload & Preview -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Thumbnail (300x300)</label>
                
                <!-- Preview -->
                <div v-if="previewThumbnail" class="mb-3 relative">
                  <img :src="previewThumbnail" alt="Thumbnail Preview" class="w-full h-40 object-cover rounded-md border border-gray-300">
                  <button
                    type="button"
                    @click="() => { previewThumbnail = ''; modalForm.foto_thumbnail = null; }"
                    class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <!-- File Input -->
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="onFileChange($event, 'foto_thumbnail')" 
                  class="w-full text-sm border border-gray-300 rounded px-2 py-1"
                />
                <p v-if="isEditMode && modalForm.url_thumbnail && !previewThumbnail" class="text-xs text-gray-500 mt-1">
                  File ada: {{ modalForm.url_thumbnail }}
                </p>
              </div>

              <!-- Watermark Upload & Preview -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Watermark</label>
                
                <!-- Preview -->
                <div v-if="previewWatermark" class="mb-3 relative">
                  <img :src="previewWatermark" alt="Watermark Preview" class="w-full h-40 object-cover rounded-md border border-gray-300">
                  <button
                    type="button"
                    @click="() => { previewWatermark = ''; modalForm.foto_watermark = null; }"
                    class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <!-- File Input -->
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="onFileChange($event, 'foto_watermark')" 
                  class="w-full text-sm border border-gray-300 rounded px-2 py-1"
                />
                <p v-if="isEditMode && modalForm.url_watermark && !previewWatermark" class="text-xs text-gray-500 mt-1">
                  File ada: {{ modalForm.url_watermark }}
                </p>
              </div>

              <!-- Download File Upload & Preview -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">File Download</label>
                
                <!-- Preview -->
                <div v-if="previewDownload" class="mb-3 relative">
                  <img :src="previewDownload" alt="Download Preview" class="w-full h-40 object-cover rounded-md border border-gray-300">
                  <button
                    type="button"
                    @click="() => { previewDownload = ''; modalForm.foto_download = null; }"
                    class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <!-- File Input -->
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="onFileChange($event, 'foto_download')" 
                  class="w-full text-sm border border-gray-300 rounded px-2 py-1"
                />
                <p v-if="isEditMode && modalForm.url_download && !previewDownload" class="text-xs text-gray-500 mt-1">
                  File ada: {{ modalForm.url_download }}
                </p>
              </div>
            </div>

            <div class="flex gap-3 pt-2">
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
                class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 text-base font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Modal -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        @click.self="closeDeleteModal"
      >
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Konfirmasi Hapus</h3>
            <p class="text-sm text-gray-500 mb-4">Hapus foto "{{ photoToDelete?.judul }}"? Tindakan ini tidak dapat dibatalkan.</p>
            <div class="flex gap-3">
              <button
                @click="deletePhoto"
                :disabled="isDeleting"
                class="flex-1 px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isDeleting ? 'Menghapus...' : 'Hapus' }}
              </button>
              <button
                @click="closeDeleteModal"
                class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 text-base font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
import { useRouter, useRuntimeConfig, useNuxtApp } from '#app';

interface FotoItem {
  id: string;
  judul: string;
  harga: number | string;
  id_kategori?: string;
  url_thumbnail?: string;
  url_watermark?: string;
  url_download?: string;
  is_active?: boolean;
  is_rental?: boolean;
}

const router = useRouter();
const config = useRuntimeConfig();
const { $axios } = useNuxtApp();

const photos = ref<FotoItem[]>([]);
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
const photoToDelete = ref<FotoItem | null>(null);

const modalForm = ref({
  id: '',
  judul: '',
  harga: 0,
  id_kategori: '',
  is_rental: false,
  foto_thumbnail: null as File | null,
  foto_watermark: null as File | null,
  foto_download: null as File | null,
  url_thumbnail: '',
  url_watermark: '',
  url_download: ''
});

// Preview URLs state
const previewThumbnail = ref('');
const previewWatermark = ref('');
const previewDownload = ref('');

// Kategori search state
const kategoriSearch = ref('');
const showKategoriDropdown = ref(false);
const selectedKategoriId = ref('');
const kategoriList = ref<Array<{id: string; nama: string; deskripsi?: string}>>([]);

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
    setTimeout(() => router.push('/login'), 1500);
    return false;
  }
  return true;
};

const formatNumber = (value: number | string) => new Intl.NumberFormat('id-ID').format(Number(value || 0));

const getImageUrl = (path?: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${config.public.apiBaseUrl}${path}`;
};

const filteredPhotos = computed(() => {
  if (!searchQuery.value) return photos.value;
  const q = searchQuery.value.toLowerCase();
  return photos.value.filter((f) => f.judul.toLowerCase().includes(q));
});

const filteredKategoriList = computed(() => {
  if (!kategoriSearch.value.trim()) {
    return kategoriList.value;
  }
  const query = kategoriSearch.value.toLowerCase();
  return kategoriList.value.filter(k => 
    k.nama.toLowerCase().includes(query) || 
    (k.deskripsi && k.deskripsi.toLowerCase().includes(query))
  );
});

const selectedKategoriDisplay = computed(() => {
  if (!selectedKategoriId.value) return null;
  return kategoriList.value.find(k => k.id === selectedKategoriId.value) || null;
});

const totalPages = computed(() => Math.ceil(filteredPhotos.value.length / itemsPerPage.value) || 1);

const paginatedPhotos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredPhotos.value.slice(start, start + itemsPerPage.value);
});

const displayedPages = computed(() => {
  const pages: number[] = [];
  const maxPages = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2));
  let end = Math.min(totalPages.value, start + maxPages - 1);
  if (end - start < maxPages - 1) start = Math.max(1, end - maxPages + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

const handleSearch = () => {
  currentPage.value = 1;
};

const fetchPhotos = async () => {
  if (!checkAuth()) return;
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const { data: result } = await $axios.get('/foto');
    
    console.log('Fetch photos result:', result);
    
    if (result?.status === true || result?.success) {
      photos.value = result.data || result;
      console.log('Photos loaded:', photos.value);
    } else {
      errorMessage.value = result?.message || 'Gagal memuat data foto';
    }
  } catch (err: any) {
    console.error('Fetch foto error:', err);
    console.error('Error response:', err.response?.data);
    errorMessage.value = err.response?.data?.message || 'Terjadi kesalahan saat memuat data foto';
  } finally {
    isLoading.value = false;
  }
};

const openAddModal = () => {
  isEditMode.value = false;
  kategoriSearch.value = '';
  selectedKategoriId.value = '';
  previewThumbnail.value = '';
  previewWatermark.value = '';
  previewDownload.value = '';
  modalForm.value = {
    id: '',
    judul: '',
    harga: 0,
    id_kategori: '',
    is_rental: false,
    foto_thumbnail: null,
    foto_watermark: null,
    foto_download: null,
    url_thumbnail: '',
    url_watermark: '',
    url_download: ''
  };
  showModal.value = true;
};

const openEditModal = (foto: FotoItem) => {
  isEditMode.value = true;
  kategoriSearch.value = '';
  selectedKategoriId.value = foto.id_kategori || '';
  previewThumbnail.value = foto.url_thumbnail ? getImageUrl(foto.url_thumbnail) : '';
  previewWatermark.value = foto.url_watermark ? getImageUrl(foto.url_watermark) : '';
  previewDownload.value = foto.url_download ? getImageUrl(foto.url_download) : '';
  modalForm.value = {
    id: foto.id,
    judul: foto.judul,
    harga: Number(foto.harga || 0),
    id_kategori: foto.id_kategori || '',
    is_rental: !!foto.is_rental,
    foto_thumbnail: null,
    foto_watermark: null,
    foto_download: null,
    url_thumbnail: foto.url_thumbnail || '',
    url_watermark: foto.url_watermark || '',
    url_download: foto.url_download || ''
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  kategoriSearch.value = '';
  selectedKategoriId.value = '';
  showKategoriDropdown.value = false;
  previewThumbnail.value = '';
  previewWatermark.value = '';
  previewDownload.value = '';
};

const onFileChange = (event: Event, key: 'foto_thumbnail' | 'foto_watermark' | 'foto_download') => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  (modalForm.value as any)[key] = file;
  
  // Generate preview
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      if (key === 'foto_thumbnail') previewThumbnail.value = preview;
      else if (key === 'foto_watermark') previewWatermark.value = preview;
      else if (key === 'foto_download') previewDownload.value = preview;
    };
    reader.readAsDataURL(file);
  }
};

const buildFormData = () => {
  const fd = new FormData();
  fd.append('judul', modalForm.value.judul);
  fd.append('harga', String(modalForm.value.harga));
  if (modalForm.value.id_kategori) fd.append('id_kategori', modalForm.value.id_kategori);
  fd.append('is_rental', String(modalForm.value.is_rental));
  if (modalForm.value.foto_thumbnail) fd.append('foto_thumbnail', modalForm.value.foto_thumbnail);
  if (modalForm.value.foto_watermark) fd.append('foto_watermark', modalForm.value.foto_watermark);
  if (modalForm.value.foto_download) fd.append('foto_download', modalForm.value.foto_download);
  
  console.log('📋 BuildFormData - Modal Form Value:', {
    id: modalForm.value.id,
    judul: modalForm.value.judul,
    harga: modalForm.value.harga,
    id_kategori: modalForm.value.id_kategori,
    is_rental: modalForm.value.is_rental,
    foto_thumbnail: modalForm.value.foto_thumbnail ? {
      name: modalForm.value.foto_thumbnail.name,
      size: modalForm.value.foto_thumbnail.size,
      type: modalForm.value.foto_thumbnail.type
    } : null,
    foto_watermark: modalForm.value.foto_watermark ? {
      name: modalForm.value.foto_watermark.name,
      size: modalForm.value.foto_watermark.size,
      type: modalForm.value.foto_watermark.type
    } : null,
    foto_download: modalForm.value.foto_download ? {
      name: modalForm.value.foto_download.name,
      size: modalForm.value.foto_download.size,
      type: modalForm.value.foto_download.type
    } : null
  });
  
  return fd;
};

const handleSubmit = async () => {
  isSaving.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  try {
    if (isEditMode.value) await updatePhoto();
    else await addPhoto();
  } finally {
    isSaving.value = false;
  }
};

const addPhoto = async () => {
  try {
    const { data: result } = await $axios.post('/foto', buildFormData());
    if (result?.status === true || result?.success) {
      successMessage.value = 'Foto berhasil ditambahkan';
      closeModal();
      await fetchPhotos();
      setTimeout(() => (successMessage.value = ''), 2500);
    } else {
      errorMessage.value = result?.message || 'Gagal menambahkan foto';
    }
  } catch (err: any) {
    console.error('Add foto error:', err);
    errorMessage.value = err.response?.data?.message || 'Terjadi kesalahan saat menambahkan foto';
  }
};

const updatePhoto = async () => {
  try {
    console.log('🔄 Mulai update foto untuk ID:', modalForm.value.id);
    
    const formData = buildFormData();
    // PENTING: Tambahkan _method=PUT untuk FormData dengan file upload
    formData.append('_method', 'PUT');
    
    console.log('📤 Mengirim POST request (dengan _method=PUT) ke /foto/' + modalForm.value.id);
    // Gunakan POST + _method=PUT karena PUT tidak support multipart/form-data dengan baik
    const { data: result } = await $axios.post(`/foto/${modalForm.value.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('✅ Update response received:', {
      status: result?.status,
      success: result?.success,
      message: result?.message,
      dataReceived: !!result?.data
    });
    
    if (result?.data) {
      console.log('📸 Response data:', {
        judul: result.data?.judul,
        harga: result.data?.harga,
        url_thumbnail: result.data?.url_thumbnail,
        url_watermark: result.data?.url_watermark,
        url_download: result.data?.url_download
      });
    }
    
    if (result?.status === true || result?.success) {
      successMessage.value = 'Foto berhasil diperbarui';
      closeModal();
      await fetchPhotos();
      setTimeout(() => (successMessage.value = ''), 2500);
    } else {
      errorMessage.value = result?.message || 'Gagal memperbarui foto';
    }
  } catch (err: any) {
    console.error('❌ Update foto error:', err);
    console.error('🔍 Error response data:', err.response?.data);
    console.error('🔍 Error status:', err.response?.status);
    console.error('🔍 Full error config:', {
      method: err.config?.method,
      url: err.config?.url,
      dataKeys: Object.keys(err.config?.data || {})
    });
    errorMessage.value = err.response?.data?.message || 'Terjadi kesalahan saat memperbarui foto';
  }
};

const confirmDelete = (foto: FotoItem) => {
  photoToDelete.value = foto;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  photoToDelete.value = null;
};

const deletePhoto = async () => {
  if (!photoToDelete.value) return;
  isDeleting.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  try {
    const { data: result } = await $axios.delete(`/foto/${photoToDelete.value.id}`);
    if (result?.status === true || result?.success) {
      successMessage.value = 'Foto berhasil dihapus';
      closeDeleteModal();
      await fetchPhotos();
      setTimeout(() => (successMessage.value = ''), 2500);
    } else {
      errorMessage.value = result?.message || 'Gagal menghapus foto';
    }
  } catch (err: any) {
    console.error('Delete foto error:', err);
    errorMessage.value = err.response?.data?.message || 'Terjadi kesalahan saat menghapus foto';
  } finally {
    isDeleting.value = false;
  }
};

const handleLogout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  }
};

// Kategori selection functions
const selectKategori = (kat: {id: string; nama: string; deskripsi?: string}) => {
  selectedKategoriId.value = kat.id;
  modalForm.value.id_kategori = kat.id;
  kategoriSearch.value = '';
  showKategoriDropdown.value = false;
};

const clearKategori = () => {
  selectedKategoriId.value = '';
  modalForm.value.id_kategori = '';
  kategoriSearch.value = '';
};

// Close kategori dropdown with delay
const closeKategoriDropdown = () => {
  setTimeout(() => {
    showKategoriDropdown.value = false;
  }, 200);
};

// Fetch kategori
const fetchKategori = async () => {
  try {
    const { data: result } = await $axios.get('/kategori');
    if (result?.status === true) {
      kategoriList.value = result.data || [];
      console.log('Kategori loaded:', kategoriList.value);
    }
  } catch (err) {
    console.error('Fetch kategori error:', err);
  }
};

// Get kategori name by ID
const getKategoriName = (id: string | null | undefined) => {
  if (!id) return null;
  const kat = kategoriList.value.find(k => k.id === id);
  return kat?.nama || null;
};

onMounted(() => {
  fetchPhotos();
  fetchKategori();
});
</script>
