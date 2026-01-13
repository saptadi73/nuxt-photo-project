<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-2">
        <h1 class="text-3xl lg:text-5xl font-caveat font-black text-slate-900">Pesan Paket Sewa</h1>
        <p class="text-gray-600 font-caveat text-xl lg:text-2xl">Pilih Paket Sewa, Lengkapi Data, lalu pilih foto sesuai kuota paket.</p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <section v-if="!isMemberLogged" class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800 flex items-center justify-between">
        <div>Anda belum login sebagai member. Silakan login untuk melanjutkan pemesanan paket sewa.</div>
        <NuxtLink to="/login-pelanggan" class="px-4 py-2 rounded-lg bg-yellow-600 text-white font-semibold">Login</NuxtLink>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Form Paket & Pembeli -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs uppercase font-semibold text-gray-500">Paket</p>
                <h2 class="text-xl font-bold text-slate-900">Pilih Paket Sewa</h2>
              </div>
              <button @click="loadPackages" class="text-sm font-semibold text-blue-600 hover:text-blue-700" :disabled="isLoadingPackages">
                {{ isLoadingPackages ? 'Muat...' : 'Refresh' }}
              </button>
            </div>

            <div class="space-y-2">
              <label class="text-sm text-gray-600 font-semibold">Paket Rental</label>
              <select v-model="selectedPackageId" @change="handlePackageChange" class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900">
                <option value="">-- Pilih Paket --</option>
                <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">
                  {{ pkg.nama }} ({{ pkg.jumlah }} foto) - Rp {{ formatPrice(pkg.harga) }}
                </option>
              </select>
            </div>

            <div v-if="selectedPackage" class="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <p class="text-sm text-slate-700"><strong>Kuota Foto:</strong> {{ selectedPackage.jumlah }}</p>
              <p class="text-sm text-slate-700"><strong>Harga:</strong> Rp {{ formatPrice(selectedPackage.harga) }}</p>
              <p class="text-sm text-slate-500">{{ selectedPackage.deskripsi }}</p>
              <p class="text-sm font-bold text-green-700" v-if="selectedPackage && selectedPackage.jumlah > 0">Sisa kuota: {{ remainingSlots }} foto</p>
            </div>

            <div v-if="packageWarning" class="text-sm text-red-600 font-semibold">{{ packageWarning }}</div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div>
              <p class="text-xs uppercase font-semibold text-gray-500">Data Pembeli</p>
              <h2 class="text-xl font-bold text-slate-900">Otomatis dari member</h2>
            </div>

            <div class="space-y-3">
              <div class="space-y-1">
                <label class="text-sm text-gray-600 font-semibold">Nama</label>
                <input v-model="buyer.nama" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Nama" />
              </div>
              <div class="space-y-1">
                <label class="text-sm text-gray-600 font-semibold">Email</label>
                <input v-model="buyer.email" type="email" class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="email@example.com" />
              </div>
              <div class="space-y-1">
                <label class="text-sm text-gray-600 font-semibold">No. HP</label>
                <input v-model="buyer.no_hp" type="tel" class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="08xxxxxxxxxx" />
              </div>
              <div class="space-y-1">
                <label class="text-sm text-gray-600 font-semibold">Alamat</label>
                <textarea v-model="buyer.alamat" rows="3" class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Alamat lengkap"></textarea>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-slate-900">Ringkasan</h3>
              <span class="text-sm text-gray-600">Total dipilih: {{ totalSelectedQty }} / {{ selectedPackage?.jumlah || '-' }}</span>
            </div>
            <div class="text-sm text-slate-700">
              <p>Sisa kuota: <strong>{{ remainingSlots }}</strong> foto</p>
            </div>
            <button
              :disabled="!canSubmit || isSubmitting"
              @click="submitOrder"
              class="w-full mt-2 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {{ isSubmitting ? 'Memproses...' : 'Buat Pesanan Paket' }}
            </button>
            <p v-if="submitMessage" class="text-sm font-semibold" :class="submitSuccess ? 'text-green-700' : 'text-red-600'">{{ submitMessage }}</p>
          </div>
        </div>

        <!-- Foto & Pilihan -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p class="text-xs uppercase font-semibold text-gray-500">Galeri</p>
                <h2 class="text-xl font-bold text-slate-900">Pilih Foto (dengan jenis & jumlah)</h2>
              </div>
              <div class="text-sm text-gray-600">Sisa kuota: <strong>{{ remainingSlots }}</strong></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input v-model="searchQuery" type="text" placeholder="Cari judul..." class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900" />
              <select v-model="selectedCategory" class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900">
                <option value="">Semua Kategori</option>
                <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
              <select v-model="sortBy" class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900">
                <option value="newest">Terbaru</option>
                <option value="price-low">Harga Terendah</option>
                <option value="price-high">Harga Tertinggi</option>
              </select>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div v-if="isLoadingPhotos" class="p-10 flex items-center justify-center text-gray-500">Memuat foto...</div>
            <div v-else-if="filteredPhotos.length === 0" class="p-10 text-center text-gray-500">Tidak ada foto.</div>
            <div v-else>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6">
                <div v-for="photo in paginatedPhotos" :key="photo.id" class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                <div class="relative h-52 bg-gray-100 overflow-hidden rounded-t-2xl">
                  <img :src="getPhotoImageUrl(photo)" :alt="photo.judul" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div class="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide text-slate-900">{{ photo.kategori?.nama }}</div>
                </div>
                <div class="p-4 space-y-3">
                  <div>
                    <h3 class="font-bold text-slate-900 text-lg line-clamp-1">{{ photo.judul }}</h3>
                    <div class="flex items-center gap-2">
                      <p class="text-slate-800 font-black">Rp {{ formatPrice(photo.harga) }}</p>
                      <span class="inline-flex items-center px-2 py-1 text-[11px] font-semibold rounded-full bg-slate-100 text-slate-700">
                        {{ getPhotoOption(photo.id).jenis_cetak }}
                      </span>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <div class="space-y-1">
                      <label class="text-xs font-semibold text-gray-500">Jenis Cetak</label>
                      <select v-model="getPhotoOption(photo.id).jenis_cetak" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                        <option v-for="opt in jenisCetakOptions" :key="opt" :value="opt">{{ opt }}</option>
                      </select>
                    </div>
                    <div class="space-y-1">
                      <label class="text-xs font-semibold text-gray-500">Jumlah</label>
                      <input v-model.number="getPhotoOption(photo.id).qty" type="number" min="1" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                  </div>
                  <button
                    @click="addPhoto(photo)"
                    :disabled="!selectedPackage || remainingSlots <= 0"
                    class="w-full py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tambah ke Paket
                  </button>
                </div>
              </div>
            </div>
              <div class="border-t border-gray-100 px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-sm text-gray-700">
                <div>Menampilkan {{ pageStart }}-{{ pageEnd }} dari {{ filteredPhotos.length }} foto</div>
                <div class="flex items-center gap-2">
                  <button
                    class="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="currentPage === 1"
                    @click="currentPage = Math.max(1, currentPage - 1)"
                  >
                    Sebelumnya
                  </button>
                  <span class="font-semibold">Hal {{ currentPage }} / {{ totalPages }}</span>
                  <button
                    class="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="currentPage >= totalPages"
                    @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6" v-if="selectedLines.length">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-slate-900">Foto Terpilih</h3>
              <span class="text-sm text-gray-600">Total: {{ totalSelectedQty }} / {{ selectedPackage?.jumlah || '-' }}</span>
            </div>
            <div class="divide-y divide-gray-100">
              <div v-for="line in selectedLines" :key="line.id_foto" class="flex items-center gap-4 py-3">
                <img v-if="line.url_thumbnail" :src="`${BASE_URL}${line.url_thumbnail}`" :alt="line.nama" class="w-16 h-16 rounded-lg object-cover" />
                <div class="flex-1 min-w-50">
                  <p class="font-bold text-slate-900 line-clamp-1">{{ line.nama }}</p>
                  <div class="flex items-center gap-2">
                    <p class="text-sm text-gray-500">Rp {{ formatPrice(line.harga) }} / foto</p>
                    <span class="inline-flex items-center px-2 py-1 text-[11px] font-semibold rounded-full bg-slate-100 text-slate-700">
                      {{ line.jenis_cetak }}
                    </span>
                  </div>
                </div>
                <div class="w-32">
                  <label class="text-xs text-gray-500 font-semibold">Jenis</label>
                  <select v-model="line.jenis_cetak" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                    <option v-for="opt in jenisCetakOptions" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </div>
                <div class="w-24">
                  <label class="text-xs text-gray-500 font-semibold">Jumlah</label>
                  <input
                    type="number"
                    min="1"
                    v-model.number="line.qty"
                    @change="handleQtyChange(line)"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div class="w-28 text-right font-bold text-slate-900">Rp {{ formatPrice(line.harga * line.qty) }}</div>
                <button class="text-red-600 font-semibold text-sm px-2" @click="removeLine(line.id_foto)">Hapus</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from 'vue'

