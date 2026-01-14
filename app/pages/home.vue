<template>
  <div>
    <header class="relative overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-50">
      <div class="absolute -left-16 -top-24 h-64 w-64 rounded-full bg-amber-200/60 blur-3xl animate-orbit" />
      <div class="absolute -right-20 top-10 h-72 w-72 rounded-full bg-slate-300/40 blur-3xl animate-orbit-slow" />

      <div class="relative mx-auto max-w-6xl px-6 pb-16 pt-10 lg:flex lg:items-center lg:gap-12 lg:pt-16">
        <div class="space-y-5 animate-fade-up">
          <p class="text-xs uppercase tracking-[0.35em] text-gray-500">Tema Utama</p>
          <h1 class="font-caveat text-5xl leading-tight text-slate-800 sm:text-6xl">
            Menyisir Keheningan
          </h1>
          <div class="h-[1px] w-full bg-gray-300" />
          <p class="max-w-2xl text-lg leading-relaxed text-gray-600">
            Menyelami ruang hening, di mana cahaya hitam putih merangkum emosi yang tidak terucap. Empat hal dibawah ini merangkum lintasan ide Judynata tentang solitude, abstraksi, dan ketulusan visual.
          </p>
          <div class="flex flex-wrap gap-3">
            <a href="#articles" class="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/15">Porto Folio</a>
            <button class="group inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white">
              Instagram
              <span class="text-lg transition group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>

        <div class="mt-10 lg:mt-0 lg:flex-1">
          <div class="relative overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200/80 animate-float">
            <img
              :src="nature"
              alt="Menyisir keheningan"
              class="h-full w-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p class="text-sm uppercase tracking-[0.25em] text-white/70">Lens Story</p>
              <p class="font-caveat text-3xl">Sejauh hening, sedalam makna</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main id="articles" class="mx-auto max-w-6xl px-6 py-14 lg:py-16">
      <div class="mb-10 flex items-end justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-gray-500">Dalam Hitam Putih</p>
          <h2 class="font-caveat text-4xl text-slate-900">Keheningan yang Bicara</h2>
          <div class="h-[1px] w-full bg-gray-300" />
        </div>
        <p class="hidden text-sm text-gray-500 lg:block">Tersirat sejuta makna, menyingkap banyak makna</p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <article
          v-for="article in articles"
          :key="article.title"
          class="group relative overflow-hidden rounded-2xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-200 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:ring-slate-300 animate-rise">
          <div class="flex flex-col lg:flex-row">
            <div class="lg:w-2/5 overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-full">
              <img
                :src="article.image"
                :alt="article.title"
                class="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            </div>
            <div class="lg:w-3/5 space-y-3 p-6">
              <div class="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-gray-500">
                <span class="h-px flex-1 bg-gray-200" />
                {{ article.tagline }}
              </div>
              <h3 class="font-caveat text-3xl text-slate-900">{{ article.title }}</h3>
              <div class="h-[1px] w-full bg-gray-200" />
              <p class="text-base leading-relaxed text-gray-600">{{ article.body }}</p>
              <div class="rounded-xl border border-dashed border-gray-200 bg-slate-50 px-4 py-3 text-sm italic text-gray-500">
                "{{ article.quote }}"
              </div>
            </div>
          </div>
          <div class="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
            <div class="absolute -left-6 top-10 h-16 w-16 rounded-full bg-amber-200/60 blur-2xl" />
            <div class="absolute -right-8 bottom-10 h-20 w-20 rounded-full bg-slate-300/50 blur-2xl" />
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useSEO } from '~/composables/useSEO';
import heroImage from '~/assets/images/cityscape1.jpg';
import hitamPutihImage from '~/assets/images/cityscape3.jpg';
import judynataImage from '~/assets/images/cityscape5.jpg';
import cityimage from '~/assets/images/cityscape6.jpg';
import nature from '~/assets/images/nature.jpg';

// SEO Setup
useSEO({
  title: 'Beranda | Judynata Fotografi',
  description: 'Menyelami ruang hening, di mana cahaya hitam putih merangkum emosi yang tidak terucap. Empat hal dibawah ini merangkum lintasan ide Judynata tentang solitude, abstraksi, dan ketulusan visual.',
  keywords: 'keheningan, hitam putih, fotografi, judynata, solitude, abstraksi, visual, seni, makna, emosi',
  image: heroImage,
  url: 'https://judynatafotografi.com/',
  type: 'website'
});

const articles = [
  {
    title: 'Keheningan',
    tagline: 'Solitude & Kedalaman',
    image: heroImage,
    body:
      'Carl Jung menekankan pentingnya keheningan untuk bertemu bawah sadar, sementara Blaise Pascal mengingatkan betapa sulitnya duduk diam sendirian. Keheningan membuka pintu kematangan diri.',
    quote: 'Tanpa keheningan, kita hanya mendengar gema suara kolektif, bukan suara jiwa sendiri.'
  },
  {
    title: 'Hitam Putih',
    tagline: 'Less Is More',
    image: hitamPutihImage,
    body:
      'Warna dihilangkan agar struktur dasar dunia tampil jujur. Ted Grant menyebut hitam putih memotret jiwa, bukan sekadar pakaian. Abstraksi ini mengajak kita merefleksi kedalaman momen.',
    quote: 'Dengan menghapus warna, kita melihat kerangka dan kejujuran momen yang tak tersamar.'
  },
  {
    title: 'Bahasa Visual',
    tagline: 'Obrolan Kosong',
    image: judynataImage,
    body: 'Bahasa menjadi "obrolan kosong" (Gerede). Keheningan (Schweigen) adalah cara manusia untuk "mendengar" panggilan keberadaan (Being) dan memahami makna hidup yang dalam(Martin Heidegger).',
    quote: 'Tanpa keheningan, kata-kata kehilangan bobotnya dan manusia kehilangan kedalaman karakternya.(Max Picard)'
  },
  {
    title: 'Judynata Fotografi',
    tagline: 'Hening yang Mengajak',
    image: cityimage,
    body:
      'Tema "Menyisir Keheningan dalam Hitam Putih" mengajak kembali pada makna yang murni dan asli. Judynata membuka ruang kritik agar karyanya setajam kontras hitam putih yang ia kejar.',
    quote: 'Keheningan adalah ruang dialog antara karya, penikmat, dan kejujuran visual yang terus diasah.'
  }
];
</script>

<style scoped>
.animate-fade-up {
  animation: fadeUp 0.9s ease-out both;
}

.animate-float {
  animation: float 14s ease-in-out infinite;
}

.animate-orbit {
  animation: orbit 16s linear infinite;
}

.animate-orbit-slow {
  animation: orbit 24s linear infinite reverse;
}

.animate-rise {
  animation: rise 0.8s ease-out both;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes orbit {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
