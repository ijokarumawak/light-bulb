var fs = require('fs');
var readline = require('readline');

const lang = process.argv[2];
const mode = process.argv[3];
const badwordsDir = './badwords/';

if (!lang) {
  console.log('Language was not specified.');
  process.exit(1);
}

if (!mode) {
  console.log('Mode was not specified.');
  process.exit(1);
}

if (mode !== 'exact' && mode !== 'contains') {
  console.log('Mode should be either: exact, contains');
  process.exit(1);
}

try {
  fs.accessSync(badwordsDir, fs.F_OK);
} catch (e) {
  console.log(e);
  process.exit(1);
}

var loadBadWords = (lang) => {
  var badWords = fs.readFileSync(badwordsDir + lang);
  return badWords.toString().split('\n').filter((w) => {return w.length > 0;});
}

const badWords = loadBadWords(lang);

var containsBadWord = (text) => {
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

var contains = false;
rl.on('line', (text) => {
  if (!contains) {
    contains = containsBadWord(text);
  }
});

rl.on('close', () => {
  console.log(contains);
});
