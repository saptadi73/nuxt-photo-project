# Debug Guide - Login Pelanggan Production

## 🎯 Tujuan
Guide lengkap untuk troubleshoot dan debug login pelanggan yang gagal di production.

---

## 🚀 Cara Mengakses Debug Page

### Di Production:
```
https://your-domain.com/debug-logs
```

### Di Local Development:
```
http://localhost:3000/debug-logs
```

---

## 📊 Debug Page Features

### 1. **Stats Dashboard**
Menampilkan ringkasan log:
- Total Logs
- Total Errors
- Total Warnings  
- Total Info

### 2. **Log Filtering**
Filter logs berdasarkan level:
- **ALL** - Semua logs
- **ERROR** - Hanya error logs
- **WARN** - Hanya warning logs
- **INFO** - Hanya info logs
- **DEBUG** - Hanya debug logs

### 3. **Export Logs**
Download semua logs ke file txt untuk analisis lebih detail

### 4. **Local Storage Viewer**
Lihat semua member data yang tersimpan:
- memberToken
- memberName
- memberEmail
- memberId
- dll

### 5. **Network Test**
Test koneksi ke API server untuk memastikan:
- Server running
- URL benar
- CORS aktif
- Connection OK

---

## 🔍 Checklist Debugging Login

### Step 1: Cek Console di Browser
1. Buka DevTools (F12)
2. Pergi ke Console tab
3. Lihat semua logs dari `[LoginPelanggan]` module

### Step 2: Cek Debug Page
1. Buka `/debug-logs`
2. Lihat stats - berapa error?
3. Filter ke ERROR level
4. Baca pesan error dengan detail

### Step 3: Cek LocalStorage
Di debug page lihat:
- Apakah `memberToken` ada?
- Apakah `memberName` ada?
- Jika kosong, masalah di login

### Step 4: Test API Connection
Di debug page:
1. Klik "Test API Connection"
2. Lihat apakah connection OK
3. Jika gagal, check:
   - NUXT_PUBLIC_API_BASE_URL sudah benar?
   - API server running?
   - Firewall memblokir?

---

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to parse JSON response"
**Penyebab**: Server tidak mengembalikan JSON
**Solusi**:
- Check API server logs
- Pastikan endpoint `/member/login` exists
- Pastikan response header `Content-Type: application/json`

### Issue 2: "Login Failed - Invalid response"
**Penyebab**: Response structure tidak sesuai
**Solusi**:
- Check API response structure harus: `{ status: true, data: { token, member } }`
- Lihat debug logs untuk full response

### Issue 3: "Terjadi kesalahan koneksi"
**Penyebab**: Koneksi ke API error
**Solusi**:
1. Test API di debug page
2. Check NUXT_PUBLIC_API_BASE_URL di .env
3. Pastikan API server running
4. Check CORS settings di API server

### Issue 4: Token tersimpan tapi tidak login
**Penyebab**: Token tidak bisa dibaca
**Solusi**:
- Check localStorage di DevTools
- Test dengan API yang berbeda
- Check token expiry time

---

## 📝 Log Messages Explained

### Success Logs
```
[LoginPelanggan] Component mounted - checking login state
[LoginPelanggan] Login attempt started
[LoginPelanggan] LOGIN SUCCESS - Saving credentials
[LoginPelanggan] UI State updated
```

### Error Logs
```
[LoginPelanggan] Failed to parse JSON response
[LoginPelanggan] LOGIN FAILED - Invalid response
[LoginPelanggan] LOGIN EXCEPTION
```

---

## 🔧 Advanced Debugging

### 1. **Export Logs untuk Support**
1. Buka `/debug-logs`
2. Klik "Export Logs"
3. File .txt akan didownload
4. Share ke developer/support

### 2. **Monitor Real-time**
Buka DevTools Console dan lihat logs real-time saat login

### 3. **Check Full API Response**
Di debug page, expand log dengan data untuk lihat full API response

---

## 🛠️ Manual Testing

### Test di Production Directly
```bash
# Dari browser console (F12 > Console):

# 1. Test fetch API
const res = await fetch('https://your-api.com/member/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'password' })
})
const data = await res.json()
console.log(data)

# 2. Check localStorage
localStorage.getItem('memberToken')
localStorage.getItem('memberName')

# 3. Export logs
const logs = localStorage.getItem('debug_logs')
console.log(JSON.parse(logs))
```

---

## 📋 API Response Format (Required)

Login endpoint harus return format ini:
```json
{
  "status": true,
  "message": "Login success",
  "data": {
    "token": "eyJhbGc...",
    "member": {
      "id": "123",
      "id_member": "MEM123",
      "nama": "John Doe",
      "email": "john@example.com",
      "no_hp": "08123456789",
      "alamat": "Jl. Test 123",
      "kota": "Jakarta",
      "provinsi": "DKI Jakarta",
      "kode_pos": "12345"
    }
  }
}
```

---

## 🚨 Emergency Procedures

### Jika Login Completely Broken
1. Check API server - apakah running?
2. Test endpoint dengan Postman
3. Check API logs
4. Check firewall/CORS settings
5. Check .env configuration

### Export Debug Info untuk Ticket
1. Buka `/debug-logs`
2. Export logs
3. Screenshot stats
4. Screenshot localStorage
5. Screenshot network test result
6. Include semua di issue/ticket

---

## 💾 Persistence

Debug logs otomatis disimpan di localStorage dengan max 100 entries.
Logs akan persist setelah refresh page.

Untuk clear semua logs: Klik "Clear" button di debug page

---

## ✅ Verification Checklist

Sebelum production release:
- [ ] API endpoint `/member/login` working
- [ ] Response format sesuai spec
- [ ] CORS diaktifkan
- [ ] Environment variables benar
- [ ] Token bisa disimpan di localStorage
- [ ] Member data tersimpan lengkap
- [ ] Redirect ke sales-order working
- [ ] Logout membersihkan data
- [ ] Test dengan multiple browsers
- [ ] Test dengan network throttling (slow 3G)

---

## 📞 Support Info

Jika masih error setelah cek semua di atas:
1. Export logs dari debug page
2. Check API server logs
3. Verify API response format
4. Check network tab di DevTools
5. Report dengan semua info di atas

Happy Debugging! 🎉
