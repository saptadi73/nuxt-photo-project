<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <header class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center gap-4">
          <button 
            @click="$router.back()"
            class="text-gray-600 hover:text-slate-900 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-4xl lg:text-5xl font-black font-caveat text-slate-900 tracking-tight">Sales Order</h1>
            <p class="text-gray-500 font-caveat text-lg">Lengkapi Data Pembelian</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <!-- Selected Photos Summary -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 class="text-2xl font-bold text-slate-900 mb-4">Foto yang Dipilih ({{ selectedPhotos.length }})</h2>
        
        <div v-if="selectedPhotos.length === 0" class="text-center py-8 text-gray-400">
          <p>Tidak ada foto yang dipilih</p>
          <button 
            @click="$router.push('/pilih-foto')"
            class="mt-4 bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition-all"
          >
            Pilih Foto
          </button>
        </div>

        <div v-else class="space-y-3">
          <div 
            v-for="(photo, index) in selectedPhotos" 
            :key="photo.id"
            class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
          >
            <img 
              :src="getPhotoImageUrl(photo)" 
              :alt="photo.judul" 
              class="w-20 h-20 object-cover rounded-lg"
            />
            <div class="flex-1">
              <h3 class="font-bold text-slate-900">{{ photo.judul }}</h3>
              <p class="text-sm text-gray-500">{{ photo.kategori?.nama }}</p>
            </div>
            <div class="text-right">
              <p class="font-black text-slate-900">Rp {{ formatPrice(photo.harga) }}</p>
              <button 
                @click="removePhoto(index)"
                class="text-xs text-red-600 hover:text-red-700 mt-1"
              >
                Hapus
              </button>
            </div>
          </div>

          <div class="border-t pt-4 mt-4">
            <div class="flex justify-between items-center text-lg">
              <span class="font-bold text-slate-900">Total:</span>
              <span class="font-black text-2xl text-slate-900">Rp {{ formatPrice(totalAmount) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Login Required Toast -->
      <Transition name="slide-down">
        <div 
          v-if="showLoginToast && !isLoggedIn"
          @click="goToLogin"
          class="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-lg p-6 mb-6 cursor-pointer hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold mb-2">Login Diperlukan</h3>
              <p class="text-white/90 mb-3">
                Anda belum login! Silakan login terlebih dahulu untuk melanjutkan pembelian.
              </p>
              <div class="flex items-center gap-2 text-sm font-semibold">
                <span>Klik di sini untuk login</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Buyer Information Form -->
      <div v-if="selectedPhotos.length > 0 && isLoggedIn" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-2xl font-bold text-slate-900 mb-6">Data Pembeli</h2>
        
        <form @submit.prevent="submitOrder" class="space-y-5">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Nama Lengkap <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="buyerInfo.nama_pembeli"
              type="text" 
              required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Alamat Lengkap <span class="text-red-500">*</span>
            </label>
            <textarea 
              v-model="buyerInfo.alamat"
              required
              rows="3"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none resize-none"
              placeholder="Jl. Sudirman No. 123, Jakarta"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              No. HP/WhatsApp <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="buyerInfo.no_hp"
              type="tel" 
              required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
              placeholder="081234567890"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Email (Opsional)
            </label>
            <input 
              v-model="buyerInfo.email"
              type="email" 
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
              placeholder="john@example.com"
            />
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {{ errorMessage }}
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
            {{ successMessage }}
          </div>

          <!-- Submit Button -->
          <button 
            type="submit"
            :disabled="isSubmitting || selectedPhotos.length === 0"
            :class="[
              'w-full py-4 rounded-xl font-bold transition-all shadow-md',
              isSubmitting || selectedPhotos.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
            ]"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Memproses Order...
            </span>
            <span v-else>Buat Sales Order (Rp {{ formatPrice(totalAmount) }})</span>
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// CONFIGURATION
const config = useRuntimeConfig()
const BASE_URL = config.public.apiBaseUrl || 'http://localhost:8000'
const route = useRoute()
const router = useRouter()

// STATES
const selectedPhotos = ref<any[]>([])
const buyerInfo = ref({
  nama_pembeli: '',
  alamat: '',
  no_hp: '',
  email: ''
})
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showLoginToast = ref(false)
const isLoggedIn = ref(false)

// COMPUTED
const totalAmount = computed(() => {
  return selectedPhotos.value.reduce((sum, photo) => sum + parseFloat(photo.harga || 0), 0)
})

// METHODS
const getPhotoImageUrl = (photo: any) => {
  if (!photo.url_thumbnail) return 'https://placehold.co/600x400?text=No+Image'
  return `${BASE_URL}${photo.url_thumbnail}`
}

const formatPrice = (price: any) => {
  return new Intl.NumberFormat('id-ID').format(parseFloat(price || 0))
}

const removePhoto = (index: number) => {
  selectedPhotos.value.splice(index, 1)
  if (selectedPhotos.value.length === 0) {
    router.push('/pilih-foto')
  }
}

const submitOrder = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isSubmitting.value = true

  try {
    // Step 1: Create Sale Order Header
    const orderData: any = {
      tanggal: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      nama_pembeli: buyerInfo.value.nama_pembeli,
      alamat: buyerInfo.value.alamat,
      no_hp: buyerInfo.value.no_hp,
      status: 'pending'
    }

    // Add optional fields only if they have values
    if (buyerInfo.value.email) {
      orderData.email = buyerInfo.value.email
    }

    const memberIdMember = localStorage.getItem('memberIdMember')
    if (memberIdMember) {
      orderData.id_member = memberIdMember
    }

    console.log('=== SUBMIT ORDER DATA ===')
    console.log('Order Data:', orderData)
    console.log('JSON String:', JSON.stringify(orderData))

    const orderResponse = await fetch(`${BASE_URL}/sale-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })

    console.log('=== ORDER RESPONSE ===')
    console.log('Status:', orderResponse.status)
    console.log('OK:', orderResponse.ok)

    if (!orderResponse.ok) {
      throw new Error('Gagal membuat sales order')
    }

    const orderResult = await orderResponse.json()
    const orderId = orderResult.data.id

    // Step 2: Add Line Items for each selected photo
    for (const photo of selectedPhotos.value) {
      const lineItemData = {
        id_foto: photo.id_foto,
        nama_foto: photo.judul,
        harga: parseFloat(photo.harga),
        qty: 1
      }

      const lineResponse = await fetch(`${BASE_URL}/sale-orders/${orderId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(lineItemData)
      })

      if (!lineResponse.ok) {
        console.error('Gagal menambahkan line item:', photo.judul)
      }
    }

    // Step 3: Recalculate Total
    await fetch(`${BASE_URL}/sale-orders/${orderId}/recalculate-total`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    successMessage.value = `Sales Order berhasil dibuat! Order ID: ${orderId}`
    
    // Clear form and photos after 2 seconds, then redirect
    setTimeout(() => {
      selectedPhotos.value = []
      buyerInfo.value = {
        nama_pembeli: '',
        alamat: '',
        no_hp: '',
        email: ''
      }
      router.push('/pilih-foto')
    }, 2000)

  } catch (error: any) {
    errorMessage.value = error.message || 'Terjadi kesalahan saat membuat order'
    console.error('Order submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const goToLogin = () => {
  // Save selected photos to localStorage before redirecting to login
  if (selectedPhotos.value.length > 0) {
    localStorage.setItem('pendingOrderPhotos', JSON.stringify(selectedPhotos.value))
  }
  router.push('/login-pelanggan')
}

// LIFECYCLE
onMounted(() => {
  // Get selected photos from query parameter
  const photosParam = route.query.photos as string
  if (photosParam) {
    try {
      selectedPhotos.value = JSON.parse(photosParam)
    } catch (error) {
      console.error('Failed to parse photos data:', error)
      router.push('/pilih-foto')
    }
  } else {
    // Check if there are pending photos from localStorage
    const pendingPhotos = localStorage.getItem('pendingOrderPhotos')
    if (pendingPhotos) {
      try {
        selectedPhotos.value = JSON.parse(pendingPhotos)
      } catch (error) {
        router.push('/pilih-foto')
      }
    } else {
      router.push('/pilih-foto')
    }
  }

  // Check if user is logged in
  if (typeof window !== 'undefined') {
    const memberToken = localStorage.getItem('memberToken')
    
    if (memberToken) {
      isLoggedIn.value = true
      
      // Auto-fill buyer info from logged-in member data
      const memberName = localStorage.getItem('memberName')
      const memberNoHp = localStorage.getItem('memberNoHp')
      const memberAlamat = localStorage.getItem('memberAlamat')
      const memberEmail = localStorage.getItem('memberEmail')
      const memberIdMember = localStorage.getItem('memberIdMember')  // NEW: get id_member

      if (memberName) {
        buyerInfo.value.nama_pembeli = memberName
      }
      if (memberNoHp) {
        buyerInfo.value.no_hp = memberNoHp
      }
      if (memberAlamat) {
        buyerInfo.value.alamat = memberAlamat
      }
      if (memberEmail) {
        buyerInfo.value.email = memberEmail
      }

      // Clear pending photos since user is now logged in
      localStorage.removeItem('pendingOrderPhotos')
    } else {
      // User not logged in - show toast notification
      isLoggedIn.value = false
      showLoginToast.value = true
    }
  }
})
</script>

<style scoped>
/* Toast Slide Down Animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
</style>
