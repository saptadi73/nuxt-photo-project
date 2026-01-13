# Foto Upload & Static File Access

## ✅ Upload Kategori Display Photo - KATEGORI DAPAT UPLOAD FOTO

### Feature Overview
**Kategori dapat mengunggah dan menyimpan 1 foto display/sample.**

Setiap kategori dapat memiliki 1 file foto yang:
- Ditampilkan sebagai thumbnail/sample di list kategori
- Disimpan dengan auto-cleanup (foto lama dihapus saat upload baru)
- Diakses publik via URL: `/uploads/kategori/{filename}`

### Endpoints untuk Upload Kategori

**Create Kategori dengan Foto:**
```
POST /kategori
```

**Update Kategori dengan Foto Baru:**
```
PUT /kategori/{id}
```

---

### Request Format (Multipart Form Data) - Create Kategori

```bash
POST /kategori
Content-Type: multipart/form-data

Form Fields:
- nama: "Landscape" (required, string)
- deskripsi: "Beautiful landscape photography" (optional, string)

Files:
- url_foto: [file] (optional - display photo untuk kategori)
```

**Validation:**
- `nama` - Required, min 3 chars, max 100 chars
- `url_foto` - Optional, max file size 5MB, format: JPG/PNG/GIF/WebP/SVG

### Example using cURL - Create:

```bash
curl -X POST http://localhost:8000/kategori \
  -F "nama=Landscape" \
  -F "deskripsi=Beautiful landscape photography" \
  -F "url_foto=@/path/to/landscape_sample.jpg"
```

### Example Response - Create:

```json
{
  "status": "success",
  "message": "Category created",
  "data": {
    "id": "uuid-kategori",
    "nama": "Landscape",
    "deskripsi": "Beautiful landscape photography",
    "url_foto": "/uploads/kategori/abc123def456.jpg",
    "created_at": "2026-01-13T10:00:00.000000Z",
    "updated_at": "2026-01-13T10:00:00.000000Z"
  }
}
```

### Request Format (Multipart Form Data) - Update Kategori

```bash
PUT /kategori/{id}
Content-Type: multipart/form-data

Form Fields:
- nama: "Updated Landscape" (optional, string)
- deskripsi: "Updated description" (optional, string)

Files:
- url_foto: [file] (optional - new display photo, old photo will be deleted)
```

**Validation:**
- `nama` - Optional, min 3 chars, max 100 chars
- `deskripsi` - Optional, max 255 chars
- `url_foto` - Optional, max file size 5MB, format: JPG/PNG/GIF/WebP/SVG

### Example using cURL - Update:

```bash
curl -X PUT http://localhost:8000/kategori/{id} \
  -F "nama=Updated Landscape" \
  -F "deskripsi=Updated description" \
  -F "url_foto=@/path/to/new_landscape_sample.jpg"
```

### 📝 Catatan Penting - Auto-Cleanup Foto Kategori

```
✅ Foto lama OTOMATIS DIHAPUS saat:
   1. Update kategori dengan url_foto baru
   2. Kategori didelete
   3. Tidak ada error - automatic cleanup berjalan di background

✅ Foto tetap tersimpan saat:
   1. Update kategori TANPA url_foto (update nama/deskripsi saja)
   2. Akses kategori (GET)

✅ Hanya 1 foto per kategori:
   - Setiap kategori hanya bisa simpan 1 display photo
   - Upload foto baru akan replace foto lama
```

### Contoh Skenario

**Scenario 1: Create kategori DENGAN foto**
```bash
curl -X POST http://localhost:8000/kategori \
  -F "nama=Landscape" \
  -F "deskripsi=Beautiful landscape photography" \
  -F "url_foto=@/photos/landscape.jpg"

# Result: 
# - Kategori created dengan id: uuid-1
# - Foto disimpan ke: /uploads/kategori/abc123def.jpg
# - url_foto field di database: /uploads/kategori/abc123def.jpg
```

**Scenario 2: Update kategori dengan foto BARU (foto lama otomatis dihapus)**
```bash
# Kategori uuid-1 sudah punya foto: /uploads/kategori/abc123def.jpg

curl -X PUT http://localhost:8000/kategori/uuid-1 \
  -F "nama=Updated Landscape" \
  -F "url_foto=@/photos/new_landscape.jpg"

# Result:
# - Foto lama (/uploads/kategori/abc123def.jpg) DIHAPUS dari server
# - Foto baru disimpan ke: /uploads/kategori/xyz789uvw.jpg
# - url_foto field di database: /uploads/kategori/xyz789uvw.jpg
```

