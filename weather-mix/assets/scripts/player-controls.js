SC.initialize({
     client_id: '175c043157ffae2c6d5fed16c3d95a4c'
});

//Get UI Element references
var title = document.getElementById('title');
var duration = document.getElementById('duration');
var currTime = document.getElementById('currTime');
var scrubber = $("#scrubber");
var totalTrackWidth = $("#track").width();
var volumeSlider = $("#volume-slider");

//Get back-end variables for playback
var trackQueue = []; //Reference recieved from player-queue.js
var nowPlaying; //Reference recieved from player-queue.js
var audioInstance;
var curVolumeLevel;
var shuffle = false;
var repeatAll = false;
var repeatOne = false;


/**
Handles resolving a Track URL from SoundCloud and streams it by 
creating a new HTML5 audio object to stream to custom player
**/
var streamTrack = function(track){    
    SC.get("/tracks/" + track.id).then(function(sound){
	
	var uri = sound.uri + "/stream?client_id=175c043157ffae2c6d5fed16c3d95a4c";

	if (audioInstance){
	    console.log("Resetting Audio Instance");
	    //Reset Audio Profile
	    audioInstance.pause();
	    audioInstance.currentTime = 0;
	}

	//Create a new instance of streaming audio
	audioInstance = new Audio(uri);

	//Start playback and set relevant UI elements.
	audioInstance.play();
	console.log("Playback started.");
	togglePlayPauseUI(); //Toggle Play Button
	startCounter; //Start Seek Time UI

	//Set Volume Levels UI
	curVolumeLevel = audioInstance.volume;
	setVolumeLevelUI(curVolumeLevel * 100);
	console.log("Current Volume Level: " + curVolumeLevel);

	/*************************************************************
	 *                   Media Event Handlers                    *
	 ************************************************************/
	//Sets the Scrubber Position from the song position on update
	audioInstance.ontimeupdate = function(){
	    var percentage = audioInstance.currentTime / audioInstance.duration;
	    scrubber.css("width", percentage.toFixed(2)*totalTrackWidth);
	};

	//Set the total Time duration of song on the load end of media
	audioInstance.onloadeddata = function(){
	    console.log("Load Ended");
	    console.log(audioInstance.duration);
	    var durationTotal = getMinSec(audioInstance.duration);
	    duration.innerText = durationTotal;
	};

	//When Audio has finished playing, load next song
	audioInstance.onended = function(){
	    console.log("Playback Complete.");
	    streamNextSong();

	};
	
    });

    //Set Rest of track Information on Below player 
    console.log("Now Playing: " + nowPlaying);
    title.innerText = track.title + ' by ' + track.user.username;
    
};

/*********************************************************************
 *                        Audio Logic                                *
*********************************************************************/

//Updates the Song position when user moves the scrubber
var updateSongPosition = function(percentage){
    if (audioInstance){
	console.log("Song Position Changed.");
	audioInstance.currentTime = audioInstance.duration * percentage;
    }
};

//Handles playing and pausing music based on current state.
var togglePlayPauseStream = function(){
    if (audioInstance) {

	//If the current state is playing, we toggle to pause
	if(!audioInstance.paused){
	    audioInstance.pause();
	    togglePlayPauseUI();
	    console.log("Paused.");
	}
	else{
	    audioInstance.play();
	    togglePlayPauseUI();
	    console.log("Playing.");   
	}
    }
    else{
	console.log("Player Not Active!");
    }
};

//Hanldes playing the next song in queue
var streamNextSong = function(){
    if (audioInstance){
	//if repeatOne flag is set, replay current song.
	if(repeatOne){
	    console.log("Repeat One is on, restarting lastplayed song.");
	    audioInstance.currentTime = 0; //restart song
	    audioInstance.play();
	    return true;
	}

	if(shuffle){
	    var href = getRandomSong();
	}
	else{
	    var href = getNextTrackHref(nowPlaying);
	}
	
	console.log("Currently playing: " + nowPlaying);
	console.log("Next song should be: " + href);

	if(href) {
    	    SC.resolve(href).then(streamTrack);
    	    nowPlaying = href;
    	    return true;
	}

	//After this if statement assumes no next track found.

	//If the repeat all flag is set, replay first song in queue
	if(repeatAll){
	    var href = getQueueFirst();
	    if (!href){
		console.log("Error: failed to retrieve Href")
	    }
	    else{
		SC.resolve(href).then(streamTrack);
		nowPlaying = href;
		return true;
	    }
	}
	
	//These two events are the equivalent of STOP.
	audioInstance.pause();
	audioInstance.currentTime = 0;
	console.log("No Next Track Found.");
    	//play next track
    }
    else{
	console.log("Player Not Active!");
    }
};

// Keeps track of player position every 1000 mils
var startCounter = setInterval(function() {
    if(audioInstance) {	
	var newTime = audioInstance.currentTime;
	var text = getMinSec(newTime);
	
	currTime.innerText = text;
	console.log(currTime.innerText);
    }
}, 1000);

//Returns the text representation of Minutes : Seconds time secs
var getMinSec = function(time){
    var min = Math.floor(time / 60);
    var sec = Math.floor(time % 60);

    if(sec < 10) {
	sec = "0" + sec;
    }
    if(min >= 10){
	min = "0" + min;
    }

    return min + ':' + sec;

};


