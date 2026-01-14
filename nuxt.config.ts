import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  srcDir: 'app',
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['assets/css/main.css'],
  imports: {
    autoImport: true,
  },
  nitro: {
    preset: 'node-server',
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'id'
      },
      meta: [
        {
          name: 'description',
          content: 'Judy Sewa Foto - Rental alat fotografi profesional dan jasa pemotretan'
        },
        {
          name: 'keywords',
          content: 'sewa foto, rental kamera, studio foto, fotografer, pemotretan'
        },
        {
          name: 'author',
          content: 'Judy Photography'
        },
        {
          property: 'og:title',
          content: 'Judy Sewa Foto - Rental Alat Fotografi'
        },
        {
          property: 'og:description',
          content: 'Layanan sewa alat fotografi profesional dan jasa pemotretan berkualitas tinggi'
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          name: 'robots',
          content: 'index, follow'
        },
        {
          name: 'google-site-verification',
          content: 'YOUR_GOOGLE_VERIFICATION_CODE'
        }
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://judy-sewa-foto.com'
        },
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Caveat:wght@400..700&family=Handlee&family=Lexend:wght@100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Roboto:ital,wght@0,100..900;1,100..900&family=TikTok+Sans:opsz,wght@12..36,300..900&display=swap'
        }
      ]
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    build: {
      sourcemap: false,
    },
  },
});