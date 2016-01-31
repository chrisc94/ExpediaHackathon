$(document).ready(function() {
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
		$.get("https://obscure-temple-85981.herokuapp.com/find/" + a, function(data) {
			console.log(data);
		});
	}

	
	console.log("word: " + $.urlParam('a'));
	$('#getcall').click(function() {
		$.get("https://obscure-temple-85981.herokuapp.com/find/56ade3fa895b8d8c0adb2b0e", function(data) {
			console.log(data);
		});
	});
});

