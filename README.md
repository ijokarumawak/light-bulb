## Limitation
- AWS region is hard coded as `ap-northeast-1`

## Installation

```
npm install
```

## Setup Thing

- Create a thing named 'LightBulb' on AWS IoT
- Download its cert, private/public key, and root-CA to `certs` dir

## How to run
1. Start emulating the Light Bulb thing by:

    ```
    node light-bulb.js
    ```

1. Open web-ui/index.html from a web browser

## NiFi

1. nifi.properties
  - nifi.variable.registry.properties=<light-bulb-home>/nifi/env.properties
1. <light-bulb-home>/nifi/env.properties
  - lightbulb.home=<light-bulb-home>
1. Load templates in <light-bulb-home>/nifi/templates:
  - get-color-tweets
    - Set Consumer Key, Consumer Secret, Access Token and Access Secret of Get Color Tweets
  - save-tweets 
    - Connect red, green and blue from 'Get Color Tweets' to 'Save Tweets'
  - update-light-bulb-shadow.xml
    - Connect color-tweet-file from 'Save Tweets' to 'Update Light Bulb Shadow'
  - expose-latet-tweet
    - Enable LatestTweetsHttpContextMap
    - Change Listening Port of HandleHttpRequest if 8180 is already used
    - Send a request to `http://localhost:8180` to confirm you can retrieve the latest tweets
