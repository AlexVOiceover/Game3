var rol;
var imgDiv = document.getElementById("rolSelection");
//This will handle the parameters using for settings
let value1 =2;
let value2 =2;
let value3 =2;

// Load all the images
imgDiv.classList.add("left");
imgDiv.classList.remove("left");
imgDiv.classList.add("right");
imgDiv.classList.remove("right");
  
const backgroundMusic = document.getElementById("indexBackgroundMusic");
backgroundMusic.volume = 0.8; // Adjust the volume as needed 

const proceedButton = document.getElementById("proceed");

const selectRolTag = document.getElementById("selectRolTag");
const instructions = document.getElementById("instructions");


function isAndroidDevice() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /android/i.test(userAgent);
}

if (!isAndroidDevice()) {
  var modal = document.getElementById("modalDevice");
  modal.style.display = "block";
}

proceedButton.addEventListener("click", () => {
  if (rol === "left"){
    window.location.href = `./spy.html?param1=${value1}&param2=${value2}&param3=${value3}`;
    console.log("Interceptor");
  } else if (rol === "right"){
    window.location.href = `./decoder.html`;
    console.log("Decoder");
  }
});
  
// Add event listener for touch start
imgDiv.addEventListener('touchstart', function(event) {
    handleTouch(event);
}, false);
 
// Define the function to handle touch
function handleTouch(event) {
    var imgWidth = imgDiv.offsetWidth;
    var touchX = event.touches[0].clientX - imgDiv.getBoundingClientRect().left;
   
    proceedButton.disabled = false;
    proceedButton.classList.remove("disabled");

    //Canplaythrough estimates the enough time to load the audio
    const selectAudio = new Audio("./audios/selectRole.ogg");
    selectAudio.volume = 0.2;
    selectAudio.addEventListener('canplaythrough', function() {
        selectAudio.play().catch(function(error) {
            console.log('Failed to play audio:', error);
        });
    }, false);

    if (touchX < imgWidth / 2) {
      imgDiv.classList.remove("right");
      imgDiv.classList.add("left");
      selectRolTag.classList.remove("rightAlignment");
      selectRolTag.classList.add("leftAlignment");
      selectRolTag.innerText = "Interceptor";
      instructions.innerText = "Your task is to use your device's gyro to capture enemy signals. Each capture triggers a Morse code. Have your assistant decode this on their device. Once the global scan finishes, input the decoded characters and hit \"Verify Code\".";
      rol = "left";
    } else {
      imgDiv.classList.remove("left");
      imgDiv.classList.add("right");
      selectRolTag.classList.remove("leftAlignment");
      selectRolTag.classList.add("rightAlignment");
      selectRolTag.innerText = "Decoder";
      instructions.innerText = "Listen carefully to the Morse code signals and decrypt them by tapping on your device.\n Once the global scan is complete, pass the characters to the interceptor.";
      rol = "right";
    }
}

function fadeOutAndRedirect(targetPage) {
  let fadeOutDuration = 2000; // 2 seconds in milliseconds
  let fadeStep = 0.05;
  let fadeInterval = (fadeOutDuration * fadeStep) / backgroundMusic.volume;

  let fadeOut = setInterval(() => {
    if (backgroundMusic.volume - fadeStep <= 0) {
      clearInterval(fadeOut);
      backgroundMusic.pause();
      location.href = targetPage;
    } else {
      backgroundMusic.volume -= fadeStep;
    }
  }, fadeInterval);
}

// Get the QR modal
var modal = document.getElementById("qrModal");
// Get the button that opens the modal
var btn = document.getElementById("findHelper");
// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
 }

// Get the Settings modal
var modalSettings = document.getElementById("modalSettings");
// Get the button that opens the modal
var btnSettings = document.getElementById("settingsButton");
// When the user clicks the button, open the modal 
btnSettings.onclick = function() {
  modalSettings.style.display = "block";
 }

 var speedDropdown = document.getElementById('speed-dropdown');
 var diameterDropdown = document.getElementById('diameter-dropdown');
 var signalDropdown = document.getElementById('signal-dropdown');

 
 speedDropdown.addEventListener('click', function(event) {
   event.stopPropagation();
 });
 
 speedDropdown.addEventListener('change', function(event) {
   value1 = parseInt(event.target.value);
   console.log('value1:', value1); // Output for demonstration
 });
 
 diameterDropdown.addEventListener('click', function(event) {
   event.stopPropagation();
 });
 
 diameterDropdown.addEventListener('change', function(event) {
   value2 = parseInt(event.target.value);
   console.log('value2:', value2); // Output for demonstration
 });
 
 signalDropdown.addEventListener('click', function(event) {
   event.stopPropagation();
 });
 
 signalDropdown.addEventListener('change', function(event) {
   value3 = parseInt(event.target.value);
   console.log('value3:', value3); // Output for demonstration
 });

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  //I also use it to play the music 
  backgroundMusic.play()
}


//Use this to stop the music when user swapps to another app
document.addEventListener('visibilitychange', function() {
  if (document.hidden){
      // Pause the music when the page is not visible
      backgroundMusic.pause();
  } else {
      // Resume the music when the page is visible again
      backgroundMusic.play();
  }
});
