const zlib = require("zlib");

module.exports = {
  css: {
      loaderOptions: {
          sass: {
              sourceMap: false,
              prependData: `
              @import "@/assets/scss/_variables.scss";
              @import "@/assets/scss/_material-icons.scss";
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
  },
  pluginOptions: {
    compression:{
      brotli: {
        filename: '[file].br[query]',
        algorithm: 'brotliCompress',
        include: /\.(js|css|html|svg|json)(\?.*)?$/i,
        compressionOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
        minRatio: 0.8,
      },
      gzip: {
        filename: '[file].gz[query]',
        algorithm: 'gzip',
        include: /\.(js|css|html|svg|json)(\?.*)?$/i,
        minRatio: 0.8,
      }
    }
  }
}