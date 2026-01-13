# Changelog - Kategori Photo Display Feature

**Date:** January 13, 2026

## Summary
Menambahkan fitur **upload foto display/sample untuk kategori**. Setiap kategori sekarang dapat **mengunggah dan memiliki satu foto** yang digunakan sebagai contoh/sample/thumbnail saat menampilkan list kategori.

### Kapabilitas Utama:
- ✅ **Kategori dapat upload foto display** - Setiap kategori dapat mengunggah 1 file foto
- ✅ **Foto otomatis tersimpan** - Foto disimpan di `public/uploads/kategori/`
- ✅ **Foto otomatis dihapus** - Foto lama dihapus saat update dengan foto baru atau kategori didelete
- ✅ **Support multiple format** - JPG, PNG, GIF, WebP, SVG
- ✅ **Akses via URL** - Foto dapat diakses publik: `/uploads/kategori/{filename}`

---

## Changes Made

### 0. Feature Overview - Kategori Upload Foto

**Fitur Utama:** Kategori dapat mengunggah 1 foto display yang akan ditampilkan sebagai thumbnail/sample di list kategori.

**Workflow:**
1. User membuat kategori baru dengan optional upload foto
2. Foto disimpan dengan filename random di `public/uploads/kategori/`
3. URL foto disimpan di database field `url_foto`
4. Saat list kategori dipanggil, foto ditampilkan di setiap kategori
5. Saat update kategori dengan foto baru, foto lama dihapus otomatis
6. Saat kategori didelete, foto juga dihapus otomatis

**Endpoints yang support:**
- `POST /kategori` - Create dengan optional upload foto
- `PUT /kategori/{id}` - Update dengan optional upload foto baru

---
**File:** `database/migrations/010_add_url_foto_to_kategori_table.php` (NEW)

- Menambahkan kolom `url_foto` (varchar 255, nullable) ke tabel `kategori`
- Kolom ini menyimpan URL relatif ke foto display kategori
- Foto lama akan otomatis dihapus saat upload foto baru

**Migration Command:**
```bash
php database/migrate.php
```

### 2. Model Update
**File:** `app/Models/Kategori.php`

**Changes:**
- Menambahkan `url_foto` ke array `$fillable`

```php
protected $fillable = ['id', 'nama', 'deskripsi', 'url_foto'];
```

### 3. Service Layer Enhancement
**File:** `app/Services/KategoriService.php` (COMPLETE REFACTOR)

**New Methods & Features:**
- `UPLOAD_DIR` - Konstanta untuk direktori upload kategori (`public/uploads/kategori/`)
- `initDirectory()` - Private method untuk membuat direktori upload jika belum ada
- `saveUploadedFile($uploadedFile)` - Simpan file upload dengan nama random
- `deleteFile($url)` - Hapus file fisik saat update/delete
- `create()` - Updated untuk menerima parameter `$foto_display`
- `update()` - Updated untuk handle upload foto baru dan delete foto lama

**Features:**
- Automatic directory creation jika belum ada
- Random filename generation untuk menghindari conflict
- Automatic cleanup (delete old photo saat update dengan foto baru)
- Automatic file deletion saat kategori didelete

### 4. Route Enhancement
**File:** `routes/kategori.php`

**Changes:**
- `POST /kategori` - Sekarang menerima multipart form-data dengan field `url_foto`
- `PUT /kategori/{id}` - Sekarang menerima multipart form-data dengan field `url_foto`

**Implementation:**
- Menggunakan `$request->getUploadedFiles()` untuk mengakses file
- Field `url_foto` adalah optional
- Support untuk update hanya metadata tanpa upload foto baru

### 5. Documentation Updates

#### File: `docs/API_DOCUMENTATION.md`

**New Section:** "Category Management (Kategori)" dengan 5 endpoint lengkap:
1. Get All Categories - `GET /kategori` - Menampilkan semua kategori beserta foto displaynya
2. Get Category by ID - `GET /kategori/{id}` - Menampilkan detail kategori + list foto di kategori tersebut
3. **Create New Category WITH Photo Upload** - `POST /kategori` - Kategori dapat di-create dengan optional file upload foto
4. **Update Category WITH Photo Upload** - `PUT /kategori/{id}` - Kategori dapat di-update dengan optional file upload foto baru (foto lama otomatis dihapus)
5. Delete Category - `DELETE /kategori/{id}` - Delete kategori beserta foto display-nya

**Dokumentasi includes:**
- Detail request/response untuk setiap endpoint
- Form-data structure untuk upload
- cURL examples untuk create/update dengan file upload
- JSON response examples dengan field `url_foto`
- Error handling documentation

#### File: `docs/FOTO_UPLOAD_GUIDE.md`

**Section: "Upload Kategori Display Photo"** - Panduan lengkap upload foto untuk kategori
- Penjelasan endpoint: `POST /kategori` dan `PUT /kategori/{id}`
- Form-data structure untuk create dan update
- cURL examples untuk upload foto kategori baru
- cURL examples untuk update kategori dengan foto baru
- Response examples dengan path foto yang tersimpan
- Catatan penting tentang automatic cleanup

