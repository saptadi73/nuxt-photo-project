export const useSEO = (options: {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
}) => {
  useHead({
    title: `${options.title} | Judy Sewa Foto`,
    meta: [
      {
        name: 'description',
        content: options.description
      },
      {
        name: 'keywords',
        content: options.keywords || 'sewa foto, rental kamera, studio foto'
      },
      {
        property: 'og:title',
        content: `${options.title} | Judy Sewa Foto`
      },
      {
        property: 'og:description',
        content: options.description
      },
      {
        property: 'og:type',
        content: options.type || 'website'
      },
      ...(options.image ? [{
        property: 'og:image',
        content: options.image
      }] : []),
      ...(options.url ? [{
        property: 'og:url',
        content: options.url
      }] : []),
      {
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        name: 'twitter:title',
        content: `${options.title} | Judy Sewa Foto`
      },
      {
        name: 'twitter:description',
        content: options.description
      },
      ...(options.image ? [{
        name: 'twitter:image',
        content: options.image
      }] : [])
    ],
    link: [
      {
        rel: 'canonical',
        href: options.url || `https://judy-sewa-foto.com`
      }
    ]
  });
};
