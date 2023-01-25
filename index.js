// Express.js
var express = require('express'),
    request = require('request'),
    app = express();

// Read parameters from command line
const port = process.argv[2];
const defaultURL = process.argv[3];

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

app.all('/iframe', function (req, res, next) {
    // create the iframe HTML string
    var iframeSrc = `http://server1.sky-map.org/skywindow?ra=${req.query.ra_h} ${req.query.ra_m} ${req.query.ra_s}&de=${req.query.de_d} ${req.query.de_m} ${req.query.de_s}&show_grid=1&img_source=DSS2&show_box=1&zoom=8&box_color=white&box_width=30&box_height=30&show_stars=1`;
    var iframeHTML = `<iframe src="${iframeSrc}" frameBorder="0" style="width: 100%; height: 100%; overflow: hidden;"></iframe>`;

    // set headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    // send the iframe HTML as the response
    res.send(iframeHTML);
});

app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy", "frame-src http://server1.sky-map.org/");
    next();
});

// Show HTML if visiting root of site
app.get('/', function(req, res) {
    res.sendfile('./index.html')
});

app.set('port', process.env.PORT || port || 3000);

app.listen(app.get('port'), function () {
    console.log('CORS Proxy server listening on port ' + app.get('port'));
});