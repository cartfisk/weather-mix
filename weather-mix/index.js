var express = require('express');
var path = require('path');
var SC = require('node-soundcloud');

SC.init({
     client_id: '175c043157ffae2c6d5fed16c3d95a4c'
});

var app = express();
var port = 3000;

app.use(express.static(__dirname + '/'))

app.set('views', __dirname + '/views');
app.set('view engine', 'pug')

app.get('/', function (req, res) {
    res.render(
        'home',
        {})
})

app.get('/player', function (req, res) {
    res.render(
        'player',
        { SC: SC })
})

app.listen(port, function () {
    console.log('Listening on port ' + port + '.')
})