**Updates:**
- Directory structure mencakup `uploads/kategori/`
- Static file access examples untuk kategori
- React dan Vue component examples untuk display kategori dengan foto
- Akses URL publik untuk kategori foto: `/uploads/kategori/{filename}`

**Tambahan:**
- Security notes untuk kategori foto
- Recommended image sizes untuk kategori display photo
- File type restrictions

#### File: `docs/CHANGELOG_KATEGORI_PHOTO_FEATURE.md` (File ini)

**Dokumentasi perubahan:**
- Overview fitur upload foto kategori
- Database changes
- Model updates
- Service layer enhancements
- Route enhancements
- Frontend usage examples
- Testing checklist

---

## Directory Structure

Setelah implementasi, struktur direktori menjadi:

```
public/
└── uploads/
    ├── kategori/         # NEW - Display photos untuk kategori
    │   ├── abc123def.jpg
    │   ├── xyz789uvw.jpg
    │   └── ...
    └── foto/
        ├── thumbnail/
        ├── watermark/
        └── download/
```

---

## API Endpoints - Kategori Upload Foto

### ✅ Create Kategori dengan Upload Foto (Kategori dapat upload)
```bash
curl -X POST http://localhost:8000/kategori \
  -F "nama=Landscape" \
  -F "deskripsi=Beautiful landscape photography" \
  -F "url_foto=@/path/to/photo.jpg"
```

**Response:**
```json
{
  "status": "success",
  "message": "Category created",
  "data": {
    "id": "uuid-kategori",
    "nama": "Landscape",
    "deskripsi": "Beautiful landscape photography",
    "url_foto": "/uploads/kategori/abc123def456.jpg"
  }
}
```

### ✅ Create Kategori Tanpa Foto (Optional)
```bash
curl -X POST http://localhost:8000/kategori \
  -F "nama=Landscape" \
  -F "deskripsi=Beautiful landscape photography"
```

### ✅ Update Kategori dengan Foto Baru (Foto lama otomatis dihapus)
```bash
curl -X PUT http://localhost:8000/kategori/{id} \
  -F "nama=Updated Name" \
  -F "url_foto=@/path/to/new_photo.jpg"
```

### ✅ Update Kategori Tanpa Upload Foto
```bash
curl -X PUT http://localhost:8000/kategori/{id} \
  -F "nama=Updated Name" \
  -F "deskripsi=Updated Description"
```

### ✅ Get All Kategori (Menampilkan foto)
```bash
curl -X GET http://localhost:8000/kategori
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid-kategori-1",
      "nama": "Landscape",
      "deskripsi": "Beautiful landscape photography",
      "url_foto": "/uploads/kategori/abc123def456.jpg"
    },
    {
      "id": "uuid-kategori-2",
      "nama": "Portrait",
      "url_foto": "/uploads/kategori/xyz789uvw012.jpg"
    }
  ]
}
```

---

## Frontend Usage

### React Component Example
```jsx
function KategoriCard({ kategori }) {
  const baseUrl = 'http://localhost:8000';
  
  return (
    <div className="kategori-card">
      {kategori.url_foto && (
        <img src={`${baseUrl}${kategori.url_foto}`} alt={kategori.nama} />
      )}
      <h3>{kategori.nama}</h3>
      <p>{kategori.deskripsi}</p>
    </div>
  );
}
```

### Vue Component Example
```vue
<template>
  <div class="kategori-card">
    <img v-if="kategori.url_foto" 
         :src="baseUrl + kategori.url_foto" 
         :alt="kategori.nama">
    <h3>{{ kategori.nama }}</h3>
    <p>{{ kategori.deskripsi }}</p>
  </div>
</template>

<script>
export default {
  props: ['kategori'],
  data() {
    return {
      baseUrl: 'http://localhost:8000'
    }
  }
}
</script>
```

---

## Files Modified/Created

### Created:
- `database/migrations/010_add_url_foto_to_kategori_table.php` (NEW)

### Modified:
- `app/Models/Kategori.php`
- `app/Services/KategoriService.php`
- `routes/kategori.php`
- `docs/API_DOCUMENTATION.md`
- `docs/FOTO_UPLOAD_GUIDE.md`

---

## Testing Checklist

- [ ] Run migration: `php database/migrate.php`
- [ ] Test create kategori dengan foto: `POST /kategori`
- [ ] Test create kategori tanpa foto: `POST /kategori`
- [ ] Test update kategori dengan foto baru: `PUT /kategori/{id}`
- [ ] Test update kategori tanpa foto: `PUT /kategori/{id}`
- [ ] Test delete kategori (verify foto lama terhapus)
- [ ] Test get kategori list: `GET /kategori`
- [ ] Test get kategori detail: `GET /kategori/{id}`
- [ ] Verify foto dapat diakses di browser: `http://localhost:8000/uploads/kategori/{filename}`

---

## Notes

- Foto lama akan otomatis dihapus dari server saat update dengan foto baru
- Foto kategori akan otomatis dihapus saat kategori didelete
- Format file yang didukung: JPG, PNG, GIF, WEBP, SVG
- Field `url_foto` adalah optional - kategori dapat dibuat/update tanpa foto
- Upload directory akan dibuat otomatis jika belum ada

---

**Version:** 1.1.0  
**Status:** Ready for Production
