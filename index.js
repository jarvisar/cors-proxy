// Express.js
var express = require('express'),
    request = require('request'),
    app = express();
    var path = require('path');

// Read parameters from command line
const port = process.argv[2];
const defaultURL = process.argv[3];

app.use(express.static('public'))

app.all('/proxy', function (req, res, next) {

    // Set headers here. Allows all methods from all origins by default.
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    // Pre-flight
    if (req.method === 'OPTIONS') {
        res.send();
    } else {
        var targetURL = req.header('Target-URL');
        // If no Target-URL, check if default URL was provided as parameter
        if (!targetURL) {
            if (defaultURL == undefined) {
                res.send(500, { error: 'There is no Target-URL header in the request' });
                return;
            }
            else {
                request({ url: defaultURL + req.url.replace('/proxy', ''), method: req.method, json: req.body },
                function (error, response, body) {
                    if (error) { console.error('error: ' + response.statusCode) }
                }).pipe(res);
            }
        }
        else {
            request({ url: targetURL + req.url.replace('/proxy', ''), method: req.method, json: req.body },
            function (error, response, body) {
                if (error) {
                    console.error('error: ' + response.statusCode)
                }
            }).pipe(res);
        }
    }
});

//Show HTML if visiting root of site
app.get('/', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, 'public')});
  })
  
app.use(express.static(__dirname + '/public'));
  app.get('/aladin', (req, res) => {
    res.sendFile('aladin.html', {root: path.join(__dirname, 'public')});
});

app.set('port', process.env.PORT || port || 3000);

app.listen(app.get('port'), function () {
    console.log('CORS Proxy server listening on port ' + app.get('port'));
});