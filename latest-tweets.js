var fs = require('fs');
var moment = require('moment');


var getTweetsFromFile = (file) => {
  var content = fs.readFileSync(file);
  
  var tweets = JSON.parse(content);
  
  return tweets;
}

var from = moment().subtract(30, 'seconds').format('YYYYMMDDHHmmss');

var getTweetsForColor = (color, callback) => {
  var dir = './tweets/' + color;
  fs.readdir(dir, (err, files) => {

    if (err) return callback(err);

    var tweets = files.filter((file) => {
      return (from + '.json') <= file;
    }).reduce((tweets, file) => {
      return tweets.concat(getTweetsFromFile(dir + '/' + file));
    }, new Array());
    callback(null, tweets);
  });
}

var cp = (a, b) => {
  if (a.created_at < b.created_at) return 1;
  if (a.created_at > b.created_at) return -1;
  return 0;
}

var getColorTweets = (callback) => {
  getTweetsForColor('red', (err, r) => {
    if (err) return callback(err);
  
    getTweetsForColor('green', (err, g) => {
      if (err) return callback(err);
  
      getTweetsForColor('blue', (err, b) => {
        if (err) return callback(err);
  
        callback(null, {r: r.sort(cp), g: g.sort(cp), b: b.sort(cp)});
      });
    });
  });
}

getColorTweets((err, tweets) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(JSON.stringify(tweets));
});
