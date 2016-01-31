$(document).ready(function() {
	console.log("dfsdf");
	$.urlParam = function(name){
	    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	    if (results==null){
	       return null;
	    }
	    else{
	       return results[1] || 0;
	    }
	}
	var a = $.urlParam('a');
	if(a != null) {
		console.log("load");
		$.get("https://obscure-temple-85981.herokuapp.com/find/" + a, function(data) {
			console.log(data);
			for (var i = 0; i < data.body.length; i++) {
				var body = data.body[i];
				$("#myTrip").append('<button type="button" class="list-group-item text-left"><span class="score badge">' + body.parse + '</span>' +' <span class="score badge">'+ body.badge  +"</span>" + body.title + '</button>');	
			}
     
		});
	}

	
	console.log("word: " + $.urlParam('a'));
	$('#getcall').click(function() {
		$.get("https://obscure-temple-85981.herokuapp.com/find/56ade3fa895b8d8c0adb2b0e", function(data) {
			console.log(data);
		});
	});
});

