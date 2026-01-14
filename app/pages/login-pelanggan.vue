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
import { useDebugLogger } from '~/composables/useDebugLogger'

const logger = useDebugLogger('LoginPelanggan')

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
  logger.debug('isLoggedIn changed to:', { isLoggedIn: newVal })
})

// Check if user is already logged in
onMounted(() => {
  logger.info('Component mounted - checking login state')
  
  if (typeof window !== 'undefined') {
    const memberToken = localStorage.getItem('memberToken')
    const savedName = localStorage.getItem('memberName')
    
    logger.debug('LocalStorage check:', { 
      hasToken: !!memberToken,
      tokenLength: memberToken?.length || 0,
      savedName: savedName || 'null'
    })
    
    if (memberToken && savedName) {
      isLoggedIn.value = true
      memberName.value = savedName
      logger.info('User already logged in', { memberName: savedName })
    } else {
      logger.info('User not logged in - showing login form')
    }
  }
})

// Handle Login
const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  logger.info('Login attempt started', { 
    email: loginForm.value.email,
    apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
  })

  try {
    const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
    const loginUrl = `${apiBaseUrl}/member/login`
    
    logger.debug('LOGIN REQUEST', {
      url: loginUrl,
      method: 'POST',
      email: loginForm.value.email,
      hasPassword: !!loginForm.value.password
    })
    
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: loginForm.value.email,
        password: loginForm.value.password
      })
    })

    logger.debug('LOGIN RESPONSE - HTTP Status', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: {
        contentType: response.headers.get('content-type'),
        server: response.headers.get('server')
      }
    })

    let result
    try {
      result = await response.json()
    } catch (parseError) {
      logger.error('Failed to parse JSON response', { 
        error: parseError,
        responseText: await response.text()
      })
      throw new Error('Invalid JSON response from server')
    }

    logger.debug('RESPONSE DATA - Full Response', {
      status: result.status,
      message: result.message,
      hasData: !!result.data,
      hasToken: !!result.data?.token,
      hasMember: !!result.data?.member,
      memberFields: result.data?.member ? Object.keys(result.data.member) : []
    })

    // Detailed member data logging
    if (result.data?.member) {
      logger.debug('Member Data Structure', {
        id: result.data.member.id,
        email: result.data.member.email,
        nama: result.data.member.nama,
        no_hp: result.data.member.no_hp || 'missing',
        alamat: result.data.member.alamat || 'missing',
        kota: result.data.member.kota || 'missing'
      })
    }

    // Check if login is successful
    if (response.ok && result.status && result.data?.token && result.data?.member) {
      const memberData = result.data.member
      const token = result.data.token
      
      logger.info('LOGIN SUCCESS - Saving credentials', {
        memberId: memberData.id,
        memberName: memberData.nama,
        tokenLength: token.length
      })

      // Save member data
      try {
        localStorage.setItem('memberToken', token)
        localStorage.setItem('memberName', memberData.nama)
        localStorage.setItem('memberEmail', memberData.email)
        localStorage.setItem('memberId', memberData.id)
        localStorage.setItem('memberIdMember', memberData.id_member || memberData.id)
        localStorage.setItem('memberNoHp', memberData.no_hp || '')
        localStorage.setItem('memberAlamat', memberData.alamat || '')
        localStorage.setItem('memberKota', memberData.kota || '')
        localStorage.setItem('memberProvinsi', memberData.provinsi || '')
        localStorage.setItem('memberKodePos', memberData.kode_pos || '')

        logger.debug('LocalStorage - All data saved successfully')

        // Verify saved data
        const verifyToken = localStorage.getItem('memberToken')
        logger.debug('LocalStorage verification', {
          tokenSavedCorrectly: verifyToken === token,
          tokenLength: verifyToken?.length || 0
        })
      } catch (storageError) {
        logger.error('Failed to save to localStorage', { error: storageError })
        throw new Error('Failed to save login data')
      }

      // Update UI state
      memberName.value = memberData.nama
      isLoggedIn.value = true
      
      logger.info('UI State updated', {
        isLoggedIn: isLoggedIn.value,
        memberName: memberName.value
      })

      // Check for pending orders
      const pendingPhotos = localStorage.getItem('pendingOrderPhotos')
      logger.debug('Checking for pending orders', { hasPending: !!pendingPhotos })

      if (pendingPhotos) {
        logger.info('Redirecting to sales-order with pending photos')
        setTimeout(() => {
          navigateTo({
            path: '/sales-order',
            query: { photos: pendingPhotos }
          })
        }, 1500)
      } else {
        logger.info('No pending orders - staying on welcome page')
      }

      // Clear form
      loginForm.value.email = ''
      loginForm.value.password = ''
      
    } else {
      logger.warn('LOGIN FAILED - Invalid response', {
        hasStatus: !!result.status,
        hasToken: !!result.data?.token,
        hasMember: !!result.data?.member,
        fullResponse: result
      })

      const errorMsg = result.data?.message || result.message || 'Email atau password salah.'
      errorMessage.value = errorMsg
      logger.error('Login error message set', { errorMessage: errorMsg })
    }
  } catch (error) {
    let errorMsg = 'Terjadi kesalahan koneksi. Silakan coba lagi.'
    let errorDetails: any = {}

    // Detect error type
    if (error instanceof TypeError) {
      // TypeError usually means network error or CORS
      const errorMessageLower = (error as Error).message.toLowerCase()
      
      if (errorMessageLower.includes('failed to fetch')) {
        errorMsg = '❌ Gagal terhubung ke server. Kemungkinan:\n1. API server tidak running\n2. CORS tidak diaktifkan\n3. Network error'
        errorDetails.cause = 'Network/CORS Error - Failed to fetch'
      } else if (errorMessageLower.includes('cors')) {
        errorMsg = '❌ CORS Error: Server tidak mengizinkan request dari domain ini'
        errorDetails.cause = 'CORS Policy Violation'
      } else if (errorMessageLower.includes('timeout')) {
        errorMsg = '❌ Timeout: Server tidak merespons dalam waktu yang ditentukan'
        errorDetails.cause = 'Request Timeout'
      } else {
        errorMsg = `❌ Network Error: ${error.message}`
        errorDetails.cause = error.message
      }
    } else if (error instanceof Error) {
      errorMsg = `❌ Error: ${error.message}`
      errorDetails.cause = error.message
    }

    logger.error('LOGIN EXCEPTION - DETAILED', {
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : 'no stack',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      ...errorDetails
    })

    console.error('%c❌ LOGIN FAILED - Network/Connection Error', 'color: #ff0000; font-weight: bold; font-size: 14px;', {
      error: error,
      errorMessage: errorMsg,
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      timestamp: new Date().toISOString()
    })

    errorMessage.value = errorMsg
  } finally {
    isLoading.value = false
    logger.info('Login attempt completed', { isLoading: isLoading.value })
  }
}

// Handle Logout
const handleLogout = () => {
  logger.info('Logout initiated')
  
  if (typeof window !== 'undefined') {
    const keysToRemove = [
      'memberToken',
      'memberName',
      'memberEmail',
      'memberId',
      'memberIdMember',
      'memberNoHp',
      'memberAlamat',
      'memberKota',
      'memberProvinsi',
      'memberKodePos'
    ]
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
    })
    
    logger.debug('All member data cleared from localStorage')
    
    isLoggedIn.value = false
    memberName.value = ''
    errorMessage.value = ''
    
    logger.info('Logout completed - UI state reset')
  }
}
</script>
