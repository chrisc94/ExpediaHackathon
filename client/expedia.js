
var API_KEY = 'fWhBM0UdCM64tEW1xOqCadzjj5v8Ea23';

//callExpediaAPI("Seattle", "2015-08-08", "2015-08-08");

var loc = 'Seattle';
var startDate = '2015-08-08';
var endDate = '2015-08-08';

$.getJSON('http://terminal2.expedia.com/x/activities/search?location=' + loc + '&startDate=' + startDate +
'&endDate=' + endDate + '&apikey=' + API_KEY, function(obj) {
    //alert(JSON.stringify(json_data));
    //var obj = JSON.parse(data);
    console.log("total activities: " + obj.total);
    var activities = obj.activities;
    for (var i = 0; i < activities.length; i++) {
        console.log(activities[i].title);
        console.log("\t" + activities[i])
    }

    //processResponse(data)
});

/*$.ajax({
 type: "GET",
 url: 'terminal2.expedia.com/x/activities/search?location=' + loc + '&startDate=' + startDate +
 '&endDate=' + endDate + '&apikey=' + API_KEY,
 dataType: "json",
 success: processResponse,
 error: function(){ alert("failed"); }
 });*/

/*function processResponse(data) {
 var obj = JSON.parse(data);
 console.log("total activities: " + obj.total);
 var activities = obj.activities;
 for (var i = 0; i < activities.length; i++) {
 console.log(activities[i].title);
 console.log("\t" + activities[i])
 }
 }*/


