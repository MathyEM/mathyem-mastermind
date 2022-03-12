module.exports = {
  css: {
      loaderOptions: {
          sass: {
              sourceMap: false
          }
      }
  },
  pwa: {
    manifestCrossorigin: 'use-credentials',
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