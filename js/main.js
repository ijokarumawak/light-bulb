const light = document.querySelector('#light');
const fadeStop1 = document.querySelector('#fade-stop-1');

const barR = document.querySelector('#metric-bar-r');
const barG = document.querySelector('#metric-bar-g');
const barB = document.querySelector('#metric-bar-b');

const valR = document.querySelector('#metric-r');
const valG = document.querySelector('#metric-g');
const valB = document.querySelector('#metric-b');

const twnReload = document.querySelector('#tweet-navi-reload');
const twnR = document.querySelector('#tweet-navi-r');
const twnG = document.querySelector('#tweet-navi-g');
const twnB = document.querySelector('#tweet-navi-b');

const twsR = document.querySelector('#tweets-r');
const twsG = document.querySelector('#tweets-g');
const twsB = document.querySelector('#tweets-b');

var limitC = function(n) {
  var c = n;
  if (c < 0) c = 0;
  if (c > 255) c = 255;
  return c;
}

var componentToHex = function(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

var rgbToHex = function(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

var setLightColor = function(r, g, b) {
  r = limitC(r);
  g = limitC(g);
  b = limitC(b);
  var color = rgbToHex(r, g, b);
  light.style.fill = color;
  fadeStop1.style.stopColor = color;

  barR.style.width = r + 'px';
  barG.style.width = g + 'px';
  barB.style.width = b + 'px';

  valR.textContent = r;
  valG.textContent = g;
  valB.textContent = b;
}

var refreshLightScript;
var refreshLight = function() {
  if (refreshLightScript) {
    refreshLightScript.parentNode.removeChild(refreshLightScript);
  }
  var script = document.createElement('script');
  script.setAttribute('src', 'js/refreshLight.js');
  document.head.appendChild(script);
  refreshLightScript = script;
}

setInterval(refreshLight, 5000);

clickTweetNavi = (evt) => {
  var clicked = evt.target.textContent;
  twsR.style.display = clicked === 'Red' ? '' : 'none';
  twnR.style.color = clicked === 'Red' ? 'white' : 'gray';

  twsG.style.display = clicked === 'Green' ? '' : 'none';
  twnG.style.color = clicked === 'Green' ? 'white' : 'gray';

  twsB.style.display = clicked === 'Blue' ? '' : 'none';
  twnB.style.color = clicked === 'Blue' ? 'white' : 'gray';
}


const url = 'http://localhost:8180';

var reloadTweets = () => {
  console.log('loading tweets...');
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var tweets = JSON.parse(this.responseText);
      renderTweets(tweets);
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  
}

var renderTweetsFor = (tws, tweets) => {
  tweets.forEach((t) => {
    var tdiv = document.createElement('div');
    tdiv.className = "tweet";

    var ta = document.createElement('a');
    ta.href = 'https://twitter.com/' + t.user.screen_name + '/status/' + t.id_str;
    ta.target = '_blank';

    var timg = document.createElement('img');
    timg.src = t.user.profile_image_url_https;
    timg.className = "tweet-pimg";

    var ttxt = document.createElement('div');
    ttxt.className = "tweet-text";
    ttxt.textContent = t.text;

    ta.appendChild(timg);
    tdiv.appendChild(ta);
    tdiv.appendChild(ttxt);

    tws.appendChild(tdiv);
  });
}

var renderTweets = (tweets) => {
  console.log(tweets);
  // Delete old tweets.
  document.querySelectorAll('.tweet').forEach((t) => {
    t.parentNode.removeChild(t);
  });
  renderTweetsFor(twsR, tweets.r);
  renderTweetsFor(twsG, tweets.g);
  renderTweetsFor(twsB, tweets.b);
}

twnReload.onclick = reloadTweets;
twnR.onclick = clickTweetNavi;
twnG.onclick = clickTweetNavi;
twnB.onclick = clickTweetNavi;

// Initialize tweets
reloadTweets();
