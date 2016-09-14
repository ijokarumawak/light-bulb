var awsIot = require('aws-iot-device-sdk');
var fs = require('fs')

const thingName = 'LightBulb';
const outputJsFile = 'js/refreshLight.js';

const thingShadows = awsIot.thingShadow({
  keyPath: 'certs/private.pem.key',
  certPath: 'certs/certificate.pem.crt',
  caPath: 'certs/root-CA.crt',
  clientId: thingName,
  region: 'ap-northeast-1'
});

thingShadows.on('connect', function() {
  console.log('Connected to AWS IoT!');
  thingShadows.register(thingName);

  // Get the preserved state.
  // This seems triggering 'state' event.
  thingShadows.get(thingName);

  thingShadows.on('status', function(thingName, stat, clientToken, stateObject) {
    console.log('stat', stat);
    console.log('status', stateObject);
    if (stateObject.state && stateObject.state.desired) {
      updateLight(stateObject.state.desired);
    }
  });

  thingShadows.on('delta', function(thingName, stateObject) {
    console.log('delta', stateObject);
    if (stateObject.state) {
      updateLight(stateObject.state);
    }
  });
});

var updateLight = function(state) {
  var r = typeof(state.r) === 'number' ? state.r : 0;
  var g = typeof(state.g) === 'number' ? state.g : 0;
  var b = typeof(state.b) === 'number' ? state.b : 0;

  var data = 'setLightColor(' + r + ',' + g + ',' + b + ');';
  fs.writeFile(outputJsFile, data, (err) => {
    if(err) {
      return console.log('Failed to update', outputJsFile, err);
    }
    console.log('Updated.', outputJsFile);
  });
}
