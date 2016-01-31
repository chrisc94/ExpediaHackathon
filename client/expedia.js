var API_KEY = 'fWhBM0UdCM64tEW1xOqCadzjj5v8Ea23';

//GLOBAL VARIABLE
var totalCost = 0;
var activities;
var markerMap = [];
var hotelMap = [];

$(window).load(function(){
    $("#filterSection").hide();
    initialize()
});

$(document).ready(function() {
    $.getScript("js/bootstrap-slider.js");
    $("#price").slider({
        value: [0, 1000]
    });

	if (typeof(Storage) !== "undefined") {
		$('#location').val(localStorage.getItem("search"));
		$('#start').val(localStorage.getItem("start"));
		$('#end').val(localStorage.getItem("end"));
		console.log(localStorage);
		findActivities(localStorage.getItem("search"), localStorage.getItem("start"), 
			localStorage.getItem("end"));
	}

    $( "#filterBtn" ).click(function() {
        $("#filterSection").toggle();
    });

/*
	$("#menu-button").click(function() {
		$('#headerContainer').toggle();

		var str = $("#menu-button").val();
		if (str === "") {
			$("#menu-button").html("&#8681 &#8681 &#8681");
			$("#menu-button").val("1");
		} else {
			$("#menu-button").html("&#8679 &#8679 &#8679");
			$("#menu-button").val("");
		}
	});
*/
	$("#submitBtn").click(function(){
        //totalCost = 0;
        //$(".panel-footer").text("Total Cost: " + totalCost);
		console.log($("#start").val());
          findActivities($("#location").val(), $("#start").val(), 
          	$("end").val());
        initialize("bam,bam");
        findActivities($("#location").val(), $("#start").val(), $("end").val());
    });

    $('#itemList').on('click', 'button.list-group-item', function(){
        $("#myTrip").append('<button type="button" id="' + this.id + '" class="list-group-item text-left"><span class="badge">' + activities[this.id].fromPrice + '</span>'  + ' <span class="score badge">'+ activities[this.id].recommendationScore  +"</span>" + activities[this.id].title + '</button>');
        toggleBounce(markerMap[this.id]);
        var results = activities[this.id].fromPrice.split('$');
        totalCost += parseInt(results[1]); 
        $(".panel-footer").text("Total Cost: " + totalCost);
        console.log("totalCost: " + totalCost);
    	this.remove();
    });

    $('#myTrip').on('click', 'button.list-group-item', function(){
        //console.log(document.getElementById("myTrip").id);
        $("#itemList").append('<button type="button" id="' + this.id + '" class="list-group-item text-left"><span class="badge">' + activities[this.id].fromPrice + '</span>' + ' <span class="score badge">'+ activities[this.id].recommendationScore  +"</span>" + activities[this.id].title + '</button>');
        toggleBounce(markerMap[this.id]);
        var results = activities[this.id].fromPrice.split('$');
        totalCost -= parseInt(results[1]); 
        $(".panel-footer").text("Total Cost: " + totalCost);
        console.log("totalCost" + totalCost);
        this.remove();
    });

    $('#hotelList').on('click', 'button.list-group-item', function() {
        if (this.style.backgroundColor == 'yellow') {
            $(this).css('background-color', 'white');
        } else {
            $(this).css('background-color', 'yellow');
        }
        toggleBounce(hotelMap[this.id]);
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
        animation: google.maps.Animation.DROP,
        map: map
    });
    return marker;
}

function addMarkerHotel(location, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
        position: location,
        animation: google.maps.Animation.DROP,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'
    });
    return marker;
}

function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function processActivities(data) {
    $('#searchResults .list-group .list-group-item').remove();
    activities = data.activities;

    var minMax = $("#price").slider("getValue").val().split(",");
    var minPrice = parseInt(minMax[0]);
    var maxPrice = parseInt(minMax[1]);
/*
    activities = filterActivities($("#minPrice").val(),
    				$("#maxPrice").val(),
    				$("#keywords").val(),
    				activities);
*/
    activities = filterActivities(minPrice,
                    maxPrice,
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

    findHotels(10, avgLat, avgLong);

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
            markerMap[i] = markers[i];
            $('#searchResults .list-group').append('<button type="button" id="' + i 
                + '" class="list-group-item text-left"><span class="badge">' + activities[i].fromPrice + '</span>' + ' <span class="score badge">'+ activities[i].recommendationScore  + "</span>" + activities[i].title + '</button>');
        }
    }
    map.fitBounds(bounds);
}

function processHotels(data) {
    console.log("total hotels: " + data.HotelCount);
    var hotelInfo = data.HotelInfoList.HotelInfo;
    for (var i = 0; i < hotelInfo.length; i++) {
        //console.log(hotelInfo[i].Name);

        var latLng = {lat: parseFloat(hotelInfo[i].Location.GeoLocation.Latitude),
                        lng: parseFloat(hotelInfo[i].Location.GeoLocation.Longitude)};
        var marker = addMarkerHotel(latLng, map);
        hotelMap[i] = marker;
        $('#hotelResults .list-group').append('<button type="button" id="' + i + '" class="list-group-item text-left">' + hotelInfo[i].Name + '</button>');
    }
}

function findHotels(numHotels, lat, long) {
    $.getJSON('http://terminal2.expedia.com/x/hotels?maxhotels=' + numHotels + '&location=' + lat +
    '%2C' + long + '&radius=25km&sort=starrating&apikey=' + API_KEY, function (obj) {
        console.log('http://terminal2.expedia.com/x/hotels?maxhotels=' + numHotels + '&location=' + lat +
        '%2C' + long + '&radius=25km&sort=starrating&apikey=' + API_KEY);
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

