# Panduan Update Kategori untuk Frontend Developer

## 📋 Overview

Dokumen ini menjelaskan cara melakukan **UPDATE kategori** dari frontend ke API backend.

**Base URL**: `http://localhost:8000`  
**Endpoint**: `PUT /kategori/{id}`

---

## ⚠️ PENTING: Dua Cara Update

Ada **2 cara berbeda** tergantung apakah Anda mengirim **file upload** atau tidak:

| Skenario | Method | Content-Type | Catatan |
|----------|--------|--------------|---------|
| **Tanpa file** (hanya text) | `PUT` | `application/json` | Paling mudah, langsung PUT |
| **Dengan file** atau FormData | `POST` | `multipart/form-data` | Harus POST + `_method=PUT` |

---

## 🎯 Cara 1: Update Tanpa File (JSON)

Gunakan ini jika **hanya update nama dan deskripsi**, tanpa upload foto baru.

### Request

```http
PUT /kategori/{id}
Content-Type: application/json

{
  "nama": "Seascape",
  "deskripsi": "Ada sebuah tempat di mana dunia berhenti bicara..."
}
```

### JavaScript (Fetch API)

```javascript
async function updateKategori(kategoriId, nama, deskripsi) {
  try {
    const response = await fetch(`http://localhost:8000/kategori/${kategoriId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nama: nama,
        deskripsi: deskripsi
      })
    });

    const result = await response.json();
    
    if (result.status) {
      console.log('✅ Update berhasil:', result.data);
      return result.data;
    } else {
      console.error('❌ Update gagal:', result.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Error:', error);
    return null;
  }
}

// Contoh penggunaan:
updateKategori(
  'e595f92e-335a-4529-8056-1c483322cabc',
  'Seascape',
  'Ada sebuah tempat di mana dunia berhenti bicara. Di sana, laut bukan lagi deburan, melainkan hamparan sutra yang membisikkan rahasia kepada gunung-gunung purba. Dalam balutan hitam dan putih, alam melepaskan jubah warnanya, hanya untuk menunjukkan bahwa keagungan yang paling murni ada dalam kesederhanaan'
);
```

### Axios

```javascript
async function updateKategori(kategoriId, nama, deskripsi) {
  try {
    const response = await axios.put(
      `http://localhost:8000/kategori/${kategoriId}`,
      {
        nama: nama,
        deskripsi: deskripsi
      }
    );

    console.log('✅ Update berhasil:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Update gagal:', error.response?.data || error.message);
    return null;
  }
}
```

---

## 🎯 Cara 2: Update Dengan File Upload (FormData)

Gunakan ini jika ada kemungkinan **upload foto display kategori**.

### ⚠️ CRITICAL: Gunakan POST, bukan PUT!

HTTP PUT tidak support `multipart/form-data` dengan baik. Solusinya:
- Gunakan **POST** sebagai method
- Tambahkan field **`_method=PUT`** di FormData

### Request

```http
POST /kategori/{id}
Content-Type: multipart/form-data

