$(document).ready(function() {
    //Reload Queue Upon loading the page.
    reloadQueue();
});

SC = JSON.parse(SC);

//Load all of the songs into player queue upon loading page.
var reloadQueue = function(e, ui){
    //Reset Queue
    trackQueue = []
    console.log("Queue Reloaded.")
    //Retrieve all link elements as objs
    elements = $("tr.clickable-row").find("a").toArray();

    console.log("Reloaded Queue: ");

    console.log("-----------------------");
    elements.forEach(function(elem){
	trackQueue.push(elem["href"]);
	console.log(elem["href"]);
    });
    console.log("-----------------------");
    return ui;
};


// Handle the click event of the row to start
// Streaming song
$('.clickable-row').click(function(event) {
  event.preventDefault();
  var href = $(this).find("a").attr("href");
  if(href) {

    // SC.get(href, function(err, track) {
    //       if ( err ) {
    //         throw err;
    //       } else {
    //         console.log('track retrieved:', track);
    //       }
    //     });
  	SC.resolve(href).then(streamTrack);
    nowPlaying = $(this).find("a").attr("href");

  }
 });


// Handler for re-ordering the queue to the user's specification
var fixHelper = function(e, ui) {
    console.log("Re-Order Triggered!");
    ui.children().each(function() {
	$(this).width($(this).width());
    });

    return ui;
};

$("#sort tbody").sortable({
    helper: fixHelper,
    update: reloadQueue //Reload Queue Order After Sorting.
}).disableSelection();
$("#sort tbody").on("reloadQueue", reloadQueue); //bind
//----------Handler End

//Handles getting the Href of the next track in the queue
//Returns null if no track is found.
var getNextTrackHref = function(trackHref){
    currentTrackIndex = trackQueue.indexOf(trackHref);

    if (currentTrackIndex > -1){
	if(!(trackQueue[currentTrackIndex + 1] === undefined)){
	    return trackQueue[currentTrackIndex + 1];
	}

    }

    return null; //No Next track url found.

};

//handles getting the Href of the previous track in queue,
//Returns null if no track is found.
var getPreviousTrackHref = function(trackHref){
    currentTrackIndex = trackQueue.indexOf(trackHref);

    console.log("Track Index: " + currentTrackIndex);

    if (currentTrackIndex > -1){
	if(!(trackQueue[currentTrackIndex - 1] === undefined)){
	    console.log("Previous Track: " + trackQueue[currentTrackIndex - 1]);
	    return trackQueue[currentTrackIndex - 1];
	}
	console.log("Previous Track is undefined")

    }

    return null; //No Prev track url found.

}

//Handles getting the first song in queue as href.
var getQueueFirst = function(){
    var queueFirst = $("tbody tr").first();
    var firstHref = queueFirst.find("a").attr("href");

    return firstHref;
}

//Handles returning a randomly selected href from trackqueue;
var getRandomSong = function(){
    var random = Math.floor((Math.random() * trackQueue.length));
    var randHref = trackQueue[random];

    return randHref;
};

//============== Possibly Useful in future features =================
//Removes the first link element from the queue
var popQueueHead = function(){
    var removed = trackQueue.shift();

    console.log("Removed: " + removed);

    removeQueueHTMLElement(removed);

    //Reload the Queue After the removal process.
    reloadQueue();
};

//Removes HTML td element given.
var removeQueueHTMLElement = function(){
    $("tbody tr").first().remove();
    console.log("Removed HTML Element from player.");
}

//Checks wether a passed in row element is first relative to the DOM
var isQueueHead = function(element){
    var queueFirst = $("tbody tr").first();
    var firstHref = queueFirst.find("a").attr("href");
    var target = element.find("a").attr("href");


    if (!(firstHref === target)){
	return false;
    }

    return true;
};

//Adds Song row to beginning of queue, triggers update queue
var addToBeginningOfQueue = function(element){
    console.log("Adding to beginning of list");
    var queue = $("#sort tbody");
    queue.prepend(element);
    queue.trigger("reloadQueue", {item: element});
};
