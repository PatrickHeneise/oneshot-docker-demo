var config = require('./lib/config'),
  Redis = require('redis'),
  gm = require('gm'),
  fs = require('fs'),
  url = require('url'),
  request = require('request'),
  azure = require('azure-storage'),
  blobService = azure.createBlobService(config.azure.storage.accountName, config.azure.storage.accountKey),
  db = Redis.createClient(config.redis.port, config.redis.host, config.redis.options),
  pub = Redis.createClient(config.redis.port, config.redis.host, config.redis.options);

db.auth(config.redis.password);

var start = function start() {
  db.lpop('cats', function (error, next_cat) {
    if (error) {
      console.log(error);
    }
    if (next_cat) {
      db.get(next_cat, function (error, cat) {
        if (error) {
          console.log(error);
        }
        var ext = cat.substring(cat.length - 3, cat.length),
          file = fs.createWriteStream('cat.' + ext);

        request(cat).pipe(file);

        file.on('finish', function () {
          var readStream = fs.createReadStream('cat.' + ext),
            writeStream = fs.createWriteStream('upload.jpg');

          gm(readStream, 'img.jpg')
            .resize('250', '250', '!')
            .noProfile()
            .stream(function (err, stdout, stderr) {
              stdout.pipe(writeStream);

              stdout.on('finish', function () {
                blobService.createBlockBlobFromLocalFile('kittycontainer', next_cat + '.jpg', 'upload.jpg', function (error, result, response) {
                  if (!error) {
                    console.log(next_cat + ' done.');
                    pub.publish('images', next_cat + '.jpg');
                  }
                });
              });
            });
        });
      });
    } else {
      console.log('no cats in the box.');
    }
  });
};

console.log('starting');
setInterval(function () {
  start();
}, 5000);
