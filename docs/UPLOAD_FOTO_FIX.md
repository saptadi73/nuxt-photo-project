# ⚠️ MASALAH UPDATE FOTO - DIAGNOSIS & SOLUSI

## 🔴 MASALAH

Frontend mengirim data:
```json
{
  "foto_thumbnail": "File selected",  // ❌ SALAH! Ini string, bukan file
  "foto_watermark": "No file",         // ❌ SALAH! Ini string, bukan file
  "foto_download": "No file"           // ❌ SALAH! Ini string, bukan file
}
```

**Hasil:** Backend menerima string, bukan file → tidak bisa upload → `url_thumbnail: null`

---

## ✅ SOLUSI

**Field names untuk foto:**

| Field | Type | Purpose |
|-------|------|---------|
| `foto_thumbnail` | File | Gambar untuk preview |
| `foto_watermark` | File | Gambar dengan watermark |
| `foto_download` | File | Gambar full resolution |

### ❌ WRONG Way (Frontend)
```javascript
// ❌ SALAH - Mengirim string, bukan file
const formData = new FormData();
formData.append('judul', 'Tangga');
formData.append('harga', '500000');
formData.append('foto_thumbnail', 'File selected');  // ← WRONG!
formData.append('foto_watermark', 'No file');        // ← WRONG!
```

### ✅ RIGHT Way (Frontend)
```javascript
// ✅ BENAR - Ambil file dari input
const formData = new FormData();
formData.append('judul', 'Tangga');
formData.append('harga', '500000');
formData.append('id_kategori', 'ca5fdc2e-acde-4c59-95c6-4204e79c3a0a');

// Ambil file dari input, bukan dari text
const thumbnailInput = document.querySelector('#foto_thumbnail');
const watermarkInput = document.querySelector('#foto_watermark');
const downloadInput = document.querySelector('#foto_download');

// Append file jika ada
if (thumbnailInput?.files?.[0]) {
  formData.append('foto_thumbnail', thumbnailInput.files[0]);
}
if (watermarkInput?.files?.[0]) {
  formData.append('foto_watermark', watermarkInput.files[0]);
}
if (downloadInput?.files?.[0]) {
  formData.append('foto_download', downloadInput.files[0]);
}

// Send
fetch('http://localhost:8000/foto/0d1af08e-9d21-4c91-97a4-9e2a248c643e', {
  method: 'PUT',  // For PUT dapat langsung
  body: formData
});
```

---

## 📋 Frontend Code Template

### HTML Form
```html
<form id="updateFotoForm">
  <div>
    <label for="judul">Judul Foto:</label>
    <input type="text" id="judul" name="judul" required>
  </div>

  <div>
    <label for="harga">Harga:</label>
    <input type="number" id="harga" name="harga" required>
  </div>

  <div>
    <label for="foto_thumbnail">Foto Thumbnail:</label>
    <input type="file" id="foto_thumbnail" name="foto_thumbnail" accept="image/*">
  </div>

  <div>
    <label for="foto_watermark">Foto Watermark:</label>
    <input type="file" id="foto_watermark" name="foto_watermark" accept="image/*">
  </div>

  <div>
    <label for="foto_download">Foto Download:</label>
    <input type="file" id="foto_download" name="foto_download" accept="image/*">
  </div>

  <button type="submit">Update Foto</button>
</form>
```

### JavaScript Function
```javascript
async function updateFoto(fotoId) {
  const formData = new FormData();

  // Get values
  const judul = document.querySelector('#judul').value;
  const harga = document.querySelector('#harga').value;

  // Append values
  formData.append('judul', judul);
  formData.append('harga', harga);

  // Append files ONLY if selected
  const thumbnailInput = document.querySelector('#foto_thumbnail');
  const watermarkInput = document.querySelector('#foto_watermark');
  const downloadInput = document.querySelector('#foto_download');

  if (thumbnailInput.files[0]) {
    console.log('✓ Thumbnail:', thumbnailInput.files[0].name);
    formData.append('foto_thumbnail', thumbnailInput.files[0]);
  }
  if (watermarkInput.files[0]) {
    console.log('✓ Watermark:', watermarkInput.files[0].name);
    formData.append('foto_watermark', watermarkInput.files[0]);
  }
  if (downloadInput.files[0]) {
    console.log('✓ Download:', downloadInput.files[0].name);
    formData.append('foto_download', downloadInput.files[0]);
  }

  try {
    const response = await fetch(
      `http://localhost:8000/foto/${fotoId}`,
      {
        method: 'PUT',  // ← Bisa PUT langsung (tidak perlu _method)
        body: formData
      }
    );

    const result = await response.json();

    if (result.status) {
      console.log('✅ Foto berhasil diupdate!', result.data);
      alert('✅ Foto berhasil diupdate!');
    } else {
      console.error('❌ Error:', result.message);
      alert('❌ ' + result.message);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    alert('❌ ' + error.message);
  }
}

