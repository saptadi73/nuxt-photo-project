# 🔴 UPDATE FOTO TIDAK BERHASIL - DIAGNOSIS

## ❌ MASALAH DITEMUKAN

Frontend mengirim **string** "File selected" alih-alih **file binary**:

```json
{
  "foto_thumbnail": "File selected",  // ← SALAH! String, bukan file
  "foto_watermark": "No file",
  "foto_download": "No file"
}
```

**Hasil:** Backend menerima string → `url_thumbnail: null` (tidak terupload)

---

## ✅ SOLUSI

### ⚠️ PENTING: Gunakan POST + _method=PUT

Karena PUT tidak support multipart/form-data dengan baik:
- ✅ **Dengan file upload:** POST + `_method=PUT`
- ✅ **Tanpa file (text only):** PUT biasa dengan JSON

### ❌ WRONG Way (Yang sedang dilakukan)
```javascript
formData.append('foto_thumbnail', 'File selected');  // Mengirim string!
```

### ✅ RIGHT Way (Yang harus dilakukan)
```javascript
const formData = new FormData();

// ⚠️ WAJIB untuk file upload!
formData.append('_method', 'PUT');

// Ambil file dari input
const thumbnailInput = document.querySelector('#foto_thumbnail');

// Cek apakah ada file
if (thumbnailInput.files && thumbnailInput.files[0]) {
  // Append file binary, bukan string!
  formData.append('foto_thumbnail', thumbnailInput.files[0]);
}

// Send dengan POST, bukan PUT!
fetch('http://localhost:8000/foto/{id}', {
  method: 'POST',  // ← POST!
  body: formData
});
```

---

## 📝 Field Names (EXACT!)

| Frontend Field | Backend Field | Type |
|---|---|---|
| `#foto_thumbnail` | `foto_thumbnail` | File |
| `#foto_watermark` | `foto_watermark` | File |
| `#foto_download` | `foto_download` | File |

**⚠️ PENTING:** Nama harus PERSIS sama!

---

## 🧪 TEST TOOL

Buka: **http://localhost:8000/test-update-foto.html**

- Form untuk test update foto
- Console log untuk debug
- Lihat exactly apa yang dikirim

---

## 📋 Code Template

### Dengan File Upload (FormData)
```javascript
const formData = new FormData();

// ⚠️ WAJIB!
formData.append('_method', 'PUT');

// Append text fields
formData.append('judul', 'Tangga');
formData.append('harga', '500000');

// Append files HANYA jika ada
const thumbnailInput = document.querySelector('#foto_thumbnail');
if (thumbnailInput?.files?.[0]) {
  formData.append('foto_thumbnail', thumbnailInput.files[0]);
}

const watermarkInput = document.querySelector('#foto_watermark');
if (watermarkInput?.files?.[0]) {
  formData.append('foto_watermark', watermarkInput.files[0]);
}

const downloadInput = document.querySelector('#foto_download');
if (downloadInput?.files?.[0]) {
  formData.append('foto_download', downloadInput.files[0]);
}

// Send request - ⚠️ HARUS POST!
fetch(`http://localhost:8000/foto/{fotoId}`, {
  method: 'POST',  // ← BUKAN PUT!
  body: formData
});
```

### Tanpa File (Text Only)
```javascript
// Untuk update text saja (no file), bisa langsung PUT + JSON
fetch(`http://localhost:8000/foto/{fotoId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    judul: 'Tangga',
    harga: '500000'
  })
});
```

---

## 🚀 Langkah Fix

1. **Buka:** http://localhost:8000/test-update-foto.html
2. **Isi form** dengan data test
3. **Pilih file** untuk thumbnail/watermark/download
4. **Submit** → Lihat console log
5. **Jika berhasil** → Bandingkan dengan frontend code Anda
6. **Update frontend code** sesuai template di atas

---

## 📚 Dokumentasi Lengkap

- **[UPLOAD_FOTO_FIX.md](docs/UPLOAD_FOTO_FIX.md)** - Lengkap dengan contoh
- **Test tool:** http://localhost:8000/test-update-foto.html

---

**Backend sudah 100% OK!** Masalahnya hanya di frontend - jangan mengirim string untuk file.
