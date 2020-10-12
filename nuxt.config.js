export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Tornado.cash',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'manifest', href: '/manifest.json' },
      {
        rel: 'shortcut icon',
        type: 'image/x-icon',
        href: '/favicon/favicon.ico',
      },
      { rel: 'apple-touch-icon', href: '/favicon/apple-touch-icon.png' },
    ],
  },

  // Customize the progress-bar color
  loading: { color: '#44F1A6', height: '5px', duration: 5000 },

  loadingIndicator: {
    name: 'circle',
    color: '#44F1A6',
    background: '#000',
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@/assets/styles/app.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/buefy
    [
      'nuxt-buefy',
      {
        css: false,
        materialDesignIcons: false,
        defaultIconPack: 'trnd',
        customIconPacks: {
          trnd: {
            sizes: {
              default: 'trnd-24px',
              'is-small': null,
              'is-medium': 'trnd-36px',
              'is-large': 'trnd-48px',
            },
            iconPrefix: 'trnd-',
          },
        },
      },
    ],
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
}
