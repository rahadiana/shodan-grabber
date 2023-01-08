# shodan-grabber


Easy Grab shodan data to JSON , for nodejs

INSTALATION

    npm i @rahadiana/shodan-grabber

USAGE

    const {ShodanGrabber} = require('@rahadiana/shodan-grabber')
    ShodanGrabber('redis').then(console.log)
SUCCESS RESPONSE

    {"success":true,"code":200,"message":"success get data","data":[{"name":"192.168.1.1","url":"192.168.1.1","desc":"vps..","found_at":"2023-01-08T16:46:09.983654"}]}

NOT FOUND

    {"success":false"code":500,"message":"No results found","data":""}

LIMIT REACHED

    {"success":false"code":500,"message":"Daily search usage limit reached. Please create a free account to do more searches.","data":""}

NOTE !!!!

This module require display for functionality, you can install Xdisplay on linux server varian using **Xvfb**.

SEE : *[install XvFb](https://raw.githubusercontent.com/rahadiana/shodan-grabber/main/.github/workflows/test.yml)*