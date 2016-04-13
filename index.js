/**
 * Created by GT72 on 13.04.2016.
 */

var express = require('express');
var request = require('request');
var app = express();

var port = 3000;


function generateJson(json) {
    var html = '';
    for (var prop in json) {
        if (typeof json[prop] === 'object') {
            html += `<div class="row"><div class="property">${prop}</div>:<div class="value">${generateJson(json[prop])}</div></div>`;
        } else {
            html += `<div class="row"><div class="property">${prop}</div>:<div class="value">${json[prop]}</div></div>`;
        }
    }
    return html;
}

app.use(express.static('public'));
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
    res.render('index.ejs', {});
});

app.get('/vin-info/:vin', function(req, res, next) {
    var url = `https://api.edmunds.com/v1/api/toolsrepository/vindecoder?api_key=q4gs8mc7dncy2pcf2t44xk7u&fmt=json&vin=${req.params.vin}`;
    console.log('url', url);
    request.get(url, function(err, response, body) {
        if (!err && response.statusCode == 200) {
            var locals = JSON.parse(body);
            //res.render('<h2>It works</h2>', locals);
            res.render('vin.ejs', {
                vin: req.params.vin,
                vinResult: generateJson(locals)
            });
            //res.send(`<div class="vin-result">${generateJson(locals)}</div>`);
            console.log('Data received');
        } else {
            res.send(err);
            console.log(err);
        }
    });
});

console.log('sever started at port ', port);
app.listen(port);
