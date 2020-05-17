module.exports = {
  "lintOnSave": false,
  "devServer": {
    "useLocalIp": false,
    "public": "http://localhost:8080"
  },
  "pluginOptions": {
    "s3Deploy": {
      "awsProfile": "default",
      "region": "us-west-2",
      "bucket": "auvcontrol.com",
      "createBucket": false,
      "staticHosting": true,
      "staticIndexPage": "index.html",
      "staticErrorPage": "index.html",
      "assetPath": "dist",
      "assetMatch": "**",
      "deployPath": "/",
      "acl": "public-read",
      "pwa": false,
      "enableCloudfront": false,
      "uploadConcurrency": 5,
      "pluginVersion": "3.0.0"
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}