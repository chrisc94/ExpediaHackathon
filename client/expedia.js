var API_KEY = 'fWhBM0UdCM64tEW1xOqCadzjj5v8Ea23';

//GLOBAL VARIABLE
var activities;

$(document).ready(function() {
	if (typeof(Storage) !== "undefined") {
		$('#location').val(localStorage.getItem("search"));
		$('#start').val(localStorage.getItem("start"));
		$('#end').val(localStorage.getItem("end"));
		console.log(localStorage);
		findActivities(localStorage.getItem("search"), localStorage.getItem("start"), 
			localStorage.getItem("end"));
	}

	$("#menu-button").click(function() {
		$('#headerContainer').toggle();
	});


	$("#submitBtn").click(function(){
		console.log($("#start").val());
          findActivities($("#location").val(), $("#start").val(), 
          	$("end").val());
        initialize("bam,bam");
        findActivities($("#location").val(), $("#start").val(), $("end").val());
    });

    $('#itemList').on('click', 'button.list-group-item', function(){
    	console.log("Hi seahawks");
    	this.remove();
    });
});



var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

var LIMIT = 1.0;

var map;

function initialize(latlong) {
    //var res = latlong.split(",");
    var mid = {lat: 47.6097, lng: -122.335167};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: mid
    });
    loadBackgroundImage();
}

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadBackgroundImage() {
	var numPictures = 3
	switch(getRandomInt (0, numPictures - 1)) {
		case 0:
			$.backstretch("img/goHawks.png");
			break;
		case 1:
			$.backstretch("img/ninersSuck.jpg");
			break;
		case 2:
			$.backstretch("img/newYork.jpg");
			break;
		default:
			window.alert("Something went wrong...");
	}

	
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
    activities = data.activities;


    activities = filterActivities($("#minPrice").val(),
    				$("#maxPrice").val(),
    				$("#keywords").val(),
    				activities);

    console.log(activities);

    var markers = [];
    for (var i = 0; i < 26; i++) {
    	if (i >= activities.length) {
    		break;
    	}

        var coords = activities[i].latLng.split(",");
        var latLng = {lat: parseFloat(coords[0]), lng: parseFloat(coords[1])};
        var marker = addMarker(latLng, map);
        markers.push(marker);
    }

    var totalLat = 0.0;
    var totalLong = 0.0;
    for (var i = 0; i < markers.length; i++) {
        totalLat += markers[i].getPosition().lat();
        totalLong += markers[i].getPosition().lng();
    }

    var avgLat = totalLat / markers.length;
    var avgLong = totalLong / markers.length;

    var bounds = new google.maps.LatLngBounds();
    for (var i = markers.length - 1; i >= 0; i--) {
        if (Math.abs(Math.sqrt(Math.pow(markers[i].getPosition().lat(), 2) + Math.pow(markers[i].getPosition().lng(), 2)) -
                Math.sqrt(Math.pow(avgLat, 2) + Math.pow(avgLong, 2))) > LIMIT) {
            markers[i].setMap(null);
            markers.splice(i, 1);
        } else {
            //console.log(Math.sqrt(Math.pow(markers[i].getPosition().lat(), 2) + Math.pow(markers[i].getPosition().lng(), 2))
             //  - Math.sqrt(Math.pow(avgLat, 2) + Math.pow(avgLong, 2)));
            bounds.extend(markers[i].getPosition());
            $('#searchResults .list-group').append('<button type="button" id="' + i + '" class="list-group-item text-left"><span class="badge">' + activities[i].fromPrice + '</span>' + activities[i].title + '</button>');
        }
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
    var price = activityObj.fromPrice;
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