**Scenario 3: Update kategori TANPA foto (foto tetap tersimpan)**
```bash
# Kategori uuid-1 punya foto: /uploads/kategori/xyz789uvw.jpg

curl -X PUT http://localhost:8000/kategori/uuid-1 \
  -F "nama=Updated Again" \
  -F "deskripsi=New description"

# Result:
# - Foto TETAP ada: /uploads/kategori/xyz789uvw.jpg
# - url_foto field di database: /uploads/kategori/xyz789uvw.jpg (TIDAK BERUBAH)
```

---

## Upload Foto

### Endpoint: `POST /foto`

Upload foto dengan 3 jenis file:
- `foto_thumbnail` - Gambar thumbnail (preview kecil)
- `foto_watermark` - Gambar dengan watermark (untuk preview)
- `foto_download` - Gambar asli (untuk download setelah pembelian)

### Request Format (Multipart Form Data)

```bash
POST /foto
Content-Type: multipart/form-data

Form Fields:
- judul: "Sunset at Beach"
- harga: 50000
- id_kategori: "uuid-kategori"
- is_rental: false (optional)

Files:
- foto_thumbnail: [file]
- foto_watermark: [file]
- foto_download: [file]
```

> Catatan: backend memakai `RequestHelper` untuk membaca body + file. Jika ada file, gunakan `multipart/form-data`. Jika tanpa file (hanya metadata), Anda bisa kirim `application/json` dengan field yang sama.

### Example using cURL:

```bash
curl -X POST http://localhost:8000/foto \
  -F "judul=Sunset Beach" \
  -F "harga=50000" \
  -F "id_kategori=your-kategori-uuid" \
  -F "is_rental=false" \
  -F "foto_thumbnail=@/path/to/thumbnail.jpg" \
  -F "foto_watermark=@/path/to/watermark.jpg" \
  -F "foto_download=@/path/to/original.jpg"
```

### Example Response:

```json
{
  "success": true,
  "message": "Photo created",
  "data": {
    "id": "uuid-foto",
    "judul": "Sunset Beach",
    "harga": "50000.00",
    "id_kategori": "uuid-kategori",
    "url_thumbnail": "/uploads/foto/thumbnail/abc123.jpg",
    "url_watermark": "/uploads/foto/watermark/def456.jpg",
    "url_download": "/uploads/foto/download/ghi789.jpg",
    "is_active": true,
    "is_rental": false
  }
}
```

## Update Foto

### Endpoint: `PUT /foto/{id}`

Update foto dengan file baru (opsional). Kirim multipart jika ada file, atau JSON jika hanya metadata.

```bash
curl -X PUT http://localhost:8000/foto/{id} \
  -F "judul=Updated Title" \
  -F "harga=75000" \
  -F "foto_thumbnail=@/path/to/new-thumbnail.jpg" \
  -F "foto_watermark=@/path/to/new-watermark.jpg" \
  -F "foto_download=@/path/to/new-original.jpg"
```

## Akses Static Files (Frontend)

Setelah upload, foto dapat diakses di frontend melalui URL:

### Base URL
```
http://localhost:8000/uploads/
```

### 🖼️ URL Structure untuk KATEGORI:
```
http://localhost:8000/uploads/kategori/{filename}
```

**Contoh:**
```
http://localhost:8000/uploads/kategori/landscape_abc123.jpg
http://localhost:8000/uploads/kategori/portrait_xyz789.jpg
```

### 🖼️ URL Structure untuk FOTO (Individual Photos):
```
http://localhost:8000/uploads/foto/thumbnail/{filename}
http://localhost:8000/uploads/foto/watermark/{filename}
http://localhost:8000/uploads/foto/download/{filename}
```

---

### 📱 Contoh Penggunaan di HTML untuk KATEGORI:

```html
<!-- Display kategori dengan foto sample -->
<div class="kategori-card">
  <img src="http://localhost:8000/uploads/kategori/landscape_sample.jpg" 
       alt="Landscape">
  <h3>Landscape</h3>
  <p>Beautiful landscape photography</p>
</div>

<!-- Display dengan dynamic data dari API -->
<div class="kategori-card">
  <img src="http://localhost:8000{{kategori.url_foto}}" 
       alt="{{kategori.nama}}">
  <h3>{{kategori.nama}}</h3>
  <p>{{kategori.deskripsi}}</p>
</div>
```