// Attach event listener
document.getElementById('updateFotoForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const fotoId = '0d1af08e-9d21-4c91-97a4-9e2a248c643e';
  updateFoto(fotoId);
});
```

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Mengirim string alih-alih file
```javascript
// ❌ WRONG
formData.append('foto_thumbnail', 'File selected');

// ✅ RIGHT
const file = document.querySelector('#foto_thumbnail').files[0];
formData.append('foto_thumbnail', file);
```

### ❌ Mistake 2: Field name salah
```javascript
// ❌ WRONG
formData.append('thumbnail', file);      // Harusnya 'foto_thumbnail'
formData.append('watermark', file);      // Harusnya 'foto_watermark'
formData.append('download', file);       // Harusnya 'foto_download'

// ✅ RIGHT
formData.append('foto_thumbnail', file);
formData.append('foto_watermark', file);
formData.append('foto_download', file);
```

### ❌ Mistake 3: Append semua input, bahkan yang kosong
```javascript
// ❌ WRONG - Ini akan append string kosong untuk file yang tidak dipilih
const files = ['foto_thumbnail', 'foto_watermark', 'foto_download'];
files.forEach(fieldName => {
  formData.append(fieldName, 'No file');  // ← Jangan!
});

// ✅ RIGHT - Hanya append jika ada file
if (thumbnailInput.files[0]) {
  formData.append('foto_thumbnail', thumbnailInput.files[0]);
}
```

### ❌ Mistake 4: Tidak cek apakah file ada
```javascript
// ❌ WRONG - Bisa error jika input kosong
formData.append('foto_thumbnail', fileInput.files[0]);  // undefined!

// ✅ RIGHT - Cek dulu
if (fileInput.files && fileInput.files[0]) {
  formData.append('foto_thumbnail', fileInput.files[0]);
}
```

---

## 📊 Request/Response Comparison

### ❌ WRONG Request (Dari User)
```json
{
  "judul": "Tangga",
  "harga": 500000,
  "foto_thumbnail": "File selected",
  "foto_watermark": "No file",
  "foto_download": "No file"
}

Response:
{
  "url_thumbnail": null,      // ← null karena input "File selected" bukan file
  "url_watermark": "/uploads/foto/watermark/...",
  "url_download": "/uploads/foto/download/..."
}
```

### ✅ RIGHT Request
```
Method: PUT
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="judul"

Tangga
--boundary
Content-Disposition: form-data; name="harga"

500000
--boundary
Content-Disposition: form-data; name="foto_thumbnail"; filename="tangga.jpg"
Content-Type: image/jpeg

[binary data]
--boundary--

Response:
{
  "url_thumbnail": "/uploads/foto/thumbnail/abc123.jpg",
  "url_watermark": "/uploads/foto/watermark/def456.jpg",
  "url_download": "/uploads/foto/download/ghi789.jpg"
}
```

---

## 🔍 Debug Checklist

✅ Sebelum submit, check:
- [ ] HTML `<input type="file">` ada untuk setiap foto?
- [ ] JavaScript mengambil dari `.files[0]`?
- [ ] Append ke FormData dengan nama field yang benar?
- [ ] Cek console.log - file name muncul?
- [ ] Method PUT atau POST + _method?
- [ ] Content-Type tidak di-set manual (jika FormData)?

---

## 📞 Testing

### Test dengan cURL
```bash
curl -X PUT http://localhost:8000/foto/0d1af08e-9d21-4c91-97a4-9e2a248c643e \
  -F "judul=Tangga Updated" \
  -F "harga=550000" \
  -F "foto_thumbnail=@C:/path/to/thumbnail.jpg" \
  -F "foto_watermark=@C:/path/to/watermark.jpg" \
  -F "foto_download=@C:/path/to/download.jpg"
```

Expected response:
```json
{
  "status": true,
  "message": "Photo updated",
  "data": {
    "url_thumbnail": "/uploads/foto/thumbnail/...",
    "url_watermark": "/uploads/foto/watermark/...",
    "url_download": "/uploads/foto/download/..."
  }
}
```

---

## 📚 Field Reference

**Foto Update Endpoint:**
```
PUT /foto/{fotoId}
```

**Required Fields:**
- None (semua optional untuk update)

**Optional Fields:**
- `judul` - String
- `harga` - Number
- `foto_thumbnail` - File (image)
- `foto_watermark` - File (image)
- `foto_download` - File (image)

**Field Names (EXACT!):**
```
foto_thumbnail  (bukan thumbnail, image, photo_thumb, etc)
foto_watermark  (bukan watermark, image2, photo_mark, etc)
foto_download   (bukan download, pdf, photo_full, etc)
```

---

**Kesimpulan:** Frontend perlu di-fix untuk mengirim file binary, bukan string.

Last Updated: 13 Januari 2026