/*********************************************************************
 *                Control Click Event Behavior                       *
*********************************************************************/
//Toggle Play pause
document.getElementById('play-pause').addEventListener('click', function(){
    togglePlayPauseStream();
});


//Handle Space Bar Key Press to toggle playback
$(window).keypress(function(e) {
    if (e.which === 32) {
	togglePlayPauseStream();
    }
});


//On click event means replaying the current song.
document.getElementById('next').addEventListener('click', function(){
    streamNextSong();
});


//Single click resolves as restarting the song.
document.getElementById('previous').addEventListener('click', function(){
    if (audioInstance) {
	//Equivalent of restarting song.
	audioInstance.currentTime = 0;
    }
});


//Double Click Event calls the previous song in queue.
document.getElementById('previous').addEventListener('dblclick', function(){
    if(audioInstance){
	//If the shuffle state is on, we get a random song.
	if (shuffle){
	    var href = getRandomSong();
	}
	else{
	    var href = getPreviousTrackHref(nowPlaying);
	}
	console.log("Currently playing: " + nowPlaying);
	console.log("Next song should be: " + href);
	if(href) {
	    SC.resolve(href).then(streamTrack);
	    nowPlaying = href;
	    return true;
	}	
	else{
	    console.log("No Previous Track Found.");
	    //Current Song then must be first in queue.
	    audioInstance.currentTime = 0; //Restart Song
	    return true;
	}
    }    
});


//Handles the on click of the scrubber
$("#track").on("click", function(e){
    if(audioInstance){
	console.log("Scrubber Updated.");
	var xClick = e.clientX;

	console.log("Last Clicked X Pos: " + xClick);
	
	var trackLeft = $(this).offset().left;
	
	var percentagePos = (xClick - trackLeft) / totalTrackWidth;

	//Update the UI Position of track
	moveScrubberToPos(percentagePos * totalTrackWidth);

	updateSongPosition(percentagePos);
    }
});

//Handler for clicking the volume slider
$("#volume-track").on("click", function(e){
    if(audioInstance){
	var totalVolumeTrack = $("#volume-track").width();
	
	console.log("Volume Updated.");
	var xClick = e.clientX;
	var sliderLeft = $(this).offset().left;
	
	var percentagePos = (xClick - sliderLeft) / totalVolumeTrack;

	//Update the UI Position of track
	setVolumeLevelUI(percentagePos * totalVolumeTrack);

	audioInstance.volume = percentagePos;
    }
});

// Handles toggle the repeat button between states:
// Repeat All
// Repeat One
// OFF
$("#repeat").on("click", function(){

    //If both states are off, it means the toggle is off.
    if (!repeatOne && !repeatAll){
	//Toggle to state: REPEAT ALL.
	repeatAll = true;
	$("#repeat-inner-icon").css("color", "grey");
	$("#repeat-inner-icon").text(" all");
	console.log("New Playback Mode: Repeat ALL");

    }
    //If we are currently in state: REPEAT ALL
    else if(repeatAll && !repeatOne){
	//Toggle to state: REAPEAT ONE
	repeatAll = false;
	repeatOne = true;
	$("#repeat-inner-icon").text(" 1");
	console.log("New Playback Mode: Repeat ONE");
    }
    //If we are currently in state: REPEAT ONE
    else if(repeatOne && !repeatAll){
	//Toggle to state: OFF
	repeatAll = false;
	repeatOne = false;
	$("#repeat-inner-icon").css("color", "black");
	$("#repeat-inner-icon").text("");
	console.log("New Playback Mode: Repeat OFF");
    }
    else{
	console.log("ERROR: Repeat Toggle State Unknown.");
    }

});


//Handles Toggling the shuffle mode on the UI
$("#shuffle").on('click', function(){
    //If Shuffle is off, turn it on.
    if(!shuffle){
	shuffle = true;
	$("#shuffle-inner-icon").css("color", "grey");
	console.log("New Playback Mode: Shuffle ON")
    }
    else{
	shuffle = false;
	$("#shuffle-inner-icon").css("color", "black");
	console.log("New Playback Mode: Shuffle OFF")
    }

});


/*********************************************************************
 *                     Player UI Setters                             *
*********************************************************************/

//Toggles the PlayPause Button UI based on the state of play
var togglePlayPauseUI = function(){
    if (audioInstance) {

	//If the current state is playing, we toggle to pause
	if(!audioInstance.paused){
	    //Remove previous classes before toggling.
	    $('#play-pause-inner-icon').removeClass();
	    $('#play-pause-inner-icon').addClass("fa fa-pause");
	}
	else{
	    $('#play-pause-inner-icon').removeClass();
	    $("#play-pause-inner-icon").addClass("fa fa-play");
	}
    }
    else{
	console.log("Player Not Active!");
    }
};


//Sets the level bar of the Volume Button
var setVolumeLevelUI = function(percentage){
    volumeSlider.css("width", percentage + "%");
};

//Moves the scrubber to where the user clicked
var moveScrubberToPos = function(offset){
    scrubber.css("width", offset);
};

