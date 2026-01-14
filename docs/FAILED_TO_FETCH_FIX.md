# Failed to Fetch Error - Diagnosis Guide

## 🔴 Error: "Failed to Fetch"

Error ini berarti ada masalah koneksi ke API server. Berikut cara diagnosa dan fix:

---

## 🔍 Diagnosis Step-by-Step

### Step 1: Cek API Server Running
```bash
# Di terminal server, pastikan sudah run:
pm2 list              # Lihat status service

# Jika API service stopped:
pm2 start api-service-name
```

### Step 2: Cek API URL di .env
```bash
# File: .env
NUXT_PUBLIC_API_BASE_URL=https://api-foto.gagakrimang.web.id
# ✅ Pastikan URL benar dan HTTPS/HTTP sesuai
```

### Step 3: Test API dengan curl
```bash
# Test dari terminal
curl -X POST https://api-foto.gagakrimang.web.id/member/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'

# Jika berhasil: akan return JSON response
# Jika gagal: akan error atau timeout
```

### Step 4: Check CORS Headers
```bash
# Test CORS dengan curl
curl -i -X OPTIONS https://api-foto.gagakrimang.web.id/member/login

# Response harus include:
# Access-Control-Allow-Origin: *
# Access-Control-Allow-Methods: POST, GET, OPTIONS
```

### Step 5: Cek Console di Browser

1. **Buka DevTools** → Tekan `F12`
2. **Pergi ke Console tab**
3. **Lihat warna merah error message**
4. **Catat error message**

---

## 🛠️ Common Causes & Fixes

### ❌ Penyebab 1: API Server Tidak Running
**Gejala**: 
- Error "Failed to fetch"
- Connection refused
- Cannot reach server

**Fix**:
```bash
# Start API server
pm2 start api-service
pm2 status

# Verify server running
curl https://api-foto.gagakrimang.web.id/member/login
```

---

### ❌ Penyebab 2: CORS Not Enabled
**Gejala**:
- Error "Failed to fetch"
- Browser console: CORS error
- Axios interceptor log shows error

**Fix di API Server**:
```javascript
// Node.js/Express example
const cors = require('cors');
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
```

**Fix di Nginx** (if using reverse proxy):
```nginx
location /member/login {
  add_header 'Access-Control-Allow-Origin' '*' always;
  add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
  add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
  
  if ($request_method = 'OPTIONS') {
    return 204;
  }
  
  proxy_pass http://backend-server:8000;
}
```

---

### ❌ Penyebab 3: Wrong API URL
**Gejala**:
- Error "Failed to fetch"
- 404 Not Found
- Connection timeout

**Fix**:
```env
# ✅ Benar:
NUXT_PUBLIC_API_BASE_URL=https://api-foto.gagakrimang.web.id

# ❌ Salah:
NUXT_PUBLIC_API_BASE_URL=https://api-foto.gagakrimang.web.id:8080  # Jika port salah
NUXT_PUBLIC_API_BASE_URL=http://api-foto.gagakrimang.web.id       # Jika harus HTTPS
```

---

### ❌ Penyebab 4: Network/Firewall Blocking
**Gejala**:
- Timeout error
- Connection refused
- Cannot reach host

**Fix**:
```bash
# Check firewall
sudo ufw status
sudo ufw allow 443    # Allow HTTPS
sudo ufw allow 8000   # Allow API port

# Check if port open
telnet api-foto.gagakrimang.web.id 443

# Check DNS
nslookup api-foto.gagakrimang.web.id
```

---

## 📊 Debug Info di Console

Saat login gagal, console akan show:

```javascript
%c❌ LOGIN FAILED - Network/Connection Error
{
  error: TypeError: Failed to fetch
  errorMessage: "❌ Gagal terhubung ke server. Kemungkinan:..."
  apiBaseUrl: "https://api-foto.gagakrimang.web.id"
  timestamp: "2025-01-14T07:55:03.123Z"
}
```

---

## 🔧 Quick Diagnostic Commands

### Test API Connection
```javascript
// Di browser console (F12), paste:
fetch('https://api-foto.gagakrimang.web.id/member/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'test' })
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

### Check API URL
```javascript
// Di browser console:
console.log('API Base URL:', window.__NUXT__?.config?.public?.apiBaseUrl)
```

### Check Network Headers
```javascript
// DevTools -> Network tab
// Filter by member/login
// Check:
// - Status: 200, 401, 404, 500?
// - Response Headers: CORS headers?
// - Request: Content-Type correct?
```

---

## ✅ Verification Checklist

Sebelum production, pastikan:

- [ ] API server running (`pm2 status`)
- [ ] API URL benar di .env
- [ ] CORS enabled di API server
- [ ] Firewall mengizinkan port
- [ ] DNS resolve dengan benar
- [ ] API endpoint `/member/login` exist
- [ ] Response format sesuai spec
- [ ] Test dengan curl berhasil
- [ ] Test dari browser berhasil
- [ ] Token bisa disimpan di localStorage

---

## 📞 If Still Not Working

1. **Export Debug Logs**:
   - Buka `/debug-logs`
   - Klik "Export Logs"
   - Send file ke support

2. **Collect Info**:
   - Screenshot error message
   - API server logs
   - Network tab logs
   - Browser console logs

3. **Report dengan**:
   - Error message lengkap
   - Steps to reproduce
   - API Base URL (masked)
   - Environment (production/development)
   - Browser & OS

---

## 🎯 Most Common Fix

**90% kasus "Failed to Fetch" adalah:**

1. **API server tidak running**
   ```bash
   pm2 start api-service
   ```

2. **CORS not enabled**
   ```javascript
   app.use(cors()); // Add to API server
   ```

3. **Wrong API URL**
   ```env
   # Update .env dengan URL yang benar
   NUXT_PUBLIC_API_BASE_URL=https://api-foto.gagakrimang.web.id
   ```

---

Generated: 2025-01-14
Last Updated: 2025-01-14
