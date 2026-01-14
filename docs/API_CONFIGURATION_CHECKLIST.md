# API Configuration - .env Usage Checklist

## 📋 API Endpoints Configuration Status

### ✅ Using .env Correctly

Pages yang sudah menggunakan `NUXT_PUBLIC_API_BASE_URL` dari .env:

| File | Method | Endpoint | Status |
|------|--------|----------|--------|
| paket-sewa.vue | GET | /foto (all) | ✅ |
| paket-sewa.vue | GET | /kategori-foto | ✅ |
| pilih-foto.vue | GET | /foto (all) | ✅ |
| pesan-paket-sewa.vue | GET/POST | /sales-order | ✅ |
| orders.vue | GET | /sales-order (member) | ✅ |
| daftar-sewa-foto.vue | POST | /sales-order | ✅ |
| sales-order.vue | POST | /sales-order | ✅ |
| login-pelanggan.vue | POST | /member/login | ✅ |
| registrasi-pelanggan.vue | POST | /member/register | ✅ |
| debug-logs.vue | Test | /member/login | ✅ |

---

## 🔧 How API URLs are Retrieved

### Method 1: Using useRuntimeConfig() (Recommended)
```typescript
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl // Gets from nuxt.config.ts
```

### Method 2: Using process.env
```typescript
const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL // Gets from .env
```

### Method 3: Using axios plugin
```typescript
// Automatically includes Authorization header + logs requests/responses
const { $axios } = useNuxtApp()
const response = await $axios.get('/member/login')
```

---

## 📝 Configuration Flow

```
.env file
   ↓
NUXT_PUBLIC_API_BASE_URL=https://api-foto.gagakrimang.web.id
   ↓
nuxt.config.ts runtimeConfig
   ↓
useRuntimeConfig() in components
   ↓
fetch('/member/login') or axios.post(...)
```

---

## 🎯 Best Practices

### ✅ DO:
```typescript
// ✅ Correct - using .env
const config = useRuntimeConfig()
const apiUrl = config.public.apiBaseUrl

const response = await fetch(`${apiUrl}/member/login`, {...})
```

### ❌ DON'T:
```typescript
// ❌ Wrong - hardcoded URL
const response = await fetch('http://localhost:8000/member/login', {...})

// ❌ Wrong - inconsistent fallback
const apiUrl = 'http://api.example.com' // Should use .env
```

---

## 📊 Current Configuration

### .env File
```env
NUXT_PUBLIC_API_BASE_URL=https://api-foto.gagakrimang.web.id
```

### nuxt.config.ts
```typescript
runtimeConfig: {
  public: {
    apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  },
}
```

### Fallback
If `NUXT_PUBLIC_API_BASE_URL` not set, defaults to:
- **Development**: `http://localhost:8080`
- **Production**: Must set `NUXT_PUBLIC_API_BASE_URL` in environment

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Set `NUXT_PUBLIC_API_BASE_URL` environment variable
- [ ] Test all API endpoints with production URL
- [ ] Verify CORS headers from API server
- [ ] Check API server SSL certificate
- [ ] Verify API response format matches expectations
- [ ] Test with actual API data
- [ ] Monitor browser console for errors
- [ ] Check network tab for successful requests

---

## 🔍 Quick Verification

### Check Current API Base URL
```javascript
// In browser console (F12):
console.log(window.__NUXT__.config.public.apiBaseUrl)
```

### Check Environment Variable
```bash
# In server terminal:
echo $NUXT_PUBLIC_API_BASE_URL
# Or on Windows:
echo %NUXT_PUBLIC_API_BASE_URL%
```

### Verify API Connection
```bash
curl -X POST https://api-foto.gagakrimang.web.id/member/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

---

## 📱 All API Endpoints Used

### Member APIs
| Endpoint | Method | Used In |
|----------|--------|---------|
| `/member/login` | POST | login-pelanggan.vue |
| `/member/register` | POST | registrasi-pelanggan.vue |

### Foto APIs
| Endpoint | Method | Used In |
|----------|--------|---------|
| `/foto` | GET | paket-sewa.vue, pilih-foto.vue |
| `/kategori-foto` | GET | paket-sewa.vue |

### Order APIs
| Endpoint | Method | Used In |
|----------|--------|---------|
| `/sales-order` | GET, POST | orders.vue, pesan-paket-sewa.vue, daftar-sewa-foto.vue, sales-order.vue |

---

## 🎉 Summary

✅ **All API calls now use centralized .env configuration**

- Main API URL in `.env`: `NUXT_PUBLIC_API_BASE_URL`
- Fallback to `http://localhost:8080` for development
- All pages use `useRuntimeConfig()` to get API URL
- Axios plugin handles request/response logging
- No hardcoded URLs in components

---

Generated: 2025-01-14
Last Updated: 2025-01-14