---

### ⚛️ Contoh di React untuk KATEGORI:

```jsx
// React Component - Display kategori dengan foto
function KategoriCard({ kategori }) {
  const baseUrl = 'http://localhost:8000';
  
  return (
    <div className="kategori-card">
      {kategori.url_foto && (
        <img 
          src={`${baseUrl}${kategori.url_foto}`} 
          alt={kategori.nama}
          className="kategori-image"
        />
      )}
      <h3>{kategori.nama}</h3>
      <p>{kategori.deskripsi}</p>
    </div>
  );
}

// React Hook untuk fetch kategori dengan foto
function KategoriList() {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:8000/kategori')
      .then(res => res.json())
      .then(data => setCategories(data.data))
      .catch(err => console.error('Error:', err));
  }, []);
  
  return (
    <div className="kategori-list">
      {categories.map(kategori => (
        <KategoriCard key={kategori.id} kategori={kategori} />
      ))}
    </div>
  );
}
```

---

### 🖖 Contoh di Vue untuk KATEGORI:

```vue
<!-- Vue Component - Display kategori dengan foto -->
<template>
  <div class="kategori-card">
    <img 
      v-if="kategori.url_foto" 
      :src="baseUrl + kategori.url_foto" 
      :alt="kategori.nama"
      class="kategori-image"
    >
    <h3>{{ kategori.nama }}</h3>
    <p>{{ kategori.deskripsi }}</p>
  </div>
</template>

<script>
export default {
  props: {
    kategori: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      baseUrl: 'http://localhost:8000'
    }
  }
}
</script>

<style scoped>
.kategori-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
```

```vue
<!-- Vue Component - Fetch dan display kategori list dengan foto -->
<template>
  <div class="kategori-list">
    <KategoriCard 
      v-for="kategori in categories" 
      :key="kategori.id" 
      :kategori="kategori"
    />
  </div>
</template>

<script>
import KategoriCard from './KategoriCard.vue';

export default {
  components: { KategoriCard },
  data() {
    return {
      categories: []
    }
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    fetchCategories() {
      fetch('http://localhost:8000/kategori')
        .then(res => res.json())
        .then(data => {
          this.categories = data.data;
        })
        .catch(err => console.error('Error:', err));
    }
  }
}
</script>
```

---

### 🔐 Security Notes untuk KATEGORI

1. **Kategori Display Photo** - Public access untuk semua user
   - Foto diakses tanpa authentication
   - Dioptimalkan untuk web display

2. **File Type Protection** - Server hanya accept:
   - JPG, JPEG, PNG, GIF, WebP, SVG
   - Max file size: 5MB

3. **Directory Protection** - Server tidak allow:
   - Directory traversal
   - Executable files
   - Double extension files

---

### 📐 Recommended Image Sizes untuk KATEGORI

- **Width:** 600px - 1200px
- **Height:** 400px - 800px (maintain aspect ratio)
- **Aspect Ratio:** 3:2 atau 4:3 recommended
- **File Size:** < 1MB optimized, < 5MB max
- **Format:** JPEG (best for photos)

**Optimization Tips:**
- Compress image sebelum upload
- Gunakan tools seperti TinyPNG, ImageMagick
- Test responsive display di berbagai ukuran layar

---

Untuk foto individual:

## Directory Structure

```
public/
└── uploads/
    ├── kategori/     # Foto display untuk kategori (sample foto)
    └── foto/
        ├── thumbnail/    # Gambar thumbnail (preview kecil)
        ├── watermark/    # Gambar dengan watermark
        └── download/     # Gambar asli untuk download
```

## Allowed File Types

- JPG/JPEG
- PNG
- GIF
- WEBP
- SVG

## Security Notes

1. **Thumbnail** - Dapat diakses publik untuk gallery
2. **Watermark** - Dapat diakses publik untuk preview detail
3. **Download** - Sebaiknya gunakan middleware untuk proteksi (cek pembelian)

## Recommended Image Sizes

- **Thumbnail**: 300x300px atau 400x400px
- **Watermark**: 1200x1200px atau original dengan watermark
- **Download**: Original resolution (full quality)