_method=PUT
nama=Seascape
deskripsi=Ada sebuah tempat di mana dunia berhenti bicara...
url_foto=(file binary)
```

### JavaScript (Fetch API)

```javascript
async function updateKategoriWithFile(kategoriId, nama, deskripsi, fileInput) {
  try {
    const formData = new FormData();
    
    // ⚠️ WAJIB: Tambahkan _method field
    formData.append('_method', 'PUT');
    
    // Tambahkan data text
    formData.append('nama', nama);
    formData.append('deskripsi', deskripsi);
    
    // Tambahkan file jika ada
    if (fileInput && fileInput.files && fileInput.files[0]) {
      formData.append('url_foto', fileInput.files[0]);
    }

    const response = await fetch(`http://localhost:8000/kategori/${kategoriId}`, {
      method: 'POST',  // ← PENTING: POST, bukan PUT!
      body: formData
      // ⚠️ JANGAN set Content-Type! Biarkan browser yang handle
    });

    const result = await response.json();
    
    if (result.status) {
      console.log('✅ Update berhasil:', result.data);
      return result.data;
    } else {
      console.error('❌ Update gagal:', result.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Error:', error);
    return null;
  }
}

// Contoh penggunaan:
const fileInput = document.querySelector('#foto-kategori');
updateKategoriWithFile(
  'e595f92e-335a-4529-8056-1c483322cabc',
  'Seascape',
  'Deskripsi panjang...',
  fileInput  // Bisa null jika tidak ada file
);
```

### Axios dengan FormData

```javascript
async function updateKategoriWithFile(kategoriId, nama, deskripsi, file) {
  try {
    const formData = new FormData();
    
    // ⚠️ WAJIB: Tambahkan _method field
    formData.append('_method', 'PUT');
    formData.append('nama', nama);
    formData.append('deskripsi', deskripsi);
    
    if (file) {
      formData.append('url_foto', file);
    }

    const response = await axios.post(
      `http://localhost:8000/kategori/${kategoriId}`,
      formData,
      {
        headers: {
          // ⚠️ JANGAN set Content-Type manual!
          // Axios akan set otomatis dengan boundary yang benar
        }
      }
    );

    console.log('✅ Update berhasil:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Update gagal:', error.response?.data || error.message);
    return null;
  }
}
```

### React Hook Form Example

```javascript
import { useForm } from 'react-hook-form';

function EditKategoriForm({ kategoriId, initialData }) {
  const { register, handleSubmit } = useForm({
    defaultValues: initialData
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    
    formData.append('_method', 'PUT');
    formData.append('nama', data.nama);
    formData.append('deskripsi', data.deskripsi);
    
    if (data.url_foto && data.url_foto[0]) {
      formData.append('url_foto', data.url_foto[0]);
    }

    try {
      const response = await fetch(`http://localhost:8000/kategori/${kategoriId}`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.status) {
        alert('✅ Kategori berhasil diupdate!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input 
        type="text" 
        {...register('nama')} 
        placeholder="Nama Kategori"
      />
      
      <textarea 
        {...register('deskripsi')} 
        placeholder="Deskripsi"
      />
      
      <input 
        type="file" 
        {...register('url_foto')} 
        accept="image/*"
      />
      
      <button type="submit">Update Kategori</button>
    </form>
  );
}
```

---

## 📤 Response Format

### Success Response (200 OK)

```json
{
  "status": true,
  "message": "Category updated",
  "data": {
    "id": "e595f92e-335a-4529-8056-1c483322cabc",
    "nama": "Seascape",
    "deskripsi": "Ada sebuah tempat di mana dunia berhenti bicara...",
    "url_foto": "/uploads/kategori/45e66172cbcb92308c67670aaf676ea5.jpg",
    "created_at": "2026-01-13T01:09:36.000000Z",
    "updated_at": "2026-01-13T01:42:07.000000Z"
  }
}
```

### Error Response (404 Not Found)

```json
{
  "status": false,
  "message": "Category not found",
  "data": null
}
```

---

## 🚫 Common Mistakes (Kesalahan Umum)

### ❌ Mistake 1: Menggunakan PUT dengan FormData

```javascript
// ❌ SALAH - Ini tidak akan berhasil!
const formData = new FormData();
formData.append('nama', 'Seascape');
formData.append('deskripsi', 'Deskripsi...');

fetch(url, {
  method: 'PUT',  // ← SALAH!
  body: formData
});
```

**Solusi**: Gunakan POST + `_method=PUT`

---

### ❌ Mistake 2: Lupa Menambahkan _method Field

```javascript
// ❌ SALAH - Backend tidak tahu ini PUT request!
const formData = new FormData();
formData.append('nama', 'Seascape');
// formData.append('_method', 'PUT');  ← LUPA INI!

fetch(url, {
  method: 'POST',
  body: formData
});
```

**Solusi**: Selalu tambahkan `formData.append('_method', 'PUT')`

---

### ❌ Mistake 3: Set Content-Type Manual untuk FormData

```javascript
// ❌ SALAH - Boundary akan rusak!
const formData = new FormData();
formData.append('_method', 'PUT');
formData.append('nama', 'Seascape');

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data'  // ← SALAH!
  },
  body: formData
});
```

**Solusi**: JANGAN set Content-Type, biarkan browser handle

---

### ❌ Mistake 4: Nama Field Salah

```javascript
// ❌ SALAH - Field name tidak sesuai
formData.append('_method', 'PUT');
formData.append('name', 'Seascape');        // ← Harusnya 'nama'
formData.append('description', '...');      // ← Harusnya 'deskripsi'
formData.append('photo', file);             // ← Harusnya 'url_foto'
```

**Field names yang benar:**
- `nama` (bukan name)
- `deskripsi` (bukan description)
- `url_foto` (bukan photo/image/file)

---

## 🧪 Testing dengan cURL

### Test Update Tanpa File

```bash
curl -X PUT http://localhost:8000/kategori/e595f92e-335a-4529-8056-1c483322cabc \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Seascape",
    "deskripsi": "Ada sebuah tempat di mana dunia berhenti bicara..."
  }'
```

### Test Update Dengan File

```bash
curl -X POST http://localhost:8000/kategori/e595f92e-335a-4529-8056-1c483322cabc \
  -F "_method=PUT" \
  -F "nama=Seascape" \
  -F "deskripsi=Ada sebuah tempat di mana dunia berhenti bicara..." \
  -F "url_foto=@path/to/image.jpg"
```

---

## 🔍 Troubleshooting

### Problem: Data tidak terupdate di database

**Kemungkinan penyebab:**
1. ✅ Cek Network tab di browser DevTools - apakah request terkirim?
2. ✅ Cek Status Code - harusnya 200 OK
3. ✅ Cek Request Payload - apakah data terkirim dengan benar?
4. ✅ Pastikan menggunakan method yang benar (lihat tabel di atas)
5. ✅ Jika pakai FormData, pastikan ada field `_method=PUT`

### Problem: Error 404 Not Found

**Penyebab:** ID kategori salah atau tidak ada di database

**Solusi:** 
- Cek ID kategori dengan `GET /kategori` untuk list semua
- Pastikan ID yang dikirim valid UUID

### Problem: File tidak terupload

**Kemungkinan penyebab:**
1. ✅ Lupa tambahkan `accept="image/*"` di input file
2. ✅ Nama field salah (harusnya `url_foto`)
3. ✅ Tidak menggunakan POST + `_method=PUT`
4. ✅ Set Content-Type manual (jangan lakukan ini!)

---

## 📝 Field Specifications

| Field | Type | Required | Max Length | Notes |
|-------|------|----------|------------|-------|
| `nama` | string | ❌ | 255 | Nama kategori |
| `deskripsi` | string/text | ❌ | - | Deskripsi panjang kategori |
| `url_foto` | file | ❌ | 10MB | Foto display kategori (jpg, jpeg, png) |
| `_method` | string | ⚠️ Ya jika POST | - | Must be "PUT" when using FormData |

**Notes:**
- Semua field bersifat opsional saat update
- Field yang tidak dikirim tidak akan diubah (tetap seperti sebelumnya)
- Jika ingin menghapus deskripsi, kirim string kosong: `"deskripsi": ""`

---

## 📚 Related Endpoints

### Get All Categories
```http
GET /kategori
```

### Get Category by ID
```http
GET /kategori/{id}
```

### Create Category
```http
POST /kategori
Content-Type: multipart/form-data

nama=Seascape (required)
deskripsi=... (optional)
url_foto=(file) (optional)
```

### Delete Category
```http
DELETE /kategori/{id}
```

---

## 💡 Best Practices

1. **Validation di Frontend**
   - Validasi input sebelum kirim ke server
   - Minimal validasi: nama tidak boleh kosong
   - Validasi file: max 10MB, hanya image types

2. **Loading States**
   - Tampilkan loading indicator saat request
   - Disable button submit selama loading

3. **Error Handling**
   - Handle network errors (connection timeout, etc)
   - Tampilkan error message yang user-friendly

4. **Success Feedback**
   - Tampilkan success message setelah update
   - Update UI dengan data terbaru dari response

---

## 📞 Support

Jika ada masalah atau pertanyaan:
1. Cek dokumentasi ini terlebih dahulu
2. Test dengan cURL untuk isolasi masalah
3. Cek console browser untuk error messages
4. Hubungi tim backend dengan detail error

---

**Last Updated:** 13 Januari 2026  
**Backend Version:** 1.0  
**Tested with:** PHP 8.2.12, Slim 4
