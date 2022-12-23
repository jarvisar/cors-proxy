var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();

var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

const port = process.argv[2];
const defaultURL = process.argv[3];



app.all('/proxy/TAP/sync', function (req, res, next) {

    // Manually set CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));


    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
    var targetURL = req.header('Target-URL');

    if (!targetURL) {
        if (defaultURL == undefined){
            res.send(500, { error: 'Target-URL header is missing from the request.'})
            return;
        }
        else{
            request({ url: defaultURL + req.url.replace('/proxy', ''), method: req.method, json: req.body },
                function (error, response, body) {
                    if (error) { console.error('error: ' + response.statusCode) }
                console.log(body);
            }).pipe(res);
        }
    }
    
        request({ url: targetURL + req.url.replace('/proxy', ''), method: req.method, json: req.body },
                function (error, response, body) {
                    if (error) { console.error('error: ' + response.statusCode) }
                console.log(body);
        }).pipe(res);
    
}
});

app.get('/', function(req, res){
    res.sendfile('./index.html')
});

app.set('port', process.env.PORT || port || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});