<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-2">
        <h1 class="text-3xl lg:text-5xl font-caveat font-black text-slate-900">Paket Sewa</h1>
        <p class="text-gray-500 font-caveat text-xl lg:text-2xl">Daftar dan kelola Paket Sewa</p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Form Card -->
      <section class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase font-semibold text-gray-500">Form Paket Sewa</p>
            <h2 class="text-xl font-bold text-slate-900">{{ isEditing ? 'Ubah Paket' : 'Tambah Paket' }}</h2>
          </div>
          <button
            v-if="isEditing"
            @click="resetForm"
            class="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            + Buat Baru
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm text-gray-600 font-semibold">Nama Paket</label>
            <input
              v-model="form.nama"
              type="text"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Misal: Paket Premium"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm text-gray-600 font-semibold">Jumlah Foto</label>
            <input
              v-model.number="form.jumlah"
              type="number"
              min="1"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="30"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm text-gray-600 font-semibold">Harga</label>
            <input
              v-model.number="form.harga"
              type="number"
              min="0"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="500000"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm text-gray-600 font-semibold">Deskripsi</label>
            <textarea
              v-model="form.deskripsi"
              rows="3"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Paket rental 30 hari"
            ></textarea>
          </div>
        </div>

        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p v-if="errorMessage" class="text-sm text-red-600 font-semibold">{{ errorMessage }}</p>
          <div class="flex gap-3 ml-auto">
            <button
              @click="resetForm"
              class="px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold"
              type="button"
            >
              Reset
            </button>
            <button
              :disabled="isSubmitting"
              @click="submitForm"
              class="px-5 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              type="button"
            >
              {{ isSubmitting ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Paket') }}
            </button>
          </div>
        </div>
      </section>

      <!-- List Card -->
      <section class="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p class="text-xs uppercase font-semibold text-gray-500">Daftar Paket</p>
            <h2 class="text-xl font-bold text-slate-900">Paket Rental</h2>
          </div>
          <button
            @click="loadPackages"
            class="text-sm font-semibold text-blue-600 hover:text-blue-700"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Muat...' : 'Refresh' }}
          </button>
        </div>

        <div v-if="isLoading" class="p-8 flex items-center justify-center text-gray-500">Memuat paket...</div>
        <div v-else-if="packages.length === 0" class="p-8 text-center text-gray-500">Belum ada paket.</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Jumlah Foto</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Harga</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Deskripsi</th>
                <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="pkg in packages" :key="pkg.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 font-semibold text-slate-900">{{ pkg.nama }}</td>
                <td class="px-6 py-4 text-gray-700">{{ pkg.jumlah }}</td>
                <td class="px-6 py-4 text-gray-700">Rp {{ formatPrice(pkg.harga) }}</td>
                <td class="px-6 py-4 text-gray-500 max-w-xs">{{ pkg.deskripsi }}</td>
                <td class="px-6 py-4 text-right space-x-2">
                  <button
                    class="px-3 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    @click="startEdit(pkg)"
                  >
                    Edit
                  </button>
                  <button
                    class="px-3 py-2 text-sm font-semibold text-red-600 hover:text-red-700"
                    @click="removePackage(pkg)"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useSEO } from '~/composables/useSEO';
import heroImage from '~/assets/images/cityscape1.jpg';


const config = useRuntimeConfig()
const BASE_URL = config.public.apiBaseUrl || 'http://localhost:8000'
// SEO Setup
useSEO({
  title: 'Paket Sewa | Judynata Fotografi',
  description: 'Menyelami ruang hening, di mana cahaya hitam putih merangkum emosi yang tidak terucap. Empat hal dibawah ini merangkum lintasan ide Judynata tentang solitude, abstraksi, dan ketulusan visual.',
  keywords: 'keheningan, hitam putih, fotografi, judynata, solitude, abstraksi, visual, seni, makna, emosi',
  image: heroImage,
  url: 'https://judynatafotografi.com/',
  type: 'website'
});

const packages = ref<any[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref('')
const form = reactive({
  id: null as string | null,
  nama: '',
  jumlah: 0,
  harga: 0,
  deskripsi: '',
})

const isEditing = computed(() => !!form.id)

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('authToken') || ''
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const formatPrice = (price: number) => new Intl.NumberFormat('id-ID').format(price || 0)

const resetForm = () => {
  form.id = null
  form.nama = ''
  form.jumlah = 0
  form.harga = 0
  form.deskripsi = ''
  errorMessage.value = ''
}

const loadPackages = async () => {
  try {
    isLoading.value = true
    const response = await fetch(`${BASE_URL}/paket-rental`)
    const result = await response.json()
    packages.value = Array.isArray(result) ? result : (result.data || [])
  } catch (err) {
    console.error('Gagal memuat paket:', err)
    errorMessage.value = 'Gagal memuat paket. Coba lagi.'
  } finally {
    isLoading.value = false
  }
}

const validateForm = () => {
  if (!form.nama) return 'Nama paket wajib diisi'
  if (!form.jumlah || form.jumlah < 1) return 'Jumlah foto minimal 1'
  if (form.harga === null || form.harga < 0) return 'Harga tidak valid'
  return ''
}

const submitForm = async () => {
  errorMessage.value = ''
  const validation = validateForm()
  if (validation) {
    errorMessage.value = validation
    return
  }

  isSubmitting.value = true
  const payload = {
    nama: form.nama,
    jumlah: form.jumlah,
    harga: form.harga,
    deskripsi: form.deskripsi,
  }

  const url = isEditing.value ? `${BASE_URL}/paket-rental/${form.id}` : `${BASE_URL}/paket-rental`
  const method = isEditing.value ? 'PUT' : 'POST'

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      } as HeadersInit,
      body: JSON.stringify(payload),
    })
    const result = await response.json()

    if (result.success || result.status) {
      await loadPackages()
      resetForm()
    } else {
      errorMessage.value = result.message || 'Gagal menyimpan paket'
    }
  } catch (err) {
    console.error('Gagal simpan paket:', err)
    errorMessage.value = 'Terjadi kesalahan saat menyimpan'
  } finally {
    isSubmitting.value = false
  }
}

const startEdit = (pkg: any) => {
  form.id = pkg.id
  form.nama = pkg.nama
  form.jumlah = pkg.jumlah
  form.harga = pkg.harga
  form.deskripsi = pkg.deskripsi
  errorMessage.value = ''
}

const removePackage = async (pkg: any) => {
  const confirmed = confirm(`Hapus paket "${pkg.nama}"?`)
  if (!confirmed) return

  try {
    const response = await fetch(`${BASE_URL}/paket-rental/${pkg.id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      } as HeadersInit,
    })
    const result = await response.json()
    if (result.success || result.status) {
      packages.value = packages.value.filter((p) => p.id !== pkg.id)
    } else {
      alert(result.message || 'Gagal menghapus paket')
    }
  } catch (err) {
    console.error('Gagal hapus paket:', err)
    alert('Terjadi kesalahan saat menghapus paket')
  }
}

onMounted(() => {
  loadPackages()
})
</script>
