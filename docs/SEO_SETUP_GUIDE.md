# Panduan SEO untuk Nuxt Proyecto Foto

## Setup yang Sudah Dilakukan

### 1. **Global SEO Configuration**
- ✅ Metadata global di `nuxt.config.ts`
- ✅ Charset UTF-8, viewport responsive
- ✅ Open Graph tags untuk social sharing
- ✅ Twitter Card integration
- ✅ Canonical URLs

### 2. **File SEO yang Dibuat**
- `app/composables/useSEO.ts` - Composable reusable untuk SEO
- `public/sitemap.xml` - XML Sitemap untuk search engines
- `public/robots.txt` - Robots configuration
- `public/seo-config.json` - SEO metadata JSON

### 3. **Implementasi di Halaman**
Home page sudah menggunakan SEO composable

---

## Cara Menggunakan di Halaman Lain

### Contoh di `paket-sewa.vue`:

```vue
<script setup lang="ts">
useSEO({
  title: 'Paket Sewa Foto',
  description: 'Lihat berbagai paket sewa fotografi kami dengan harga terjangkau dan kualitas terbaik',
  keywords: 'paket sewa foto, harga sewa kamera, rental fotografi',
  image: 'https://judy-sewa-foto.com/images/paket-sewa-og.jpg',
  url: 'https://judy-sewa-foto.com/paket-sewa',
  type: 'product'
});
</script>
```

### Contoh di `tentang-judy.vue`:

```vue
<script setup lang="ts">
useSEO({
  title: 'Tentang Kami',
  description: 'Pelajari lebih lanjut tentang Judy Studio, spesialis fotografi profesional sejak 2015',
  keywords: 'tentang judy, studio fotografi, fotografer profesional, sejarah judy',
  image: 'https://judy-sewa-foto.com/images/about-og.jpg',
  url: 'https://judy-sewa-foto.com/tentang-judy',
  type: 'website'
});
</script>
```

### Contoh di `interior.vue`:

```vue
<script setup lang="ts">
useSEO({
  title: 'Galeri Interior',
  description: 'Koleksi foto interior profesional yang inspiratif. Lihat karya-karya terbaik kami',
  keywords: 'fotografi interior, galeri fotografi, desain interior foto',
  image: 'https://judy-sewa-foto.com/images/interior-og.jpg',
  url: 'https://judy-sewa-foto.com/interior',
  type: 'website'
});
</script>
```

---

## Meta Tags yang Dihasilkan

Setiap halaman akan otomatis mendapatkan:

### 1. **Essential Meta Tags**
```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="...">
<meta name="keywords" content="...">
<title>Page Title | Judy Sewa Foto</title>
```

### 2. **Open Graph (untuk Facebook, LinkedIn, dll)**
```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:url" content="...">
<meta property="og:type" content="website">
```

### 3. **Twitter Card (untuk Twitter/X)**
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="...">
```

### 4. **Canonical URL**
```html
<link rel="canonical" href="https://judy-sewa-foto.com/page">
```

---

## Checklist SEO Lengkap

### ✅ Sudah Diimplementasikan
- [x] Global meta tags
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Canonical URLs
- [x] Sitemap XML
- [x] Robots.txt
- [x] Mobile responsive viewport
- [x] Page title optimization
- [x] Meta description
- [x] Language attribute (lang="id")

### ⏳ Perlu Dilakukan Manual
- [ ] Update sitemap.xml dengan semua halaman (sesuaikan dengan routes Anda)
- [ ] Update robots.txt untuk exclude halaman admin
- [ ] Ganti `YOUR_GOOGLE_VERIFICATION_CODE` di nuxt.config.ts
- [ ] Setup Google Search Console
- [ ] Setup Google Analytics
- [ ] Buat OG images untuk setiap halaman (1200x630px)
- [ ] Setup structured data (JSON-LD) untuk rich snippets
- [ ] Optimize gambar (compress & lazy load)
- [ ] Setup CDN untuk asset statis

---

## Step-by-Step Setup Google Search Console

1. Buka https://search.google.com/search-console
2. Verifikasi domain dengan HTML meta tag:
   - Copy code dari Google
   - Paste di `nuxt.config.ts` meta tag `google-site-verification`
3. Submit sitemap: `https://judy-sewa-foto.com/sitemap.xml`
4. Monitor coverage dan errors

---

## Struktur Data (Schema.org) - Opsional Lanjut

Untuk E-commerce/Listing, tambahkan JSON-LD structured data:

```vue
<script setup lang="ts">
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: 'Paket Sewa Kamera Professional',
        description: 'Sewa kamera DSLR profesional...',
        image: 'https://judy-sewa-foto.com/images/camera.jpg',
        offers: {
          '@type': 'Offer',
          price: '150000',
          priceCurrency: 'IDR'
        }
      })
    }
  ]
});
</script>
```

---

## Performance Tips

1. **Image Optimization**
   ```vue
   <img 
     src="image.jpg" 
     alt="descriptive alt text"
     loading="lazy" />
   ```

2. **Lazy Loading Components**
   ```vue
   <LazyComponentName />
   ```

3. **Link Prefetching**
   ```html
   <link rel="prefetch" href="/page-url" />
   ```

---

## Testing & Monitoring

### Tools untuk Testing SEO:
1. **Google Lighthouse** - Chrome DevTools
2. **Semrush** - Full SEO audit
3. **Ahrefs** - Backlink analysis
4. **Moz** - Keyword research
5. **Google PageSpeed Insights** - Performance & SEO

---

## Next Steps

1. ✅ Gunakan `useSEO()` composable di setiap halaman
2. ✅ Update sitemap.xml dengan semua routes
3. ✅ Setup Google Search Console
4. ✅ Setup Google Analytics
5. ✅ Buat OG images untuk social sharing
6. ✅ Test dengan Lighthouse & PageSpeed Insights

Semua sudah siap untuk mulai! 🚀
