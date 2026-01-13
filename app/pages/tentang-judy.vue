<template>
  <div class="min-h-screen bg-slate-50">
    <main class="mx-auto max-w-6xl px-6 py-12 lg:py-16">
      <header class="mb-10 space-y-3 text-center lg:text-left">
        <p class="text-xs uppercase tracking-[0.25em] text-gray-500">Tentang Judy</p>
        <h1 class="font-caveat text-5xl text-slate-900">Mengenal Judynata</h1>
        <div class="h-[1px] w-full bg-gray-300" />
        <p class="text-base text-gray-600">Perjalanan visual yang lahir dari keheningan dan kejujuran warna hitam putih.</p>
      </header>

      <section class="flex flex-col gap-10 lg:flex-row lg:items-start">
        <figure class="w-full lg:w-[40vw] overflow-hidden rounded-2xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-200">
          <div class="aspect-[2/3] lg:aspect-[9/16] w-full bg-slate-100">
            <img
              :src="judyPortrait"
              alt="Judynata dengan kamera"
              class="h-full w-full object-cover" />
          </div>
          <figcaption class="px-5 py-4 text-sm text-gray-500">
            Judynata, menangkap keheningan diantara hitam dan putih, mengungkap banyak makna.
          </figcaption>
        </figure>

        <article class="space-y-6 rounded-2xl bg-white p-6 shadow-lg shadow-slate-900/5 ring-1 ring-slate-200">
          <div class="space-y-4 text-gray-700 leading-relaxed">
            <p v-for="(paragraph, idx) in aboutParagraphs" :key="idx">{{ paragraph }}</p>
          </div>
          <div class="rounded-xl border border-dashed border-gray-200 bg-slate-50 px-5 py-4 text-sm italic text-gray-600">
            "Keheningan memberinya ruang; warna hitam putih memberinya kejujuran."
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import judyPortrait from '~/assets/images/judy.jpeg';

const aboutParagraphs = [
  'Kamera saku tak pernah absen dari genggamannya; ia adalah kawan setia ke mana pun kaki melangkah.',
  'Sebagai putra seorang diplomat militer, Judy beruntung dapat melintasi berbagai belahan dunia.',
  'Perjalanan itu menumbuhkan kecintaannya pada lanskap, garis horizon ciptaan Tuhan, hingga harmoni arsitektur klasik dan modern yang ia abadikan dalam bingkai lensa.',
  'Baginya, merekam gambar dalam keterbatasan bingkai justru memberikan makna yang jauh lebih dalam dibandingkan pandangan mata yang tanpa batas.',
  'Seiring waktu, ia tak hanya menyukai batasan ruang, tetapi juga kejujuran warna hitam dan putih. Baginya, monokrom adalah bahasa visual yang paling lugas dan jujur.',
  'Melalui kamera kesayangannya, Judy terus berkarya, menciptakan dunia dalam setiap jepretan.',
  'Selamat menikmati karya-karya menakjubkan ini. Selamat menyelami ide dan kedalaman makna yang tersirat di dalamnya.'
];
</script>
