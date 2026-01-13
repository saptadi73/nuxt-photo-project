# Debug: Issue Update Kategori - Deskripsi Tidak Berubah

**Date:** January 13, 2026  
**Issue:** Saat update kategori, field deskripsi tidak berubah  
**Status:** Investigating

---

## Frontend Check ✅

**Frontend code sudah benar.** Berikut verifikasinya:

### 1. UpdateKategori Function
**File:** [app/pages/cms-kategori.vue](../app/pages/cms-kategori.vue#L557)

Function `updateKategori()` sudah:
- ✅ Validate input `nama` (required)
- ✅ Trim whitespace dari `nama` dan `deskripsi`
- ✅ Append `nama`, `deskripsi`, dan `url_foto` ke FormData
- ✅ Send PUT request dengan `Content-Type: multipart/form-data`
- ✅ Include error logging

```typescript
const formData = new FormData();
formData.append('nama', modalForm.value.nama.trim());
formData.append('deskripsi', modalForm.value.deskripsi?.trim() || '');

if (modalForm.value.url_foto) {
  formData.append('url_foto', modalForm.value.url_foto);
}

const { data: result } = await $axios.put(`/kategori/${modalForm.value.id}`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

### 2. Modal Form Binding
**File:** [app/pages/cms-kategori.vue](../app/pages/cms-kategori.vue#L170)

Input field sudah ter-bind dengan benar:
```vue
<textarea
  v-model="modalForm.deskripsi"
  placeholder="Masukkan deskripsi kategori (opsional)"
></textarea>
```

### 3. Edit Modal Population
**File:** [app/pages/cms-kategori.vue](../app/pages/cms-kategori.vue#L437)

OpenEditModal() sudah populate form dengan data existing:
```typescript
modalForm.value = {
  id: kat.id,
  nama: kat.nama,
  deskripsi: kat.deskripsi || '',
  url_foto: null
};
```

---

## Backend Check ❓

**Kemungkinan masalah ada di backend API**

### Symptoms:
1. Update nama ✅ - Berhasil berubah
2. Update deskripsi ❌ - Tidak berubah
3. Update foto ✅ - Berhasil berubah

### Possible Backend Issues:

#### 1. Backend Tidak Membaca Field `deskripsi`
Backend mungkin hanya membaca field `nama` dan `url_foto`, tidak membaca `deskripsi`.

**Solusi:** Check backend code di KategoriController atau KategoriService untuk pastikan:
```php
// Backend should read:
$nama = $request->input('nama');
$deskripsi = $request->input('deskripsi'); // ← Make sure this is handled
$foto = $request->file('url_foto');
```

#### 2. Backend Menggunakan JSON Body, Bukan FormData
Jika backend expect JSON body, tapi frontend mengirim FormData, field mungkin tidak ter-parse.

**Frontend sudah support FormData** karena:
- Ada file upload (`url_foto`)
- File hanya bisa dikirim via multipart/form-data
- Frontend correctly set header: `Content-Type: multipart/form-data`

#### 3. Backend Request Helper Tidak Membaca FormData
Jika backend pakai custom RequestHelper, mungkin tidak membaca multipart fields.

**Dokumentasi Backend:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md#4-update-category-with-photo-upload)
```
Request Body (form-data):
- `nama` (optional, string): Category name
- `deskripsi` (optional, string): Category description
- `url_foto` (optional, file): New display photo
```

---

## How to Debug

### 1. Frontend Debugging

**Buka Browser Console (F12)** saat update kategori:

```
Console > Network tab > Filter "kategori"
```

Cari request PUT `/kategori/{id}`, klik untuk lihat:
- **Request Headers:** Check `Content-Type: multipart/form-data`
- **Form Data:** Check semua field (`nama`, `deskripsi`, `url_foto`)
- **Response:** Check response dari server

**Console Logs:**
```
Console tab akan menampilkan:
- Update kategori dengan data: {nama, deskripsi, url_foto}
- Update response: [response dari server]
- Response kategori data: {nama, deskripsi dari response}
```

### 2. Verify Form Data Values

Di modal form, ada section **"Data yang akan dikirim"** yang menampilkan:
- Nama
- Deskripsi
- Status Foto

**Pastikan deskripsi yang ditampilkan sudah ter-update** sebelum click "Update"

### 3. Test dengan cURL

Gunakan cURL untuk test API backend direct:

```bash
curl -X PUT http://localhost:8000/kategori/{kategori-id} \
  -F "nama=Updated Landscape" \
  -F "deskripsi=Updated description" \
  -F "url_foto=@/path/to/photo.jpg"
```

Lihat response:
```json
{
  "status": "success",
  "data": {
    "nama": "Updated Landscape",
    "deskripsi": "Updated description"
  }
}
```

---

## Solutions

### Solution 1: Check Backend Code
**Priority:** HIGH

1. Buka backend code (KategoriController atau KategoriService)
2. Check method `update()` untuk kategori
3. Pastikan:
   ```php
   $kategori->deskripsi = $request->input('deskripsi');
   $kategori->save();
   ```

### Solution 2: Improve Frontend Request
**Priority:** MEDIUM - Sebagai workaround

Bisa tambah explicit header atau log tambahan:

```typescript
// Check existing code di updateKategori()
console.log('FormData entries:');
for (let [key, value] of formData.entries()) {
  console.log(`${key}:`, value);
}
```

### Solution 3: Add Validation UI
**Priority:** MEDIUM

✅ **Sudah ditambahkan:**
- ID kategori ditampilkan
- Data summary ditampilkan di form
- Console logging ditambahkan

---

## Testing Checklist

- [ ] Open DevTools > Network tab
- [ ] Click Edit kategori
- [ ] Update nama dan deskripsi
- [ ] Click "Update"
- [ ] Check Network request (PUT /kategori/{id})
- [ ] Check Form Data di request
- [ ] Check Response dari server
- [ ] Verify data di "Data yang akan dikirim" section
- [ ] Check console logs
- [ ] Compare with GET /kategori response

---

## Next Steps

1. **Run debugging langsung** dengan DevTools
2. **Check console logs** di browser
3. **Inspect Network request** untuk verify FormData
4. **Check backend logs** untuk error messages
5. **Test dengan cURL** jika perlu isolate backend issue

---

**Frontend Status:** ✅ Ready - semua field dan logic sudah benar  
**Backend Status:** ❓ Unknown - need investigation  
**User Action:** Please provide:
1. Browser console logs output
2. Network request details (DevTools > Network tab)
3. Backend error logs (jika ada)
