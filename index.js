var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();

var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({limit: myLimit}));

app.all('/proxy/TAP/sync', function (req, res, next) {

    // Manually set CORS headers
    res.header("Access-Control-Allow-Origin", "https://jarvisar.github.io");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    var targetURL = req.header('Target-URL');
    if (!targetURL) {
        res.send(500, { error: 'Target-URL header is missing from the request.'})
        return;
    }
    request({ url: targetURL + req.url.replace('/proxy/', ''), method: req.method, json: req.body },
        function (error, response, body) {
            if (error) {
                console.error('error: ' + response.statusCode)
            }
            console.log(body);
        }).pipe(res);
});

app.get('/', function(req, res){
    res.sendfile('./index.html')
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});