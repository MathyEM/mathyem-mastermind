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
    appleMobileWebAppStatusBarStyle: 'black',
    backgroundColor: '#121212',
    themeColor: '#121212',
    manifestOptions: {
      name: "Mastermind",
      short_name: "Mastermind",
      theme_color: '#121212',
      background_color: '#121212',
      "icons": [{
        "src": "img/icons/mastermind-logo-dark-48.png",
        "sizes": "48x48",
        "type": "image/png"
      },
      {
        "src": "img/icons/mastermind-logo-dark-72.png",
        "sizes": "72x72",
        "type": "image/png"
      },
      {
        "src": "img/icons/mastermind-logo-dark-96.png",
        "sizes": "96x96",
        "type": "image/png"
      },
      {
        "src": "img/icons/mastermind-logo-dark-144.png",
        "sizes": "144x144",
        "type": "image/png"
      },
      {
        "src": "img/icons/mastermind-logo-dark-168.png",
        "sizes": "168x168",
        "type": "image/png"
      },
      {
        "src": "img/icons/mastermind-logo-dark-192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "img/icons/mastermind-logo-dark-256.png",
        "sizes": "256x256",
        "type": "image/png"
      },
      {
        "src": "img/icons/mastermind-logo-dark-512.png",
        "sizes": "512x512",
        "type": "image/png"
      }],
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