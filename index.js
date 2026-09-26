// Express.js
var express = require('express'),
    request = require('request'),
    app = express();
    path = require('path'),
    fs = require('fs');

// Read parameters from command line
const port = process.argv[2];
const defaultURL = process.argv[3];

// Some APIs (e.g. Yahoo Finance) reject requests without a browser User-Agent,
// and pages can't set that header themselves — so the proxy supplies one.
const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36';

app.use(express.static('public'))

// Matches both /proxy?query (path in Target-URL) and /proxy/some/path?query (path appended to Target-URL)
app.all(/^\/proxy(\/.*)?$/, function (req, res, next) {

    // Set headers here. Allows all methods from all origins by default.
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    if (req.header('access-control-request-headers')) {
        res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));
    }

    // Pre-flight
    if (req.method === 'OPTIONS') {
        res.send();
        return;
    }

    // If no Target-URL, check if default URL was provided as parameter
    var targetURL = req.header('Target-URL') || defaultURL;
    if (!targetURL) {
        res.send(500, { error: 'There is no Target-URL header in the request' });
        return;
    }

    var clientUA = req.header('User-Agent') || '';
    var headers = {
        'User-Agent': /^Mozilla\//.test(clientUA) ? clientUA : BROWSER_UA,
        'Accept': req.header('Accept') || 'application/json, text/plain, */*'
    };

    request({ url: targetURL + req.url.replace('/proxy', ''), method: req.method, json: req.body, headers: headers },
    function (error, response, body) {
        if (error) {
            console.error('error: ' + error.message);
            if (!res.headersSent) res.send(502, { error: error.message });
        }
    }).pipe(res);
});

//Show HTML if visiting root of site
app.get('/', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, 'public')});
  })
  
app.use(express.static(__dirname + '/public'));

app.get('/tetris', (req, res) => {
  const filePath = path.join(process.cwd(), `/public/tetris.html`);
    const htmlBuffer = fs.readFileSync(filePath);
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlBuffer);
});

app.get('/aladin', (req, res) => {
    const filePath = path.join(process.cwd(), `/public/aladin.html`);
      const htmlBuffer = fs.readFileSync(filePath);
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlBuffer);
  });

app.set('port', process.env.PORT || port || 3000);

app.listen(app.get('port'), function () {
    console.log('CORS Proxy server listening on port ' + app.get('port'));
});