const config = useRuntimeConfig()
const BASE_URL = config.public.apiBaseUrl || 'http://localhost:8000'

const packages = ref<any[]>([])
const photos = ref<any[]>([])
const selectedPackageId = ref('')
const isLoadingPackages = ref(true)
const isLoadingPhotos = ref(true)
const isSubmitting = ref(false)
const submitMessage = ref('')
const submitSuccess = ref(false)
const packageWarning = ref('')

const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('newest')
const currentPage = ref(1)
const pageSize = ref(12)

const jenisCetakOptions = ['Landscape', 'Portrait']

const selectedLines = ref<any[]>([])
const photoOptions = reactive<Record<string, { jenis_cetak: string; qty: number }>>({})

const buyer = reactive({
  id_member: '',
  nama: '',
  email: '',
  no_hp: '',
  alamat: '',
})

const isMemberLogged = computed(() => !!buyer.id_member)

const selectedPackage = computed(() => packages.value.find((p) => p.id === selectedPackageId.value))

const totalSelectedQty = computed(() => selectedLines.value.reduce((sum, line) => sum + (line.qty || 0), 0))
const remainingSlots = computed(() => {
  if (!selectedPackage.value) return 0
  const sisa = selectedPackage.value.jumlah - totalSelectedQty.value
  return sisa < 0 ? 0 : sisa
})

