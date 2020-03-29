var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var Pusher = require('pusher');

var pusher = new Pusher({
    appId: '971716',
    key: '87905df711b5e8a5256c',
    secret: '3b3fd799e2d9aa2a1827',
    cluster: 'ap2',
    encrypted: true
});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var heartbeatData = {
    device: 'smart-sleep-001',
    unit: 'BPM',
    dataPoints: [
    ]
}

app.get('/get-heartbeat', function (req, res) {
    res.send(heartbeatData);
});

app.get('/add-heartbeat/:heartbeat', function (req, res) {
    var heartbeat = parseInt(req.params.heartbeat);
    if (heartbeat && !isNaN(heartbeat)) {
        var newDataPoint = {
            heartbeat: heartbeat,
            time: new Date().getTime()
        };
        heartbeatData.dataPoints.push(newDataPoint);
        pusher.trigger('heartbeat', 'new-heartbeat', {
            dataPoint: newDataPoint
        });
        res.send({ success: true });
    } else {
        res.send({ success: false, errorMessage: 'Invalid Query Paramaters, required - heartbeat & time.' });
    }
});

// Error Handler for 404 Pages
app.use(function (req, res, next) {
    var error404 = new Error('Route Not Found');
    error404.status = 404;
    next(error404);
});

module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`app is listening on port ${PORT}`)
});