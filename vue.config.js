module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.spaceport.to',
        secure: true,
        pathRewrite: {
          "^/api": ""
      }
      }
    }
  }
}
