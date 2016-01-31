var API_KEY = 'fWhBM0UdCM64tEW1xOqCadzjj5v8Ea23';

var loc = 'Seattle';
var startDate = '2015-08-08';
var endDate = '2015-08-08';

$(document).ready(function() {
	if (typeof(Storage) !== "undefined") {
		$('#location').val(localStorage.getItem("search"));
		$('#start').val(localStorage.getItem("start"));
		$('#end').val(localStorage.getItem("end"));
		console.log(localStorage);
		findActivities(localStorage.getItem("search"), localStorage.getItem("start"), 
			localStorage.getItem("end"));
	}


	$("#submitBtn").click(function(){
		console.log($("#start").val());
          findActivities($("#location").val(), $("#start").val(), 
          	$("end").val());
        initialize("bam,bam");
        findActivities($("#location").val(), $("#start").val(), $("end").val());
    });
})

var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

var map;

function initialize(latlong) {
    //var res = latlong.split(",");
    var mid = {lat: 47.6097, lng: -122.335167};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: mid
    });
}

// Adds a marker to the map.
function addMarker(location, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
        position: location,
        label: labels[labelIndex++ % labels.length],
        map: map
    });
    return marker;
}

function processActivities(data) {
    $('#searchResults .list-group .list-group-item').remove();
    var activities = data.activities;


    activities = filterActivities($("#minPrice").val(),
    				$("#maxPrice").val(),
    				$("#keywords").val(),
    				activities);

    var markers = [];
    for (var i = 0; i < 26; i++) {
//        $('#searchResults .list-group').append('<li class="list-group-item">' + '<span class="badge">' + 
  //      	activities[i].fromPrice + '</span>' + activities[i].title + '</li>');
		
		$('#searchResults .list-group').append('<button type="button" class="list-group-item text-left"><span class="badge">' + activities[i].fromPrice + '</span>' + activities[i].title + '</button>');

        var coords = activities[i].latLng.split(",");
        var latLng = {lat: parseFloat(coords[0]), lng: parseFloat(coords[1])};
        //console.log(coords);
        //console.log(latLng);
        var marker = addMarker(latLng, map);
        markers.push(marker);
    }

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].getPosition());
    }
    map.fitBounds(bounds);
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
    '%2C' + long + '&radius=5km&apikey=' + API_KEY, function (obj) {
        processHotels(obj);
    });
}

function findActivities(loc, startDate, endDate) {
    $.getJSON('http://terminal2.expedia.com/x/activities/search?location=' + loc + '&startDate=' + startDate +
    '&endDate=' + endDate + '&apikey=' + API_KEY, function (obj) {
        console.log('http://terminal2.expedia.com/x/activities/search?location=' + loc + '&startDate=' + startDate +
        '&endDate=' + endDate + '&apikey=' + API_KEY);
        processActivities(obj);
    });
}

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
	return filteredActivities;
}

// Takes in a minimumPrice, maximumPrice, a string of keywords where the words are separted by
// spaces, and an array of activities objects.
// Returns an array of activities objects that meet the specified conditions.
function filterActivities(minimumPrice, maximumPrice, keywords, activitiesArray) {
	var filteredActivities = activitiesArray;
	if (!(minimumPrice === "" || maximumPrice === "")) {
		filteredActivities = filterByPrice(minimumPrice, maximumPrice, activitiesArray);
	}
	if (!(keywords === "")) {
		filteredActivities = filterByKeyword(keywords, filteredActivities);
	}
	return filteredActivities;
}

