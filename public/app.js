// Using IIFE for Implementing Module Pattern to keep the Local Space for the JS Variables
(function () {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    var serverUrl = "/",
        members = [],
        pusher = new Pusher('87905df711b5e8a5256c', {
            cluster: 'ap2',
            encrypted: true
        }),
        channel,
        heartChartRef;

    function showEle(elementId) {
        document.getElementById(elementId).style.display = 'flex';
    }

    function hideEle(elementId) {
        document.getElementById(elementId).style.display = 'none';
    }

    function ajax(url, method, payload, successCallback) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4 || xhr.status != 200) return;
            successCallback(xhr.responseText);
        };
        xhr.send(JSON.stringify(payload));
    }


    function renderHeartChart(heartData) {
        var ctx = document.getElementById("heartchart").getContext("2d");
        var options = {};
        heartChartRef = new Chart(ctx, {
            type: "line",
            data: heartData,
            options: options
        });
    }

    var chartConfig = {
        labels: [],
        datasets: [
            {
                label: "Heartbeat",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [],
                spanGaps: false,
            }
        ]
    };

    ajax("/get-heartbeat", "GET", {}, onFetchHeartbeatSuccess);

    function onFetchHeartbeatSuccess(response) {
        hideEle("loader");
        var respData = JSON.parse(response);

        points = respData.dataPoints.slice(Math.max(respData.dataPoints.length - 60, 1));

        chartConfig.labels = points.map(dataPoint => {
            return getFormatedTime(dataPoint.time);
        });
        chartConfig.datasets[0].data = points.map(dataPoint => dataPoint.heartbeat);
        renderHeartChart(chartConfig)
    }

    channel = pusher.subscribe('heartbeat');
    channel.bind('new-heartbeat', function (data) {
        var newHeartbebat = data.dataPoint;
        if (heartChartRef.data.labels.length > 15) {
            heartChartRef.data.labels.shift();
            heartChartRef.data.datasets[0].data.shift();
        }

        heartChartRef.data.labels.push(getFormatedTime(newHeartbebat.time));
        heartChartRef.data.datasets[0].data.push(newHeartbebat.heartbeat);
        heartChartRef.update();
    });

    function getFormatedTime(timestamp) {
        var date = new Date(timestamp);
        var formattedTime = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getDate()} ${('0' + (date.getHours())).slice(-2)}:${('0' + (date.getMinutes())).slice(-2)}-${('0' + (date.getSeconds())).slice(-2)}`;
        return formattedTime;
    }

    /* TEMP CODE FOR TESTING */
    // var dummyTime = 1500;
    // setInterval(function () {
    //     var timestamp = new Date().getTime();
    //     ajax("/add-heartbeat?heartbeat=" + getRandomInt(10, 20), "GET", {}, () => { });
    // }, 1000);

    // function getRandomInt(min, max) {
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // }
    /* TEMP CODE ENDS */

})();