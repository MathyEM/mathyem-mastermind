module.exports = {
  css: {
      loaderOptions: {
          sass: {
              sourceMap: false,
              prependData: `
              @import "@/assets/scss/_variables.scss";
              `,
          }
      }
  },
  pwa: {
    manifestCrossorigin: 'use-credentials',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: "./src/service-worker.js",
    },
    manifestOptions: {
      name: "Mastermind",
      short_name: "Mastermind",
      theme_color: '#ffb700',
    }
  },
  devServer: {
      host: '0.0.0.0',
      disableHostCheck: true
  }
}