var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();

var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({limit: myLimit}));

app.all('/proxy/TAP/sync', function (req, res, next) {

    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "https://jarvisar.github.io");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));
    let fs = require('fs');
    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        var targetURL = req.header('Target-URL');
        if (!targetURL) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(req.url)
            res.end()
            return;
        }
        request({ url: targetURL + req.url.replace('/proxy/', ''), method: req.method, json: req.body },
            function (error, response, body) {
                if (error) {
                    console.error('error: ' + response.statusCode)
                }
                console.log(body);
            }).pipe(res);
    }
});

app.get('/', function(req, res){
    res.sendfile('./index.html')
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});