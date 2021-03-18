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
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
      },
      { name: 'theme-color', content: '#000403' },
      {
        hid: 'description',
        name: 'description',
        content: 'Ceremony for new Tornado.Cash instances',
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Tornado.Cash instance deployment',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'Ceremony for new Tornado.Cash instances',
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://tornado.cash',
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'website',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://tornado.cash/tw.png',
      },
      {
        hid: 'description',
        name: 'description',
        content:
          'Non-custodial, trustless, serverless, private transactions on Ethereum network',
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content:
          'Ethereum, ERC20, WBTC, cDAI, dapp, smart contract, decentralized, metamask, zksnark, zero knowledge',
      },
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
  plugins: ['~/plugins/i18n.js'],

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
    'nuxt-web3-provider',
  ],

  provider: {
    rpcUrl: 'https://mainnet.infura.io/v3/da564f81919d40c9a3bcaee4ff44438d',
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.output.publicPath = './_nuxt/'
    },
    // splitChunks: {
    //   commons: false
    // }
  },

  router: {
    linkActiveClass: '',
    linkExactActiveClass: 'is-active',
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'ipfs-root',
        path: '*',
        component: resolve(__dirname, 'pages/index.vue'),
      })
    },
  },
}
