// API token for openweathermap
var appId = "b84bed13d654df469398701da69d1071";
// baseurl for zipcode based API call to openweathermap
var baseUrl = "http://api.openweathermap.org/data/2.5/weather?";

// HTML elements from index.html
var zipcodeInput = document.getElementById('zipcode');
var submitButton = document.getElementById('zip-submit');
// appended to baseUrl when input is recieved
var zipCode;
var countryCode = "us";
// weather code returned from openweathermap
var weatherCode;

// called on keyup event in zip input field, constructs
function updateZip() {
  if (zipcodeInput.value.length >= 5) {
    zipCode = "zip=" + zipcodeInput.value + ",us&APPID=" + appId;
    var url = baseUrl + zipCode;
    console.log(zipCode);
    sendRequest(url);
  }
};

function sendRequest(url){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
      var data = JSON.parse(xmlhttp.responseText);
	    var weather = {};
	    weather.code = data.weather[0].id;
      weatherCode = weather.code;
      console.log(weatherCode);
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

zipcodeInput.addEventListener('keyup', updateZip, false);
