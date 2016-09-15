var fs = require('fs');
var moment = require('moment');


var measureFile = (file) => {
  var content = fs.readFileSync(file);
  
  var tweets = JSON.parse(content);
  var total = tweets.reduce((count, tweet) => {
    return count + tweet.text.length;
  }, 0);
  
  return total;
}

var from = moment().subtract(30, 'seconds').format('YYYYMMDDHHmmss');

var measureColor = (color, callback) => {
  var dir = './tweets/' + color;
  fs.readdir(dir, (err, files) => {

    if (err) return callback(err);

    var total = files.filter((file) => {
      return (from + '.json') <= file;
    }).reduce((count, file) => {
      return count + measureFile(dir + '/' + file);
    }, 0);
    callback(null, total);
  });
}

var measureColors = (callback) => {
  measureColor('red', (err, r) => {
    if (err) return callback(err);
  
    measureColor('green', (err, g) => {
      if (err) return callback(err);
  
      measureColor('blue', (err, b) => {
        if (err) return callback(err);
  
        var max = Math.max(r, g, b);
        if (max > 255) {
          // Normalize.
          var n = 255 / max;
          r = Math.round(r * n);
          g = Math.round(g * n);
          b = Math.round(b * n);
        }
        callback(null, {r: r, g: g, b: b});
      });
    });
  });
}

/*
 * Usage:
var twitterCount = require('./twitter-count');
twitterCount.measureColors((err, rgb) => {
  console.log(err, rgb);
});
*/
module.exports.measureColors = measureColors;
