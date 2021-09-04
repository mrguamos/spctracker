import colors from 'vuetify/es5/util/colors'

export default {
  googleAnalytics: {
    id: 'UA-206693173-1',
  },
  extend(config, { isDev, isClient }) {
    config.externals = config.externals || {}
    config.externals.push({
      electron: 'electron',
    })
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'SpacePort Tracker',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'spaceport', content: 'spaceport' },
      { name: 'spc', content: 'spc' },
      { name: 'spctracker', content: 'spctracker' },
      { name: 'tracker', content: 'space port tracker' },
      {
        name: 'propeller',
        content: '4f5d8fb70ecbc7cd239e7caddc20a3f6',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: '//inpage-push.com/400/4483847',
        async: 'async',
        'data-cfasync': false,
      },
      {
        src: '//p437628.clksite.com/adServe/banners?tid=437628_857144_4&type=footer&size=26',
        'data-cfasync': false,
      },
      {
        src: '//p437628.clksite.com/adServe/banners?tid=437628_857144_7&type=floating_banner&size=6&side=right&position=bottom',
        'data-cfasync': false,
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/axios.ts', '~/plugins/spc.ts'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv',
    '@nuxtjs/google-analytics',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // ['@nuxtjs/google-adsense',
    // {
    //   id: 'ca-pub-2750678174412562',
    // }]
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  serverMiddleware: [
    { path: '/api', handler: '~/server-middleware/server.ts' },
    '~/server-middleware/redirect.ts',
  ],
  server: {
    host: '0',
  },
}
