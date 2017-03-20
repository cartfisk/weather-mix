// CONSTANTS

// baseurls for openweathermap endpoints
var baseUrl = "http://api.openweathermap.org/data/2.5/weather?";
var weatherIconBaseUrl = "http://openweathermap.org/img/w/";
// country code for openweathermap. App is US only for the time being.
var countryCode = "us";

// appended to baseUrl when input is recieved
var zipCode;

// variables to hold data returned from openweathermap API
var weatherCode;
var iconCode;
var temp;
// openweathermap condition converted to 1 of 6 conditions relevant to weatherMix
var condition;

// zipcode input field
var zipcodeInput;

// called on keyup event in zip input field, constructs
function updateZip() {
    zipCode = "zip=" + zipcodeInput.value + ",us&APPID=" + appId;
    var url = baseUrl + zipCode + "&units=imperial";
    console.log(zipCode);
    sendRequest(url);
};

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
