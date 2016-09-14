var awsIot = require('aws-iot-device-sdk');

const thingName = 'LightBulb';

const thingShadows = awsIot.thingShadow({
  keyPath: 'certs/private.pem.key',
  certPath: 'certs/certificate.pem.crt',
  caPath: 'certs/root-CA.crt',
  clientId: 'NiFi',
  region: 'ap-northeast-1'
});

var readArg = (i, x) => {
  var n = process.argv[i];
  if (typeof(n) === 'string') {
    n = parseInt(n);
  }
  if (typeof(n) !== 'number') {
    console.log('Arg[' + i + '] for ' + x + ' was not a number.');
    process.exit(1);
  }
  if (n < 0) return 0;
  if (n > 255) return 255;
  return n;
}


var r = readArg(2, 'r');
var g = readArg(3, 'g');
var b = readArg(4, 'b');

thingShadows.on('connect', function() {
  console.log('Connected to AWS IoT!');
  thingShadows.register(thingName);

  var stateObject = {state: {desired:
                {r: r, g: g, b: b}}};
  console.log('Updating shadow state...', stateObject);
  var clientToken = thingShadows.update(thingName, stateObject);
  console.log('Updated token', clientToken);

  thingShadows.on('status', function(thingName, stat, clientToken, stateObject) {
    console.log('stat', stat);
    console.log('status', stateObject);
  });

  setTimeout(() => {
    console.log('Disconnecting from AWS IoT...');
    thingShadows.end();
  }, 3000);
});
