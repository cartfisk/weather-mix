// var SC = require('node-soundcloud');

// Initialize client with additional accessToken field
// SC.init({
//   id: 'your SoundCloud client ID',
//   secret: 'your SoundCloud client secret',
//   uri: 'your SoundCloud redirect URI',
//   accessToken: 'your existing access token'
// });

// baseurl for zipcode based API call to openweathermap
var baseUrl = "http://api.openweathermap.org/data/2.5/weather?";

var weatherIconBaseUrl = "http://openweathermap.org/img/w/";

// HTML elements from index.html

function updateZipPlayer() {
  if (zipcodeInput.value.length >= 5 || zipcode.toString.length >= 5) {
    updateZip();
    console.log(condition);
  }
}

console.log(document.getElementById('zipcode-player'));
zipcodeInput = document.getElementById('zipcode-player');
// zipcodeInput.addEventListener('keyup', updateZipPlayer, false);
