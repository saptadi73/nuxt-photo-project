<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <header class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            <h1 class="text-4xl lg:text-5xl font-black font-caveat text-slate-900 tracking-tight">Daftar Order</h1>
            <p class="text-gray-500 font-caveat text-lg">Pesanan Fotomu dan Follow-up Pembayaran</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <!-- Check Login State -->
      <div v-if="!isLoggedIn" class="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
        <div class="mb-6">
          <svg class="w-16 h-16 text-yellow-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0 4v2M6.343 17.657l1.414-1.414m2.828 2.828l1.414-1.414m5.656 0l1.414 1.414m2.828-2.828l1.414 1.414M9 5a4 4 0 018 0v12a4 4 0 01-8 0V5z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-yellow-900 mb-3">Login Diperlukan</h2>
        <p class="text-yellow-800 mb-6">Silakan login terlebih dahulu untuk melihat pesanan Anda</p>
        <button 
          @click="$router.push('/login-pelanggan')"
          class="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
        >
          Login Sekarang
        </button>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-400 font-medium">Memuat Pesanan...</p>
      </div>

      <!-- No Orders State -->
      <div v-else-if="salesOrders.length === 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div class="mb-6">
          <svg class="w-20 h-20 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-600 mb-3">Belum Ada Pesanan</h3>
        <p class="text-gray-500 mb-6">Anda belum membuat pesanan apapun. Mari mulai memilih foto favorit Anda!</p>
        <button 
          @click="$router.push('/pilih-foto')"
          class="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all inline-block"
        >
          Mulai Pesan Foto
        </button>
      </div>

      <!-- Orders Table -->
      <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-900 text-white">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-bold">No. Order</th>
                <th class="px-6 py-4 text-left text-sm font-bold">Pembeli</th>
                <th class="px-6 py-4 text-left text-sm font-bold">No. HP</th>
                <th class="px-6 py-4 text-left text-sm font-bold">Email</th>
                <th class="px-6 py-4 text-left text-sm font-bold">Total</th>
                <th class="px-6 py-4 text-left text-sm font-bold">Tanggal</th>
                <th class="px-6 py-4 text-left text-sm font-bold">Status</th>
                <th class="px-6 py-4 text-center text-sm font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(order, index) in salesOrders"
                :key="order.id"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                :class="{ 'bg-gray-50': index % 2 === 0 }"
              >
                <td class="px-6 py-4">
                  <span class="font-mono text-sm font-bold text-slate-900">{{ order.id.slice(0, 8).toUpperCase() }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="font-bold text-slate-900">{{ order.nama_pembeli }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-700">{{ order.no_hp }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-700">{{ order.email || '-' }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="font-bold text-lg text-slate-900">Rp {{ formatPrice(order.total) }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-700">{{ formatDate(order.tanggal) }}</span>
                </td>
                <td class="px-6 py-4">
                  <span 
                    class="inline-block px-3 py-1 rounded-full text-xs font-bold"
                    :class="getStatusBadgeClass(order.status)"
                  >
                    {{ formatStatus(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <button 
                    @click="fetchOrderDetail(order.id)"
                    class="text-slate-900 hover:text-slate-600 font-semibold text-sm transition-colors"
                  >
                    Lihat Detail
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden space-y-4 p-6">
          <div 
            v-for="order in salesOrders"
            :key="order.id"
            class="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
          >
            <div class="mb-3">
              <h3 class="font-bold text-slate-900 mb-1">{{ order.nama_pembeli }}</h3>
              <p class="text-xs text-gray-500">{{ order.no_hp }}</p>
              <p class="text-xs text-gray-500">{{ order.email || '-' }}</p>
            </div>
            <div class="mb-3 border-t pt-3">
              <p class="text-xs text-gray-500 mb-1">Tanggal: {{ formatDate(order.tanggal) }}</p>
              <p class="font-bold text-lg text-slate-900">Rp {{ formatPrice(order.total) }}</p>
            </div>
            <button 
              @click="fetchOrderDetail(order.id)"
              class="w-full bg-slate-900 text-white py-2 rounded-lg font-semibold text-sm hover:bg-slate-800 transition-colors"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Order Detail Modal -->
    <Transition name="fade">
      <div 
        v-if="selectedOrder"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="selectedOrder = null"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 md:px-8 py-6 flex justify-between items-start">
            <div>
              <h2 class="text-2xl font-bold">Detail Pesanan</h2>
              <p class="text-gray-300 text-sm mt-1">Order ID: {{ selectedOrder.id }}</p>
            </div>
            <button 
              @click="selectedOrder = null"
              class="text-white/50 hover:text-white transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 md:p-8 space-y-6">
            <!-- Loading State -->
            <div v-if="isLoadingDetail" class="flex flex-col items-center justify-center py-12">
              <div class="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
              <p class="text-gray-400 font-medium">Memuat Detail...</p>
            </div>

            <!-- Order Info -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-500 mb-1">Tanggal Pesanan</p>
                <p class="font-bold text-lg text-slate-900">{{ formatDate(selectedOrder.tanggal) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Status Pembayaran</p>
                <span 
                  class="inline-block px-3 py-1 rounded-full text-sm font-bold"
                  :class="getStatusBadgeClass(selectedOrder.status)"
                >
                  {{ formatStatus(selectedOrder.status) }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Nama Pembeli</p>
                <p class="font-bold text-slate-900">{{ selectedOrder.nama_pembeli }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">No. HP</p>
                <p class="font-bold text-slate-900">{{ selectedOrder.no_hp }}</p>
              </div>
              <div class="md:col-span-2">
                <p class="text-sm text-gray-500 mb-1">Alamat</p>
                <p class="font-bold text-slate-900">{{ selectedOrder.alamat }}</p>
              </div>
              <div v-if="selectedOrder.email" class="md:col-span-2">
                <p class="text-sm text-gray-500 mb-1">Email</p>
                <p class="font-bold text-slate-900">{{ selectedOrder.email }}</p>
              </div>
            </div>

            <!-- Divider -->
            <div class="border-t border-gray-200"></div>

            <!-- Order Items -->
            <div>
              <h3 class="text-lg font-bold text-slate-900 mb-4">Detail Foto ({{ selectedOrder.lines.length }} item)</h3>
              <div class="space-y-3">
                <div 
                  v-for="line in selectedOrder.lines"
                  :key="line.id"
                  class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <img 
                    v-if="line.foto?.url_thumbnail"
                    :src="`${BASE_URL}${line.foto.url_thumbnail}`"
                    :alt="line.nama_foto"
                    class="w-20 h-20 object-cover rounded-lg shadow-md"
                  />
                  <div class="flex-1">
                    <h4 class="font-bold text-slate-900">{{ line.nama_foto }}</h4>
                    <p class="text-sm text-gray-500">{{ line.qty }}x Rp {{ formatPrice(line.harga) }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-slate-900">Rp {{ formatPrice(line.subtotal) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="border-t border-gray-200"></div>

            <!-- Total -->
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-slate-900">Total Pesanan:</span>
              <span class="text-3xl font-black text-slate-900">Rp {{ formatPrice(selectedOrder.total) }}</span>
            </div>

            <!-- Action Buttons -->
            <div v-if="selectedOrder.status !== 'completed'" class="space-y-3 pt-4 border-t border-gray-200">
              <p class="text-sm text-gray-600 text-center">
                📧 Silakan hubungi kami untuk konfirmasi dan metode pembayaran
              </p>
              <a 
                href="https://wa.me/your-number"
                target="_blank"
                class="block w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors text-center"
              >
                Hubungi via WhatsApp
              </a>
            </div>

            <div v-else class="space-y-3 pt-4 border-t border-gray-200 bg-green-50 p-4 rounded-xl text-center">
              <div class="text-4xl mb-2">✅</div>
              <p class="font-bold text-green-900">Pesanan Anda Telah Dibayar</p>
              <p class="text-sm text-green-800">Terima kasih atas pemesanan Anda!</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRuntimeConfig } from '#app'

// CONFIGURATION
const config = useRuntimeConfig()
const BASE_URL = config.public.apiBaseUrl || 'http://localhost:8000'
const router = useRouter()

// STATES
const salesOrders = ref<any[]>([])
const selectedOrder = ref<any>(null)
const isLoading = ref(true)
const isLoggedIn = ref(false)
const isLoadingDetail = ref(false)

// METHODS
const fetchMemberOrders = async () => {
  try {
    isLoading.value = true
    const memberId = localStorage.getItem('memberId')
    
    if (!memberId) {
      isLoggedIn.value = false
      return
    }

    const response = await fetch(`${BASE_URL}/sale-orders/member/${memberId}`)
    const result = await response.json()
    
    console.log('=== FETCH MEMBER ORDERS ===')
    console.log('Member ID:', memberId)
    console.log('Response:', result)
    console.log('Response Status:', result.status)
    console.log('Response Data:', result.data)

    // Handle both array and wrapped data responses
    // Response structure: { status: true, message: "...", data: [...] }
    if (result.status && result.data) {
      salesOrders.value = Array.isArray(result.data) ? result.data : [result.data]
      console.log('Salesorders set to:', salesOrders.value)
    } else if (Array.isArray(result)) {
      salesOrders.value = result
    } else {
      salesOrders.value = []
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    salesOrders.value = []
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

const formatPrice = (price: any) => {
  return new Intl.NumberFormat('id-ID').format(parseFloat(price || 0))
}

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': 'Menunggu Pembayaran',
    'completed': 'Sudah Dibayar',
    'cancelled': 'Dibatalkan'
  }
  return statusMap[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classMap: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

const fetchOrderDetail = async (orderId: string) => {
  try {
    isLoadingDetail.value = true
    
    console.log('=== FETCH ORDER DETAIL ===')
    console.log('Order ID:', orderId)
    
    const response = await fetch(`${BASE_URL}/sale-orders/${orderId}`)
    const result = await response.json()
    
    console.log('Response:', result)
    
    if (result.status && result.data) {
      selectedOrder.value = result.data
      console.log('Order Detail:', selectedOrder.value)
    } else if (result.success && result.data) {
      selectedOrder.value = result.data
      console.log('Order Detail:', selectedOrder.value)
    } else {
      console.error('Failed to fetch order detail')
    }
  } catch (error) {
    console.error('Error fetching order detail:', error)
  } finally {
    isLoadingDetail.value = false
  }
}

// LIFECYCLE
onMounted(() => {
  // Check if user is logged in
  if (typeof window !== 'undefined') {
    const memberToken = localStorage.getItem('memberToken')
    
    if (!memberToken) {
      isLoggedIn.value = false
      isLoading.value = false
      return
    }

    isLoggedIn.value = true
    fetchMemberOrders()
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
