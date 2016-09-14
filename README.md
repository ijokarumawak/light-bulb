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

1. Open index.html from a web browser
