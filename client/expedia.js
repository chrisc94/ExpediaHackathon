
var API_KEY = 'fWhBM0UdCM64tEW1xOqCadzjj5v8Ea23';

var loc = 'Seattle';
var startDate = '2015-08-08';
var endDate = '2015-08-08';

$(document).ready(function() {
	if (typeof(Storage) !== "undefined") {
		console.log(localStorage);
	}

	$("#submitBtn").click(function(){
          findActivities($("#location").val(), $("#start").val(), 
          	$("end").val());
      });
}) 

function processActivities(data) {
    console.log("data: " + data);
	$('#searchResults .list-group .list-group-item').remove();
    console.log("total activities: " + data.total);
    var activities = data.activities;
    activities = filterActivities(document.getElementById("minPrice").val(),
    				document.getElementById("maxPrice").val(),
    				document.getElementById("keywords").val(),
    				activities);
    for (var i = 0; i < activities.length; i++) {
    	$('#searchResults .list-group').append('<li class="list-group-item">'+ activities[i].title +'</li>');
    }
}

function processHotels(data) {
    console.log("total hotels: " + data.HotelCount);
    var hotelInfo = data.HotelInfoList.HotelInfo;
    for (var i = 0; i < hotelInfo.length; i++) {
        console.log(hotelInfo[i].Name);
    }
}

function findHotels(numHotels, lat, long) {
    // http://terminal2.expedia.com/x/hotels?maxhotels=10&location=47.6063889%2C-122.3308333&radius=10km&apikey=fWhBM0UdCM64tEW1xOqCadzjj5v8Ea23
    $.getJSON('http://terminal2.expedia.com/x/hotels?maxhotels=' + numHotels + '&location=' + lat +
    '%2C' + long + '&radius=5km&apikey=' + API_KEY, function(obj) {
        processHotels(obj);
    });
}

function findActivities(loc, startDate, endDate) {
    $.getJSON('http://terminal2.expedia.com/x/activities/search?location=' + loc + '&startDate=' + startDate +
    '&endDate=' + endDate + '&apikey=' + API_KEY, function(obj) {
        processActivities(obj);
    });
}

//findActivities(loc, startDate, endDate);
findHotels(10, 47.6063889, -122.3308333);

// Takes in a minPrice, maxPrice, and an array of activities objects and returns an array
// of activities objects that have a price that is above minPrice and below maxPrice.
function filterByPrice(minPrice, maxPrice, activitiesJsonObj) {
	var priceArray = [];
	var filteredActivities = [];
	for (var j = 0; j < activitiesJsonObj.length; j++) {
		var pr = getPriceOfActivity(activitiesJsonObj[j]);
		if (pr >= minPrice && pr <= maxPrice) {
			priceArray.push(pr);
			filteredActivities.push(activitiesJsonObj[j]);
		}
	}
	//document.getElementById("test").innerHTML = filteredActivities;
	return filteredActivities;
}


// Returns the price of the passed in activity.
function getPriceOfActivity(activityObj) {
	var price = activityObj.fromPrice
	//document.getElementById("test").innerHTML = price;
	var num = price.slice(1);
	return parseInt(num);
}

// Takes in a list of keywords that are separated by spaces and an array of activities
// objects and returns an array of activities objects that have at least one of the
// keywords in the title field of the activity.
function filterByKeyword(keywords, activitiesJsonObj) {
	var keywordsArr = keywords.toLowerCase().split(" ");
	var filteredActivities = [];
	var titleArr = [];
	for (var i = 0; i < activitiesJsonObj.length; i++) {
		var titleString = activitiesJsonObj[i].title.toLowerCase();
		for (var j = 0; j < keywordsArr.length; j++) {
			if (titleString.indexOf(keywordsArr[j]) > -1) {
				filteredActivities.push(activitiesJsonObj[i]);
				break;
			}
		}
		titleArr.push(titleString);
	}
	document.getElementById("test").innerHTML = titleArr;
	return filteredActivities;
}

// Takes in a minimumPrice, maximumPrice, a string of keywords where the words are separted by
// spaces, and an array of activities objects.
// Returns an array of activities objects that meet the specified conditions.
function filterActivities(minimumPrice, maximumPrice, keywords, activitiesArray) {
	var filteredActivities = filterByPrice(minimumPrice, maximumPrice, activitiesArray);
	var filteredActivities2 = filterByKeyword(keywords, filteredActivities);
	return filteredActivities2;
}
