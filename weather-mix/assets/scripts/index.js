// HTML element from index.html
// Initialized in global.js
zipcodeInput = document.getElementById('zipcode-home');

function updateZipHome() {
  if (zipcodeInput.value.length >= 5) {
    // loaded from global.js
    updateZip();
    window.location.href = "player";
  }
}

zipcodeInput.addEventListener('keyup', updateZipHome, false);
