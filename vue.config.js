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
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
    manifestOptions: {
      name: "Mastermind",
      short_name: "Mastermind"
    }
  },
  devServer: {
      host: '0.0.0.0',
      disableHostCheck: true
  }
}