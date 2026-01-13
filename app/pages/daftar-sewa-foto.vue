<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-2">
        <h1 class="text-3xl font-black text-slate-900">Daftar Sewa Foto</h1>
        <p class="text-gray-600">Lihat riwayat pesanan paket sewa Anda.</p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <!-- Login Alert -->
      <section v-if="!isMemberLogged" class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800 flex items-center justify-between">
        <div>Anda belum login sebagai member. Silakan login untuk melihat daftar sewa Anda.</div>
        <NuxtLink to="/login-pelanggan" class="px-4 py-2 rounded-lg bg-yellow-600 text-white font-semibold">Login</NuxtLink>
      </section>

      <!-- Orders List -->
      <section class="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p class="text-xs uppercase font-semibold text-gray-500">Pesanan Sewa</p>
            <h2 class="text-xl font-bold text-slate-900">Paket Rental Anda</h2>
          </div>
          <button @click="loadOrders" class="text-sm font-semibold text-blue-600 hover:text-blue-700" :disabled="isLoading">
            {{ isLoading ? 'Muat...' : 'Refresh' }}
          </button>
        </div>

        <div v-if="isLoading" class="p-8 flex items-center justify-center text-gray-500">Memuat data...</div>
        <div v-else-if="orders.length === 0" class="p-8 text-center text-gray-500">Belum ada pesanan sewa.</div>

        <!-- Desktop Table -->
        <div v-if="orders.length > 0" class="hidden md:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No. Order</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Paket</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Jumlah Foto</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 font-semibold text-slate-900 text-sm">#{{ order.id.substring(0, 8) }}</td>
                <td class="px-6 py-4 text-gray-700">{{ order.paketRental?.nama || '-' }}</td>
                <td class="px-6 py-4 text-gray-700">{{ formatDate(order.tanggal) }}</td>
                <td class="px-6 py-4 text-gray-700">{{ order.jumlah_foto }} foto</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" :class="getStatusBadgeClass(order.status)">
                    {{ formatStatus(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right space-x-2">
                  <button @click="viewDetail(order)" class="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                    Lihat Detail
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div v-if="orders.length > 0" class="md:hidden space-y-4 p-6">
          <div v-for="order in orders" :key="order.id" class="rounded-2xl border border-gray-100 p-4 space-y-2">
            <div class="flex items-center justify-between">
              <p class="font-bold text-slate-900">#{{ order.id.substring(0, 8) }}</p>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold" :class="getStatusBadgeClass(order.status)">
                {{ formatStatus(order.status) }}
              </span>
            </div>
            <p class="text-sm text-gray-600"><strong>Paket:</strong> {{ order.paketRental?.nama || '-' }}</p>
            <p class="text-sm text-gray-600"><strong>Tanggal:</strong> {{ formatDate(order.tanggal) }}</p>
            <p class="text-sm text-gray-600"><strong>Jumlah Foto:</strong> {{ order.jumlah_foto }} foto</p>
            <button @click="viewDetail(order)" class="w-full mt-3 py-2 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800">
              Lihat Detail
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- Detail Modal -->
    <Transition name="fade">
      <div v-if="selectedOrder" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
        <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 md:px-8 py-6 border-b border-gray-200">
            <div>
              <p class="text-xs uppercase font-semibold text-gray-500">Detail Pesanan</p>
              <h2 class="text-2xl font-bold text-slate-900">#{{ selectedOrder.id.substring(0, 8) }}</h2>
            </div>
            <button
              @click="selectedOrder = null"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
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
                <p class="text-sm text-gray-500 mb-1">Status</p>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold" :class="getStatusBadgeClass(selectedOrder.status)">
                  {{ formatStatus(selectedOrder.status) }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Paket</p>
                <p class="font-bold text-slate-900">{{ selectedOrder.paketRental?.nama }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Kuota Foto</p>
                <p class="font-bold text-slate-900">{{ selectedOrder.jumlah_foto }} foto</p>
              </div>
              <div class="md:col-span-2">
                <p class="text-sm text-gray-500 mb-1">Alamat Pengiriman</p>
                <p class="font-bold text-slate-900">{{ selectedOrder.alamat }}</p>
              </div>
              <div v-if="selectedOrder.no_hp" class="md:col-span-2">
                <p class="text-sm text-gray-500 mb-1">No. HP</p>
                <p class="font-bold text-slate-900">{{ selectedOrder.no_hp }}</p>
              </div>
              <div v-if="selectedOrder.email" class="md:col-span-2">
                <p class="text-sm text-gray-500 mb-1">Email</p>
                <p class="font-bold text-slate-900">{{ selectedOrder.email }}</p>
              </div>
            </div>

            <!-- Divider -->
            <div class="border-t border-gray-200"></div>

            <!-- Photos List -->
            <div v-if="selectedOrder.rentals && selectedOrder.rentals.length > 0">
              <h3 class="text-lg font-bold text-slate-900 mb-4">Foto Sewa ({{ selectedOrder.rentals.length }} item)</h3>
              <div class="space-y-3">
                <div v-for="rental in selectedOrder.rentals" :key="rental.id" class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <img 
                    v-if="rental.foto?.url_thumbnail"
                    :src="`${BASE_URL}${rental.foto.url_thumbnail}`"
                    :alt="rental.foto.judul"
                    class="w-20 h-20 object-cover rounded-lg shadow-md"
                  />
                  <div class="flex-1 min-w-50">
                    <h4 class="font-bold text-slate-900">{{ rental.foto?.judul }}</h4>
                    <p class="text-sm text-gray-500">{{ rental.jumlah }}x foto</p>
                    <p v-if="rental.jenis_cetak" class="text-xs text-gray-600 mt-1">
                      <strong>Jenis:</strong> {{ rental.jenis_cetak }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty Photos -->
            <div v-else class="text-center py-8 text-gray-500">
              Belum ada foto dipilih.
            </div>

            <!-- Divider -->
            <div class="border-t border-gray-200"></div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button
                @click="selectedOrder = null"
                class="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold"
              >
                Tutup
              </button>
              <a 
                v-if="selectedOrder.status === 'pending'"
                href="https://wa.me/your-number"
                target="_blank"
                class="flex-1 px-4 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 font-semibold text-center"
              >
                Hubungi via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const config = useRuntimeConfig()
const BASE_URL = config.public.apiBaseUrl || 'http://localhost:8000'

const orders = ref<any[]>([])
const selectedOrder = ref<any>(null)
const isLoading = ref(true)
const isLoadingDetail = ref(false)

const buyer = reactive({
  id_member: '',
  nama: '',
})

const isMemberLogged = computed(() => !!buyer.id_member)

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('memberToken') || localStorage.getItem('authToken') || ''
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const formatDate = (date: string | Date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

const formatStatus = (status: string) => {
  const statuses: Record<string, string> = {
    pending: 'Menunggu Pembayaran',
    active: 'Aktif',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  }
  return statuses[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700',
    active: 'bg-blue-50 text-blue-700',
    completed: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
  }
  return classes[status] || 'bg-gray-50 text-gray-700'
}

const prefillBuyer = () => {
  if (typeof window === 'undefined') return
  buyer.id_member = localStorage.getItem('memberId') || ''
  buyer.nama = localStorage.getItem('memberName') || ''
}

const loadOrders = async () => {
  if (!buyer.id_member) return

  try {
    isLoading.value = true
    const res = await fetch(`${BASE_URL}/rental-orders/member/${buyer.id_member}`, {
      headers: getAuthHeaders() as HeadersInit,
    })
    const result = await res.json()
    orders.value = Array.isArray(result) ? result : (result.data || [])
  } catch (err) {
    console.error('Load rental orders error', err)
  } finally {
    isLoading.value = false
  }
}

const viewDetail = async (order: any) => {
  selectedOrder.value = order
  isLoadingDetail.value = true

  try {
    const res = await fetch(`${BASE_URL}/rental-orders/${order.id}`, {
      headers: getAuthHeaders() as HeadersInit,
    })
    const result = await res.json()
    const detailData = result.data || result
    if (detailData) {
      selectedOrder.value = detailData
    }
  } catch (err) {
    console.error('Load order detail error', err)
  } finally {
    isLoadingDetail.value = false
  }
}

import { reactive } from 'vue'

onMounted(() => {
  prefillBuyer()
  loadOrders()
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
