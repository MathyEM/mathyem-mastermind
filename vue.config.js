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
  },
  devServer: {
      host: '0.0.0.0',
      disableHostCheck: true
  }
}