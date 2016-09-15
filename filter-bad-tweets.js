var fs = require('fs');
var readline = require('readline');

const badwordsDir = './badwords/';

var loadBadWords = (lang) => {
  var badWords = fs.readFileSync(badwordsDir + lang);
  return badWords.toString().split('\n').filter((w) => {return w.length > 0;});
}

const badWordsEn = loadBadWords('en');
const badWordsJa = loadBadWords('ja');

const target = process.argv[2];

if ('clean' !== target && 'bad' !== target) {
  console.log('Target must be clean or bad.');
  process.exit(1);
}

var containsBadWord = (text, badWords, mode) => {
  var words = text.split(/\s/);
  for (var i = 0; i < badWords.length; i++) {
    for (var j = 0; j < words.length; j++) {
      if (mode === 'exact') {
        if (words[j].toLowerCase() === badWords[i]) {
          return true;
        }
      } else {
        if (words[j].indexOf(badWords[i]) > -1) {
          return true;
        }
      }
    }
  }
  return false;
}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var jsonStr = '';
rl.on('line', (line) => {
  jsonStr += line
});

var first = true;
var printTweet = (t) => {
  if (!first) console.log(',');
  
  process.stdout.write(JSON.stringify(t));
  first = false;
}
rl.on('close', () => {
  var tweets = JSON.parse(jsonStr);
  var cleanTweets = new Array();
  process.stdout.write('[');
  tweets.forEach((t) => {
    if (containsBadWord(t.text, badWordsEn, 'exact')
      || containsBadWord(t.text, badWordsJa, 'contains')) {
      if (target === 'bad') printTweet(t);
    } else {
      if (target === 'clean') printTweet(t);
    }
  });
  console.log(']');
});
