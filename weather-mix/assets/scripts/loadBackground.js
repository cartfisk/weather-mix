
    console.log("Fetching New Photo every 10 seconds");
    var intervalFetcter = setInterval(fetchNewPhoto, 10000);


    function fetchNewPhoto(){
	console.log("Fetching new photo");

	var appId = "26bca8e6843cbda584d5090ea6d774fbe00ffa43a50cf8b16d89a421260f5883"
	
	var url = "https://api.unsplash.com/photos/random?client_id=" + appId + "&query='weather'";
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
		var data = jQuery.parseJSON(xmlhttp.responseText);
		console.log(data.urls.full);
		
		var url = data.urls.full;

		var fname = data.user.first_name;

		var lname = data.user.last_name;

		var profile_url = data.user.links.html;

		console.log("Links:" +  profile_url);

		console.log("New Background Photo obtained. Waiting for content.");

		var img = new Image();

		img.src = url;

		img.onload = function(){
		    console.log("Image Loaded!");
		    $(".background-image").fadeOut(1500, function(){
			$(".background-image").css('backgroundImage','url('+ url +')');
			$(".background-image").css('z-index', '1');
			$(".background-image").css('background-position', 'center top no-repeat');
			
		    }).fadeIn(1000);

		    console.log("Changing submission name");
		    
		    changeSourceAuthor(fname, lname, profile_url)

		}
	    }
	    else{
		//Use Default image if onload fails.
		console.log("Default Image Loaded");
	    }
	};

	xmlhttp.open("GET", url, true);
	xmlhttp.send();

    };


function changeSourceAuthor(fname, lname, portfolio) {
    $("#photo-credit").attr('href', portfolio);
    $("#photo-credit").text("Photo Submitted By " + fname + " " + lname);     
}
