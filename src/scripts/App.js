var zipcode = document.getElementById('zipcode');

function outputzip() {
  console.log(zipcode.value);
};

zipcode.addEventListener('keyup', outputzip, false);
