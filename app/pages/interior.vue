<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <div class="bg-gradient-to-b from-slate-900 to-slate-800 py-16 px-4">
      <div class="max-w-6xl mx-auto text-center">
        <h1 class="text-3xl md:text-5xl font-bold font-caveat text-white mb-4">Interior Design</h1>
        <p class="text-2xl lg:text-3xl font-caveat text-gray-300 max-w-2xl mx-auto">
          Koleksi karya fotografi untuk melengkapi desain interior Hotel dan Perkantoran yang elegan dan timeless
        </p>
      </div>
    </div>

    <!-- Introduction Section -->
    <div class="bg-gray-50 py-12 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-slate-900 mb-4">Keindahan Interior dengan Hiasan Foto Dinding Monokromatik yang Syahdu dan Elegan</h2>
        <p class="text-gray-700 leading-relaxed">
          Fotografi Hitam Putih adalah seni menangkap essense dari sisi keheningan manusia. Dengan pendekatan hitam putih, setiap detail, tekstur, dan pencahayaan menjadi lebih bermakna.
        </p>
      </div>
    </div>

    <!-- Gallery Grid -->
    <div class="py-12 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="(item, index) in interiorItems"
            :key="index"
            class="cursor-pointer group"
            @click="openModal(index)"
          >
            <div class="aspect-square overflow-hidden rounded-lg bg-gray-300 shadow-md hover:shadow-xl transition-shadow">
              <img
                :src="item.image"
                :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 class="mt-3 font-semibold text-slate-900 text-sm">{{ item.title }}</h3>
            <p class="text-xs text-gray-600 mt-1 line-clamp-2">{{ item.shortDesc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="bg-slate-900 text-white py-16 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="text-4xl font-bold mb-3 text-amber-400">8+</div>
            <h3 class="text-lg font-semibold mb-2">Lokasi Interior</h3>
            <p class="text-gray-300">Hotel dan perkantoran eksklusif</p>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold mb-3 text-amber-400">100%</div>
            <h3 class="text-lg font-semibold mb-2">Hitam Putih</h3>
            <p class="text-gray-300">Nuansa monokrom yang elegan dan timeless</p>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold mb-3 text-amber-400">Pro</div>
            <h3 class="text-lg font-semibold mb-2">Kualitas</h3>
            <p class="text-gray-300">Hasil jepretan profesional dengan detail sempurna</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="py-20 px-4">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
          Tertarik dengan Portfolio Kami?
        </h2>
        <p class="text-lg text-gray-700 mb-8 leading-relaxed">
          Koleksi Judybata Fotografi memperindah interior ruangan Anda dengan sentuhan artistik dan profesional.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="https://www.instagram.com/judynad/"
            target="_blank"
            class="inline-flex items-center justify-center px-8 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Hubungi Kami
          </NuxtLink>
          <NuxtLink
            to="/tentang-judy"
            class="inline-flex items-center justify-center px-8 py-3 border-2 border-slate-900 text-slate-900 font-semibold rounded-lg hover:bg-slate-50 transition-colors duration-300"
          >
            Tentang Judy
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Modal for Full Image View -->
    <div
      v-if="selectedIndex !== null"
      @click="closeModal"
      class="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
    >
      <div
        @click.stop
        class="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto shadow-2xl"
      >
        <div class="relative">
          <!-- Close Button -->
          <button
            @click="closeModal"
            class="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors z-10 shadow-md"
          >
            <svg
              class="w-6 h-6 text-slate-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Image -->
          <img
            v-if="selectedIndex !== null && interiorItems[selectedIndex]"
            :src="interiorItems[selectedIndex]?.image"
            :alt="interiorItems[selectedIndex]?.title"
            class="w-full h-auto"
          />
        </div>

        <!-- Content -->
        <div class="p-6">
          <h2 class="text-2xl font-bold text-slate-900 mb-3">
            {{ interiorItems[selectedIndex]?.title ?? 'Interior' }}
          </h2>
          <p class="text-gray-700 leading-relaxed mb-6">
            {{ interiorItems[selectedIndex]?.description ?? '' }}
          </p>

          <!-- Navigation -->
          <div class="flex gap-3">
            <button
              @click="prevImage"
              class="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              ← Sebelumnya
            </button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import interior1 from '~/assets/images/interior/interior1.jpg';
import interior2 from '~/assets/images/interior/interior2.jpg';
import interior3 from '~/assets/images/interior/interior3.jpg';
import interior4 from '~/assets/images/interior/interior4.jpg';
import interior5 from '~/assets/images/interior/interior5.jpg';
import interior6 from '~/assets/images/interior/interior6.jpg';
import interior7 from '~/assets/images/interior/interior7.jpg';
import interior8 from '~/assets/images/interior/interior8.jpg';
import interior9 from '~/assets/images/interior/interior9.jpg';
import interior91 from '~/assets/images/interior/interior91.jpg';
import { useSEO } from '~/composables/useSEO';

const selectedIndex = ref<number | null>(null);

  // SEO Setup
useSEO({
  title: 'Interior | Judynata Fotografi',
  description: 'Keindahan Interior dengan Hiasan Foto Dinding Monokromatik yang Syahdu dan Elegan',
  keywords: 'interior, keheningan, hitam putih, fotografi, judynata, solitude, abstraksi, visual, seni, makna, emosi',
  image: interior7,
  url: 'https://judynatafotografi.com/',
  type: 'website'
});

const interiorItems = [
  {
    image: interior1,
    title: 'Grand Lobby Hotel Mewah',
    shortDesc: 'Tampilan memukau dari lobby utama dengan kolom-kolom megah dan pencahayaan dramatis.',
    description: 'Fotografi interior dari lobby hotel bintang lima menangkap arsitektur modern dengan detail marmer dan pencahayaan ambient yang sempurna. Setiap elemen dirancang untuk menciptakan first impression yang memorable bagi setiap tamu yang memasuki ruangan ini. Nuansa hitam putih memberikan kesan yang timeless dan eksklusif.'
  },
  {
    image: interior2,
    title: 'Ruang Tunggu Perkantoran Modern',
    shortDesc: 'Desain interior kantor contemporary dengan furniture minimalis dan layout yang fungsional.',
    description: 'Ruang tunggu perkantoran modern yang dirancang dengan prinsip minimalis namun tetap hangat. Kombinasi garis-garis tegas dan cahaya alami menciptakan suasana profesional namun welcoming. Fotografi monokrom menekankan clean lines dan spatial hierarchy dari desain interior ini.'
  },
  {
    image: interior5,
    title: 'Kamar Meeting Eksklusif',
    shortDesc: 'Ruang pertemuan dengan tabel dan kursi berkualitas tinggi, pencahayaan profesional.',
    description: 'Meeting room yang dirancang khusus untuk mendukung kegiatan bisnis profesional dengan teknologi audiovisual terintegrasi. Desain interior mengutamakan kenyamanan dan fokus dengan pemilihan material acoustic yang tepat. Fotografi hitam putih menampilkan kesederhanaan elegan dan fungsionalitas ruangan.'
  },
  {
    image: interior3,
    title: 'Koridor Hotel dengan Pencahayaan Dramatis',
    shortDesc: 'Hallway hotel dengan lighting design yang sophisticated menciptakan suasana mysterious.',
    description: 'Koridor panjang dengan pencahayaan yang carefully curated untuk menciptakan pengalaman visual yang menarik. Setiap titik cahaya ditempatkan strategis untuk menekankan arsitektur dan menciptakan depth. Fotografi monokrom mengungkap play of light and shadow yang menghasilkan dimensi visual yang memikat.'
  },
  {
    image: interior9,
    title: 'Restaurant Interior dengan Ambiance Intimate',
    shortDesc: 'Desain restoran yang menciptakan suasana intim dan sophisticated untuk dining experience.',
    description: 'Interior restoran yang menekankan intimacy dan comfort dengan pemilihan furniture dan dekorasi yang cermat. Pencahayaan diorientasikan untuk menciptakan focal points dan mendefinisikan setiap dining area. Fotografi hitam putih mengcapture essence dari elegant simplicity dalam design culinary space ini.'
  },
  {
    image: interior6,
    title: 'Executive Lounge dengan Furniture Premium',
    shortDesc: 'Lounge eksklusif dengan leather furniture berkualitas tinggi, artwork, dan ambient lighting.',
    description: 'Executive lounge yang dirancang sebagai sanctuary untuk relaxation dan informal meetings dengan pemilihan furniture mewah dan artwork bermutu. Setiap material dipilih dengan teliti untuk menciptakan comfort dan prestige. Fotografi monokrom menyoroti textures mewah dan spatial proportion dari ruangan.'
  },
  {
    image: interior91,
    title: 'Balkon Hotel dengan City View',
    shortDesc: 'Balcony area dengan railing modern dan pemandangan cityscape yang stunning.',
    description: 'Balkon hotel yang menghubungkan interior dengan pemandangan kota menciptakan sense of openness namun tetap intimate. Desain modern dengan material berkualitas memastikan durability dan aesthetic appeal. Fotografi hitam putih mengcapture geometric patterns dan compositional balance dari space ini.'
  },
  {
    image: interior8,
    title: 'Suite Room dengan Private Living Area',
    shortDesc: 'Kamar suite mewah dengan area living terpisah, furniture custom-made, dan detail luxury.',
    description: 'Suite room premium dengan layanan hospitality terbaik yang mencakup living area terpisah, bedroom, dan bathroom yang spacious. Setiap elemen interior dipilih untuk menciptakan home away from home experience bagi tamu. Fotografi monokrom menampilkan elegance dan sophistication dari personal luxury space ini.'
  }
];

const openModal = (index: number) => {
  selectedIndex.value = index;
};

const closeModal = () => {
  selectedIndex.value = null;
};

const nextImage = () => {
  if (selectedIndex.value !== null) {
    selectedIndex.value = (selectedIndex.value + 1) % interiorItems.length;
  }
};

const prevImage = () => {
  if (selectedIndex.value !== null) {
    selectedIndex.value = (selectedIndex.value - 1 + interiorItems.length) % interiorItems.length;
  }
};
</script>

<style scoped>
/* Elegant scrollbar for modal */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f3f4f6;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
