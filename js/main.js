const light = document.querySelector('#light');
const fadeStop1 = document.querySelector('#fade-stop-1');

const barR = document.querySelector('#metric-bar-r');
const barG = document.querySelector('#metric-bar-g');
const barB = document.querySelector('#metric-bar-b');

const valR = document.querySelector('#metric-r');
const valG = document.querySelector('#metric-g');
const valB = document.querySelector('#metric-b');

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