const availableCategories = computed(() => {
  const cats = photos.value.map((p) => p.kategori?.nama).filter(Boolean)
  return [...new Set(cats)]
})

const filteredPhotos = computed(() => {
  let res = [...photos.value]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    res = res.filter((p) => p.judul.toLowerCase().includes(q) || p.kategori?.nama?.toLowerCase().includes(q))
  }

  if (selectedCategory.value) {
    res = res.filter((p) => p.kategori?.nama === selectedCategory.value)
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

watch([searchQuery, selectedCategory, sortBy, pageSize], () => {
  currentPage.value = 1
})

const totalPages = computed(() => {
  if (filteredPhotos.value.length === 0) return 1
  return Math.max(1, Math.ceil(filteredPhotos.value.length / pageSize.value))
})

const paginatedPhotos = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredPhotos.value.slice(start, start + pageSize.value)
})

const pageStart = computed(() => {
  if (filteredPhotos.value.length === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const pageEnd = computed(() => {
  return Math.min(filteredPhotos.value.length, currentPage.value * pageSize.value)
})

watch(filteredPhotos, () => {
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
})

const getPhotoOption = (id: string) => {
  if (!photoOptions[id]) photoOptions[id] = { jenis_cetak: 'Landscape', qty: 1 }
  return photoOptions[id]
}

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('memberToken') || localStorage.getItem('authToken') || ''
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const formatPrice = (price: any) => new Intl.NumberFormat('id-ID').format(parseFloat(price || 0))

const loadPackages = async () => {
  try {
    isLoadingPackages.value = true
    const res = await fetch(`${BASE_URL}/paket-rental`)
    const result = await res.json()
    packages.value = Array.isArray(result) ? result : result.data || []
  } catch (err) {
    console.error('Load paket error', err)
  } finally {
    isLoadingPackages.value = false
  }
}

const loadPhotos = async () => {
  try {
    isLoadingPhotos.value = true
    const res = await fetch(`${BASE_URL}/foto`)
    const result = await res.json()
    photos.value = Array.isArray(result) ? result : result.data || []
  } catch (err) {
    console.error('Load foto error', err)
  } finally {
    isLoadingPhotos.value = false
  }
}

const prefillBuyer = () => {
  if (typeof window === 'undefined') return
  buyer.id_member = localStorage.getItem('memberId') || ''
  buyer.nama = localStorage.getItem('memberName') || ''
  buyer.email = localStorage.getItem('memberEmail') || ''
  buyer.no_hp = localStorage.getItem('memberNoHp') || ''
  buyer.alamat = localStorage.getItem('memberAlamat') || ''
}

const handlePackageChange = () => {
  packageWarning.value = ''
  if (selectedPackage.value && totalSelectedQty.value > selectedPackage.value.jumlah) {
    packageWarning.value = 'Kuota paket lebih kecil daripada jumlah foto yang sudah dipilih. Kurangi foto.'
  }
}

const addPhoto = (photo: any) => {
  if (!selectedPackage.value) {
    packageWarning.value = 'Pilih paket sewa dulu.'
    return
  }
  const opt = getPhotoOption(photo.id)
  const addQty = opt.qty || 1
  if (addQty < 1) return

  if (totalSelectedQty.value + addQty > selectedPackage.value.jumlah) {
    packageWarning.value = `Melebihi kuota. Sisa kuota ${remainingSlots.value} foto.`
    return
  }

  const existing = selectedLines.value.find((l) => l.id_foto === photo.id)
  if (existing) {
    existing.qty += addQty
    existing.jenis_cetak = opt.jenis_cetak
  } else {
    selectedLines.value.push({
      id_foto: photo.id,
      nama: photo.judul,
      harga: parseFloat(photo.harga || 0),
      url_thumbnail: photo.url_thumbnail,
      jenis_cetak: opt.jenis_cetak,
      qty: addQty,
    })
  }
  packageWarning.value = ''
}

const handleQtyChange = (line: any) => {
  if (!selectedPackage.value) return
  if (line.qty < 1) line.qty = 1
  const over = totalSelectedQty.value - selectedPackage.value.jumlah
  if (over > 0) {
    line.qty = Math.max(1, line.qty - over)
    packageWarning.value = 'Jumlah disesuaikan agar tidak melebihi kuota.'
  } else {
    packageWarning.value = ''
  }
}

const removeLine = (id_foto: string) => {
  selectedLines.value = selectedLines.value.filter((l) => l.id_foto !== id_foto)
  packageWarning.value = ''
}

const canSubmit = computed(() => {
  return (
    !!selectedPackage.value &&
    isMemberLogged.value &&
    selectedLines.value.length > 0 &&
    totalSelectedQty.value > 0 &&
    totalSelectedQty.value <= (selectedPackage.value?.jumlah || 0)
  )
})

const submitOrder = async () => {
  submitMessage.value = ''
  submitSuccess.value = false
  packageWarning.value = ''

  if (!canSubmit.value) {
    submitMessage.value = 'Lengkapi paket, login, dan pilih foto sesuai kuota.'
    return
  }

  if (!buyer.no_hp || !buyer.alamat) {
    submitMessage.value = 'Isi No. HP dan alamat.'
    return
  }

  if (!selectedPackage.value) return

  isSubmitting.value = true
  try {
    const headerPayload = {
      tanggal: new Date().toISOString().slice(0, 10),
      id_member: buyer.id_member,
      id_paket_rental: selectedPackage.value.id,
      alamat: buyer.alamat,
      no_hp: buyer.no_hp,
      email: buyer.email,
      jumlah_foto: selectedPackage.value.jumlah,
      status: 'pending',
    }

    const resHeader = await fetch(`${BASE_URL}/rental-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      } as HeadersInit,
      body: JSON.stringify(headerPayload),
    })
    const headerResult = await resHeader.json()
    if (!(headerResult.success || headerResult.status) || !headerResult.data?.id) {
      submitMessage.value = headerResult.message || 'Gagal membuat pesanan'
      return
    }

    const orderId = headerResult.data.id

    for (const line of selectedLines.value) {
      const linePayload: any = {
        id_foto: line.id_foto,
        jumlah: line.qty,
        jenis_cetak: line.jenis_cetak,
      }
      const resLine = await fetch(`${BASE_URL}/rental-orders/${orderId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        } as HeadersInit,
        body: JSON.stringify(linePayload),
      })
      const lineResult = await resLine.json()
      if (!(lineResult.success || lineResult.status)) {
        submitMessage.value = lineResult.message || 'Gagal menambah foto ke pesanan'
        return
      }
    }

    submitSuccess.value = true
    submitMessage.value = 'Pesanan paket sewa berhasil dibuat.'
    selectedLines.value = []
    packageWarning.value = ''
  } catch (err) {
    console.error('Submit rental order error', err)
    submitMessage.value = 'Terjadi kesalahan saat membuat pesanan.'
  } finally {
    isSubmitting.value = false
  }
}

const getPhotoImageUrl = (photo: any) => {
  if (!photo.url_thumbnail) return 'https://placehold.co/600x400?text=No+Image'
  return `${BASE_URL}${photo.url_thumbnail}`
}

onMounted(() => {
  prefillBuyer()
  loadPackages()
  loadPhotos()
})
</script>
