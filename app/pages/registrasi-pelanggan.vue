<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Registration Success -->
      <div v-if="isRegistered" class="bg-white rounded-lg shadow-lg p-8">
        <div class="text-center">
          <div class="mb-6">
            <svg class="w-20 h-20 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 class="text-3xl font-bold text-slate-900 mb-4">
            Registrasi Berhasil!
          </h2>
          
          <p class="text-lg text-gray-700 mb-4">
            Akun Anda telah berhasil dibuat.
          </p>
          
          <p class="text-gray-600 mb-8">
            Anda akan diarahkan ke halaman login dalam <span class="font-bold">{{ countdown }}</span> detik...
          </p>

          <NuxtLink
            to="/login-pelanggan"
            class="inline-block px-8 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Login Sekarang
          </NuxtLink>
        </div>
      </div>

      <!-- Registration Form -->
      <div v-else class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold text-slate-900 mb-6 text-center">Daftar Member Baru</h2>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-700 text-sm">{{ errorMessage }}</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Full Name -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap <span class="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              v-model="registerForm.fullName"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
              placeholder="Nama lengkap Anda"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="registerForm.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
              placeholder="nama@email.com"
            />
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Nomor Telepon <span class="text-red-500">*</span>
            </label>
            <input
              id="phone"
              v-model="registerForm.phone"
              type="tel"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
              placeholder="08xx xxxx xxxx"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password <span class="text-red-500">*</span>
            </label>
            <input
              id="password"
              v-model="registerForm.password"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
              placeholder="Minimal 6 karakter"
            />
            <p class="mt-1 text-xs text-gray-500">Password minimal 6 karakter</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password <span class="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              v-model="registerForm.confirmPassword"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
              placeholder="Ulangi password"
            />
          </div>

          <!-- Address -->
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
              Alamat <span class="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              v-model="registerForm.address"
              required
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
              placeholder="Alamat lengkap Anda"
            ></textarea>
          </div>

          <!-- City, Province, Postal Code in Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- City -->
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                Kota
              </label>
              <input
                id="city"
                v-model="registerForm.city"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
                placeholder="Jakarta"
              />
            </div>

            <!-- Province -->
            <div>
              <label for="province" class="block text-sm font-medium text-gray-700 mb-2">
                Provinsi
              </label>
              <input
                id="province"
                v-model="registerForm.province"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
                placeholder="DKI Jakarta"
              />
            </div>

            <!-- Postal Code -->
            <div>
              <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-2">
                Kode Pos
              </label>
              <input
                id="postalCode"
                v-model="registerForm.postalCode"
                type="text"
                maxlength="5"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
                placeholder="12345"
              />
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <input
              id="terms"
              v-model="registerForm.agreeTerms"
              type="checkbox"
              required
              class="w-4 h-4 mt-1 text-slate-900 border-gray-300 rounded focus:ring-slate-900"
            />
            <label for="terms" class="ml-2 text-sm text-gray-700">
              Saya setuju dengan 
              <NuxtLink to="/syarat-ketentuan" class="text-slate-900 hover:underline font-semibold" target="_blank">
                Syarat dan Ketentuan
              </NuxtLink> 
              yang berlaku <span class="text-red-500">*</span>
            </label>
          </div>

          <!-- Newsletter -->
          <div class="flex items-start">
            <input
              id="newsletter"
              v-model="registerForm.newsletter"
              type="checkbox"
              class="w-4 h-4 mt-1 text-slate-900 border-gray-300 rounded focus:ring-slate-900"
            />
            <label for="newsletter" class="ml-2 text-sm text-gray-700">
              Saya ingin menerima informasi promo dan produk baru via email
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Mendaftar...</span>
            <span v-else>Daftar Sekarang</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="my-6 border-t border-gray-300"></div>

        <!-- Login Link -->
        <div class="text-center">
          <p class="text-gray-600 mb-4">Sudah punya akun?</p>
          <NuxtLink
            to="/login-pelanggan"
            class="inline-block px-6 py-3 border-2 border-slate-900 text-slate-900 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Login di Sini
          </NuxtLink>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-8 text-center text-sm text-gray-600">
        <p>Data Anda akan dijaga kerahasiaannya sesuai kebijakan privasi kami</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from '#imports'

const router = useRouter()
const isRegistered = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const countdown = ref(5)

const registerForm = ref({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  agreeTerms: false,
  newsletter: false
})

// Auto redirect to login after successful registration
watch(isRegistered, (newValue) => {
  if (newValue) {
    // Start countdown
    const interval = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(interval)
        router.push('/login-pelanggan')
      }
    }, 1000)
  }
})

// Handle Registration
const handleRegister = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    // Validate passwords match
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      errorMessage.value = 'Password dan Konfirmasi Password tidak sama.'
      isLoading.value = false
      return
    }

    // Validate password length
    if (registerForm.value.password.length < 6) {
      errorMessage.value = 'Password minimal 6 karakter.'
      isLoading.value = false
      return
    }

    // Validate terms
    if (!registerForm.value.agreeTerms) {
      errorMessage.value = 'Anda harus menyetujui Syarat dan Ketentuan.'
      isLoading.value = false
      return
    }

    // Call Member Registration API endpoint
    // POST /member/register
    const response = await fetch('http://localhost:8000/member/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nama: registerForm.value.fullName,
        email: registerForm.value.email,
        password: registerForm.value.password,
        no_hp: registerForm.value.phone,
        alamat: registerForm.value.address,
        kota: registerForm.value.city || null,
        provinsi: registerForm.value.province || null,
        kode_pos: registerForm.value.postalCode || null
      })
    })

    const result = await response.json()

    if (response.ok && result.success) {
      // Show success screen
      isRegistered.value = true
    } else {
      errorMessage.value = result.message || 'Registrasi gagal. Silakan coba lagi.'
    }

  } catch (error) {
    console.error('Registration error:', error)
    errorMessage.value = 'Terjadi kesalahan koneksi. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
}
</script>
