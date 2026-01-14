<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <header class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl lg:text-5xl font-black font-caveat text-slate-900 tracking-tight">Gallery</h1>
          <p class="text-gray-500 font-caveat text-xl lg:text-2xl">Dalam Banyak Kategori</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right mr-2">
            <p class="text-[10px] uppercase font-bold text-gray-400">Dipilih</p>
            <p class="text-xl font-black text-slate-900">{{ selectedPhotos.length }}</p>
          </div>
          <button 
            v-if="selectedPhotos.length > 0"
            @click="goToCheckout"
            class="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            Checkout
          </button>
        </div>
      </div>
    </header>

    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div class="flex-1 min-w-[250px] relative">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari judul atau nuansa..." 
            class="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
          />
        </div>

        <select 
          v-model="selectedCategory" 
          class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none bg-white min-w-[160px]"
        >
          <option value="">Semua Kategori</option>
          <option v-for="cat in availableCategories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>

        <select 
          v-model="sortBy" 
          class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none bg-white"
        >
          <option value="newest">Terbaru</option>
          <option value="price-low">Harga Terendah</option>
          <option value="price-high">Harga Tertinggi</option>
        </select>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-400 font-medium">Membuka Galeri...</p>
      </div>

      <div v-else-if="filteredPhotos.length === 0" class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
        <p class="text-gray-400">Tidak ada foto yang sesuai dengan kriteria Anda.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div 
          v-for="photo in filteredPhotos" 
          :key="photo.id" 
          class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
        >
          <div 
            class="relative h-64 overflow-hidden bg-gray-100 cursor-zoom-in"
            @click="selectedPreview = photo"
          >
            <img 
              :src="getPhotoImageUrl(photo)" 
              :alt="photo.judul" 
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-slate-900 shadow-xl">
                Preview
              </span>
            </div>
            <div class="absolute top-4 left-4">
              <span class="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter text-slate-900 shadow-sm">
                {{ photo.kategori?.nama }}
              </span>
            </div>
          </div>

          <div class="p-5">
            <h3 class="font-bold text-slate-900 text-lg line-clamp-1 mb-1">{{ photo.judul }}</h3>
            <p class="text-slate-900 font-black text-xl">
              Rp {{ formatPrice(photo.harga) }}
            </p>
            
            <button 
              @click="togglePhotoSelection(photo)"
              :class="[
                'w-full mt-4 py-3 rounded-xl font-bold transition-all duration-300 active:scale-95',
                isPhotoSelected(photo.id) 
                  ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md'
              ]"
            >
              {{ isPhotoSelected(photo.id) ? 'Batal Pilih' : 'Pilih Foto' }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <Transition name="fade">
      <div 
        v-if="selectedPreview" 
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10 overflow-y-auto"
        @click.self="selectedPreview = null"
      >
        <button 
          @click="selectedPreview = null" 
          class="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2"
        >
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="max-w-6xl w-full flex flex-col items-center">
          <img 
            :src="getWatermarkUrl(selectedPreview)" 
            class="max-h-[75vh] w-auto shadow-2xl rounded-sm object-contain"
            :alt="selectedPreview.judul"
          />
          
          <div class="mt-8 text-center max-w-2xl">
            <h2 class="text-3xl font-bold text-white mb-2">{{ selectedPreview.judul }}</h2>
            <p class="text-gray-400 italic text-sm leading-relaxed px-4">
              "{{ selectedPreview.kategori?.deskripsi }}"
            </p>
            
            <div class="mt-8 flex items-center justify-center gap-6">
              <p class="text-2xl font-black text-white">Rp {{ formatPrice(selectedPreview.harga) }}</p>
              <button 
                @click="togglePhotoSelection(selectedPreview); selectedPreview = null"
                :class="[
                  'px-8 py-3 rounded-full font-bold transition-all active:scale-95',
                  isPhotoSelected(selectedPreview.id) ? 'bg-red-500 text-white' : 'bg-white text-black hover:bg-gray-200'
                ]"
              >
                {{ isPhotoSelected(selectedPreview.id) ? 'Hapus dari Pilihan' : 'Pilih Foto Ini' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import  { useSEO } from '~/composables/useSEO';
import cityimage from '~/assets/images/cityscape6.jpg';


// SEO Setup
useSEO({
  title: 'Pilih Foto | Judynata Fotografi',
  description: 'Menyelami ruang hening, di mana cahaya hitam putih merangkum emosi yang tidak terucap. Empat hal dibawah ini merangkum lintasan ide Judynata tentang solitude, abstraksi, dan ketulusan visual.',
  keywords: 'keheningan, hitam putih, fotografi, judynata, solitude, abstraksi, visual, seni, makna, emosi',
  image: cityimage,
  url: 'https://judynatafotografi.com/',
  type: 'website'
});

// CONFIGURATION
const config = useRuntimeConfig()
const BASE_URL = config.public.apiBaseUrl || 'http://localhost:8000'

// STATES
const photos = ref<any[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('newest')
const selectedPhotos = ref<any[]>([])
const selectedPreview = ref<any>(null)
const showCheckout = ref(false)

// FETCH DATA
const fetchPhotos = async () => {
  try {
    isLoading.value = true
    const response = await fetch(`${BASE_URL}/foto`)
    const result = await response.json()
    
    // API Handle: mendeteksi apakah array langsung atau dibungkus .data
    photos.value = Array.isArray(result) ? result : (result.data || [])
  } catch (error) {
    console.error('API Error:', error)
  } finally {
    isLoading.value = false
  }
}

// COMPUTED PROPERTIES
const availableCategories = computed(() => {
  const cats = photos.value.map(p => p.kategori?.nama).filter(Boolean)
  return [...new Set(cats)]
})

const filteredPhotos = computed(() => {
  let res = [...photos.value]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    res = res.filter(p => 
      p.judul.toLowerCase().includes(q) || 
      p.kategori?.nama.toLowerCase().includes(q)
    )
  }

  if (selectedCategory.value) {
    res = res.filter(p => p.kategori?.nama === selectedCategory.value)
  }

  res.sort((a, b) => {
    const priceA = parseFloat(a.harga || 0)
    const priceB = parseFloat(b.harga || 0)
    if (sortBy.value === 'price-low') return priceA - priceB
    if (sortBy.value === 'price-high') return priceB - priceA
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return res
})

// HELPERS
const getPhotoImageUrl = (photo: any) => {
  if (!photo.url_thumbnail) return 'https://placehold.co/600x400?text=No+Image'
  return `${BASE_URL}${photo.url_thumbnail}`
}

const getWatermarkUrl = (photo: any) => {
  if (!photo || !photo.url_watermark) return 'https://placehold.co/1200x800?text=Preview+Not+Available'
  return `${BASE_URL}${photo.url_watermark}`
}

const formatPrice = (price: any) => {
  return new Intl.NumberFormat('id-ID').format(parseFloat(price || 0))
}

const isPhotoSelected = (id: string) => selectedPhotos.value.some(p => p.id === id)

const togglePhotoSelection = (photo: any) => {
  const idx = selectedPhotos.value.findIndex(p => p.id === photo.id)
  if (idx > -1) {
    selectedPhotos.value.splice(idx, 1)
  } else {
    // Store complete photo data: id_foto, judul, harga
    selectedPhotos.value.push({
      id: photo.id,
      id_foto: photo.id,
      judul: photo.judul,
      harga: parseFloat(photo.harga || 0),
      url_thumbnail: photo.url_thumbnail,
      kategori: photo.kategori
    })
  }
}

const goToCheckout = () => {
  // Navigate to sales-order page with selected photos
  navigateTo({
    path: '/sales-order',
    query: {
      photos: JSON.stringify(selectedPhotos.value)
    }
  })
}

// KEYBOARD ESCAPE HANDLER
const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape') selectedPreview.value = null
}

onMounted(() => {
  fetchPhotos()
  window.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Modal Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Hide scrollbar when modal is open can be done via watch on selectedPreview if needed */
</style>