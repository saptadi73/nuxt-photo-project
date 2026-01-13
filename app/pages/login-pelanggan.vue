<template>
  <div class="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <!-- If Already Logged In - Welcome Message -->
      <div v-if="isLoggedIn" class="bg-white rounded-lg shadow-lg p-8">
        <div class="text-center">
          <div class="mb-6">
            <svg class="w-20 h-20 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 class="text-3xl font-bold text-slate-900 mb-4">
            Selamat Datang, {{ memberName }}!
          </h2>
          
          <p class="text-xl text-gray-700 mb-8">
            Selamat Memesan Foto Pilihanmu
          </p>

          <div class="space-y-3">
            <NuxtLink
              to="/pilih-foto"
              class="block w-full px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Mulai Memesan
            </NuxtLink>
            
            <button
              @click="handleLogout"
              class="block w-full px-6 py-3 border-2 border-slate-900 text-slate-900 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <!-- Login Form -->
      <div v-if="!isLoggedIn" class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold text-slate-900 mb-6 text-center">Login Member</h2>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-700 text-sm">{{ errorMessage }}</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                v-model="loginForm.email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
                placeholder="nama@email.com"
              />
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                v-model="loginForm.password"
                type="password"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <!-- Remember Me -->
            <div class="flex items-center">
              <input
                id="remember"
                v-model="loginForm.remember"
                type="checkbox"
                class="w-4 h-4 text-slate-900 border-gray-300 rounded focus:ring-slate-900"
              />
              <label for="remember" class="ml-2 text-sm text-gray-700">
                Ingat saya
              </label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading">Loading...</span>
              <span v-else>Login</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="my-6 border-t border-gray-300"></div>

          <!-- Register Link -->
          <div class="text-center">
            <p class="text-gray-600 mb-4">Belum punya akun?</p>
            <NuxtLink
              to="/registrasi-pelanggan"
              class="inline-block px-6 py-3 border-2 border-slate-900 text-slate-900 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Daftar Member Baru
            </NuxtLink>
          </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-8 text-center text-sm text-gray-600">
        <p>Dengan login, Anda menyetujui <NuxtLink to="/syarat-ketentuan" class="text-slate-900 hover:underline">Syarat dan Ketentuan</NuxtLink> kami</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const isLoggedIn = ref(false)
const memberName = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const loginForm = ref({
  email: '',
  password: '',
  remember: false
})

// Watch for login state changes
watch(isLoggedIn, (newVal) => {
  console.log('isLoggedIn changed to:', newVal)
})

// Check if user is already logged in
onMounted(() => {
  if (typeof window !== 'undefined') {
    const memberToken = localStorage.getItem('memberToken')
    const savedName = localStorage.getItem('memberName')
    
    console.log('Component mounted. Token:', memberToken ? 'exists' : 'null', 'Name:', savedName)
    
    if (memberToken && savedName) {
      isLoggedIn.value = true
      memberName.value = savedName
      console.log('User already logged in. Setting welcome state.')
    }
  }
})

// Handle Login
const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    // Call Member Login API endpoint
    // POST /member/login
    console.log('=== LOGIN REQUEST ===')
    console.log('URL:', 'http://localhost:8000/member/login')
    console.log('Email:', loginForm.value.email)
    console.log('Password:', '***hidden***')
    
    const response = await fetch('http://localhost:8000/member/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: loginForm.value.email,
        password: loginForm.value.password
      })
    })

    console.log('=== LOGIN RESPONSE ===')
    console.log('Status:', response.status)
    console.log('Status Text:', response.statusText)
    console.log('OK:', response.ok)

    const result = await response.json()
    console.log('=== RESPONSE DATA ===')
    console.log('Full Response:', result)
    console.log('Status:', result.status)
    console.log('Message:', result.message)
    console.log('Data:', result.data)
    console.log('Data.token:', result.data?.token ? 'EXISTS' : 'NULL')
    console.log('Data.member:', result.data?.member)

    // Check if login is successful based on result.status and token exists
    if (response.ok && result.status && result.data?.token && result.data?.member) {
      // Save member JWT token (type='member')
      const memberData = result.data.member
      const token = result.data.token
      
      console.log('=== LOGIN SUCCESS ===')
      console.log('Member Data:', memberData)
      console.log('Token:', token)
      console.log('Member Name:', memberData.nama)
      localStorage.setItem('memberToken', token)
      localStorage.setItem('memberName', memberData.nama)
      localStorage.setItem('memberEmail', memberData.email)
      localStorage.setItem('memberId', memberData.id)
      localStorage.setItem('memberIdMember', memberData.id_member)  // NEW: id_member
      // Store additional member data for sales order form
      localStorage.setItem('memberNoHp', memberData.no_hp || '')
      localStorage.setItem('memberAlamat', memberData.alamat || '')
      localStorage.setItem('memberKota', memberData.kota || '')
      localStorage.setItem('memberProvinsi', memberData.provinsi || '')
      localStorage.setItem('memberKodePos', memberData.kode_pos || '')

      // Set reactive state to show welcome page
      memberName.value = memberData.nama
      isLoggedIn.value = true
      
      console.log('=== STATE UPDATE ===')
      console.log('isLoggedIn set to:', isLoggedIn.value)
      console.log('memberName set to:', memberName.value)
      console.log('Welcome page should now display')
      
      // Check if there are pending order photos
      const pendingPhotos = localStorage.getItem('pendingOrderPhotos')
      if (pendingPhotos) {
        // Redirect to sales-order page after a short delay
        setTimeout(() => {
          navigateTo({
            path: '/sales-order',
            query: {
              photos: pendingPhotos
            }
          })
        }, 1500)
      }
      
      // Clear form
      loginForm.value.email = ''
      loginForm.value.password = ''
    } else {
      console.log('=== LOGIN FAILED ===')
      console.log('Response:', result)
      // Get error message from either result.message or result.data.message
      errorMessage.value = result.data?.message || result.message || 'Email atau password salah.'
    }
  } catch (error) {
    console.log('=== LOGIN ERROR ===')
    console.error('Login error:', error)
    errorMessage.value = 'Terjadi kesalahan koneksi. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
}

// Handle Logout
const handleLogout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('memberToken')
    localStorage.removeItem('memberName')
    localStorage.removeItem('memberEmail')
    localStorage.removeItem('memberId')
    localStorage.removeItem('memberIdMember')  // NEW: remove id_member
    localStorage.removeItem('memberNoHp')
    localStorage.removeItem('memberAlamat')
    localStorage.removeItem('memberKota')
    localStorage.removeItem('memberProvinsi')
    localStorage.removeItem('memberKodePos')
    
    isLoggedIn.value = false
    memberName.value = ''
    errorMessage.value = ''
  }
}
</script>
