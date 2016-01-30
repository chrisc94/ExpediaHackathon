
var API_KEY = 'fWhBM0UdCM64tEW1xOqCadzjj5v8Ea23';

var loc = 'Seattle';
var startDate = '2015-08-08';
var endDate = '2015-08-08';

function processResponse(data) {
    console.log("total activities: " + data.total);
    var activities = data.activities;
    for (var i = 0; i < activities.length; i++) {
        console.log(activities[i].title);
        console.log("\t" + activities[i])
    }
}

$.getJSON('http://terminal2.expedia.com/x/activities/search?location=' + loc + '&startDate=' + startDate +
'&endDate=' + endDate + '&apikey=' + API_KEY, function(obj) {
    processResponse(obj)
});

