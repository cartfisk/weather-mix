// API token for openweathermap
var appId = "b84bed13d654df469398701da69d1071";
// baseurl for zipcode based API call to openweathermap
var baseUrl = "http://api.openweathermap.org/data/2.5/weather?";

var weatherIconBaseUrl = "http://openweathermap.org/img/w/";

// HTML elements from index.html
var zipcodeHomeInput = document.getElementById('zipcode-home');
var zipcodePlayerInput = document.getElementById('zipcode-player');
var submitButton = document.getElementById('zip-submit');
// appended to baseUrl when input is recieved
var zipCode;
var countryCode = "us";
// weather code returned from openweathermap
var weatherCode;

//Get the current Condition Icon Code.
var iconCode;

//Get weather Condition
var condition;
var temp;

// called on keyup event in zip input field, constructs
function updateZip() {
  if (zipcodeHomeInput.value.length >= 5) {
    zipCode = "zip=" + zipcodeHomeInput.value + ",us&APPID=" + appId;
    var url = baseUrl + zipCode + "&units=imperial";
    console.log(zipCode);
    sendRequest(url);
  }
};

function updateZipHome() {
  updateZip();
  window.location.href = "player.html";
}

function updateZipPlayer() {
  updateZip();
}

function sendRequest(url){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
      var data = JSON.parse(xmlhttp.responseText);
	    var weather = {};
	weather.code = data.weather[0].id;
	weatherCode = weather.code;

	condition = data.weather[0].main;
	temp = Math.round(data.main["temp"]);
	iconCode = data.weather[0].icon;

	console.log(weatherCode);
	console.log("Current Condition: " + condition);
	console.log("Current Temp: " + temp);
	console.log("Icon Code: " + iconCode);

	// setWeatherIcon();
	setCurTempText();
	setConditionText();

    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

zipcodeHomeInput.addEventListener('keyup', updateZipHome, false);
zipcodePlayerInput.addEventListener('keyup', updateZipPlayer, false);


//Sets the current weather icon for the UI
var setWeatherIcon = function(){
    $("#weather-icon").attr("src", weatherIconBaseUrl + iconCode + ".png");
};

var setCurTempText = function(){
    $("#temperature").text(temp + "°");
}

var setConditionText = function(){
    $("#condition").text(condition);
}
