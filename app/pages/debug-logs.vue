<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Debug Logs - Login Troubleshooting</h1>
          <div class="flex gap-2">
            <button
              @click="exportLogs"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              📥 Export Logs
            </button>
            <button
              @click="refreshLogs"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              🔄 Refresh
            </button>
            <button
              @click="clearLogs"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-4 gap-4 mb-8">
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">{{ logs.length }}</div>
            <div class="text-sm text-gray-600">Total Logs</div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-red-600">{{ errorCount }}</div>
            <div class="text-sm text-gray-600">Errors</div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-yellow-600">{{ warningCount }}</div>
            <div class="text-sm text-gray-600">Warnings</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ infoCount }}</div>
            <div class="text-sm text-gray-600">Info</div>
          </div>
        </div>

        <!-- Filter -->
        <div class="mb-6 flex gap-2 flex-wrap">
          <button
            v-for="level in ['all', 'error', 'warn', 'info', 'debug']"
            :key="level"
            @click="selectedLevel = level"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition',
              selectedLevel === level
                ? 'bg-gray-900 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            {{ level.toUpperCase() }}
          </button>
        </div>

        <!-- Logs Display -->
        <div class="space-y-2 bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          <div v-if="filteredLogs.length === 0" class="text-center text-gray-500 py-8">
            No logs found
          </div>
          
          <div
            v-for="(log, index) in filteredLogs"
            :key="index"
            :class="[
              'p-3 rounded border-l-4',
              log.level === 'error' && 'bg-red-50 border-red-500',
              log.level === 'warn' && 'bg-yellow-50 border-yellow-500',
              log.level === 'info' && 'bg-blue-50 border-blue-500',
              log.level === 'debug' && 'bg-gray-100 border-gray-500'
            ]"
          >
            <div class="flex justify-between items-start mb-1">
              <span :class="[
                'font-bold text-sm',
                log.level === 'error' && 'text-red-700',
                log.level === 'warn' && 'text-yellow-700',
                log.level === 'info' && 'text-blue-700',
                log.level === 'debug' && 'text-gray-700'
              ]">
                [{{ log.module }}] {{ log.message }}
              </span>
              <span class="text-xs text-gray-500">{{ formatTime(log.timestamp) }}</span>
            </div>
            
            <div v-if="log.data" class="text-xs text-gray-600 bg-white rounded p-2 mt-1 max-h-20 overflow-y-auto font-mono">
              <pre>{{ JSON.stringify(log.data, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <!-- Local Storage Viewer -->
        <div class="mt-8 border-t pt-8">
          <h2 class="text-xl font-bold text-gray-900 mb-4">LocalStorage Member Data</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="key in memberStorageKeys"
              :key="key"
              class="bg-gray-50 p-4 rounded-lg"
            >
              <div class="text-sm font-semibold text-gray-700 mb-2">{{ key }}</div>
              <div class="bg-white p-2 rounded text-xs font-mono wrap-break-word max-h-20 overflow-y-auto">
                {{ getStorageValue(key) || '(empty)' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Network Test -->
        <div class="mt-8 border-t pt-8">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Network Test</h2>
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-4">API Base URL:</p>
            <div class="bg-white p-2 rounded text-sm font-mono mb-4">
              {{ apiBaseUrl }}
            </div>
            
            <button
              @click="testConnection"
              :disabled="testLoading"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {{ testLoading ? 'Testing...' : '🌐 Test API Connection' }}
            </button>
            
            <div v-if="connectionTest" :class="[
              'mt-4 p-4 rounded-lg',
              connectionTest.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            ]">
              <div :class="connectionTest.success ? 'text-green-700' : 'text-red-700'" class="font-semibold mb-2">
                {{ connectionTest.success ? '✅ Success' : '❌ Failed' }}
              </div>
              <div class="text-sm text-gray-700">
                <pre>{{ connectionTest.message }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getDebugLogs, clearDebugLogs, exportDebugLogs, type DebugLog } from '~/composables/useDebugLogger'

const logs = ref<DebugLog[]>([])
const selectedLevel = ref('all')
const testLoading = ref(false)
const connectionTest = ref<{ success: boolean; message: string } | null>(null)

const memberStorageKeys = [
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

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

const errorCount = computed(() => logs.value.filter(l => l.level === 'error').length)
const warningCount = computed(() => logs.value.filter(l => l.level === 'warn').length)
const infoCount = computed(() => logs.value.filter(l => l.level === 'info').length)

const filteredLogs = computed(() => {
  if (selectedLevel.value === 'all') return logs.value
  return logs.value.filter(l => l.level === selectedLevel.value)
})

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('id-ID')
}

const getStorageValue = (key: string) => {
  if (typeof window === 'undefined') return ''
  const value = localStorage.getItem(key)
  if (key === 'memberToken' && value) {
    return value.substring(0, 50) + '...'
  }
  return value
}

const refreshLogs = () => {
  logs.value = getDebugLogs().reverse()
}

const clearLogs = () => {
  if (confirm('Apakah Anda yakin ingin menghapus semua logs?')) {
    clearDebugLogs()
    logs.value = []
  }
}

const exportLogs = () => {
  const content = exportDebugLogs()
  if (!content) {
    alert('Tidak ada logs untuk di-export')
    return
  }

  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
  element.setAttribute('download', `debug-logs-${new Date().toISOString()}.txt`)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

const testConnection = async () => {
  testLoading.value = true
  connectionTest.value = null

  try {
    const response = await fetch(`${apiBaseUrl}/member/login`, {
      method: 'OPTIONS'
    }).catch(() => null)

    if (response && response.ok) {
      connectionTest.value = {
        success: true,
        message: '✅ Server merespons dengan baik. Koneksi OK.'
      }
    } else {
      connectionTest.value = {
        success: false,
        message: `❌ Server error: ${response?.status || 'Unknown error'}`
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    connectionTest.value = {
      success: false,
      message: `❌ Koneksi gagal: ${errorMessage}\n\nPastikan:\n1. API server running\n2. URL benar: ${apiBaseUrl}\n3. CORS diaktifkan`
    }
  } finally {
    testLoading.value = false
  }
}

onMounted(() => {
  refreshLogs()
})
</script>
