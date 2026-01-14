# Login Production Troubleshooting Checklist

## 🚀 Diagnosis Cepat - Cek Satu Persatu

### ✅ Step 1: Akses Debug Page
```
https://your-production-domain.com/debug-logs
```
Jika page tidak ada → ERROR: Route tidak registered

---

### ✅ Step 2: Lihat Stats
- Berapa total logs?
- Berapa error?
- Jika 0 logs → Check console browser, debug system tidak berjalan

---

### ✅ Step 3: Filter ke ERROR
- Klik filter "ERROR"
- Ada error apa?
- Catat error message

---

### ✅ Step 4: Lihat LocalStorage
- Click untuk expand LocalStorage section
- `memberToken` ada gak?
- `memberName` ada gak?
- Jika kosong → Login gagal menyimpan

---

### ✅ Step 5: Test API Connection
- Klik "Test API Connection"
- Apakah success?
- Jika failed:
  - Check NUXT_PUBLIC_API_BASE_URL di `.env`
  - Pastikan API server running
  - Cek firewall

---

## 🔴 Common Errors & Fix

| Error | Penyebab | Solusi |
|-------|---------|--------|
| `Cannot find module 'axios'` | axios tidak installed | `npm install axios` |
| `Failed to parse JSON response` | API return HTML instead JSON | Check API server logs, pastikan endpoint exist |
| `LOGIN FAILED - Invalid response` | Response structure salah | Check API return format punya: `status`, `data.token`, `data.member` |
| `Terjadi kesalahan koneksi` | Cannot reach API | Test connection di debug page, check .env |
| Token tersimpan tapi undefined | Token corrupted | Export logs, check token value |

---

## 🎯 Quick Fixes

### Fix 1: Update .env
```env
NUXT_PUBLIC_API_BASE_URL=https://api-foto.gagakrimang.web.id
```
Then rebuild & restart

### Fix 2: Check API Endpoint
Test dengan curl/Postman:
```bash
curl -X POST https://api-foto.gagakrimang.web.id/member/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

### Fix 3: Check CORS
API response harus punya headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, GET, OPTIONS
Content-Type: application/json
```

### Fix 4: Rebuild & Restart
```bash
npm run build
pm2 delete nuxt-app
pm2 start .output/server/index.mjs --name nuxt-app
```

---

## 📊 Debug Export

Jika masih problem:
1. Buka `/debug-logs`
2. Klik "Export Logs" → download file
3. Share file ke developer/support
4. Include screenshot dari:
   - Stats
   - LocalStorage
   - Network Test
   - Error messages

---

## 🔗 Important URLs

| Halaman | URL |
|---------|-----|
| Login | `/login-pelanggan` |
| Debug | `/debug-logs` |
| API Base | `${NUXT_PUBLIC_API_BASE_URL}` |
| Login Endpoint | `${NUXT_PUBLIC_API_BASE_URL}/member/login` |

---

## ⚡ Instant Verification

### Cek dari Browser Console (F12)
```javascript
// 1. Check env
console.log(window.__NUXT__?.config?.public?.apiBaseUrl)

// 2. Check localStorage
localStorage.getItem('memberToken')
localStorage.getItem('memberName')

// 3. Check logs
JSON.parse(localStorage.getItem('debug_logs'))

// 4. Manual test
fetch('https://api-foto.gagakrimang.web.id/member/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'test' })
}).then(r => r.json()).then(console.log)
```

---

## 📝 Report Template

Jika ada issue, report dengan format ini:

```
## Login Error Report

**Environment**: Production / Development
**Date/Time**: [timestamp]
**Browser**: [browser name & version]

### Problem
[Deskripsi problem]

### Steps to Reproduce
1. ...
2. ...
3. ...

### Debug Info
- Total Errors: [dari stats]
- Error Messages: [paste error messages]
- LocalStorage Token: [ada/tidak ada]
- API Connection: [success/failed]

### Logs Export
[paste dari exported logs file]

### Screenshot
[screenshot dari debug page]
```

---

## ✅ Success Indicators

Login working correctly jika:
- ✅ No error logs di debug page
- ✅ memberToken ada di LocalStorage
- ✅ memberName ada di LocalStorage
- ✅ Network test success
- ✅ Redirect ke sales-order working

---

Generated: 2025-01-14
Last Updated: 2025-01-14
