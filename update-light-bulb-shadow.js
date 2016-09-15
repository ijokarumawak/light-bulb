var awsIot = require('aws-iot-device-sdk');
var twitterCount = require('./twitter-count');

const thingName = 'LightBulb';

const thingShadows = awsIot.thingShadow({
  keyPath: 'certs/private.pem.key',
  certPath: 'certs/certificate.pem.crt',
  caPath: 'certs/root-CA.crt',
  clientId: 'NiFi',
  region: 'ap-northeast-1'
});

var readArgColor = (i, x) => {
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

var updateColor = (rgb) => {
  thingShadows.on('connect', function() {
    console.log('Connected to AWS IoT!');
    thingShadows.register(thingName);

    var stateObject = {state: {desired: rgb }};
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
}

var inputSource = process.argv[2];

if ('direct' === inputSource) {
  var rgb = {
    r: readArgColor(3, 'r'),
    g: readArgColor(4, 'g'),
    b: readArgColor(5, 'b')
  };
  updateColor(rgb);

} else if ('twitter' === inputSource) {
  twitterCount.measureColors((err, rgb) => {
    updateColor(rgb);
  });

} else {
  console.log('Invalid input source', inputSource, 'should be either one of:', 'direct', 'twitter');
  process.exit(1);
}
