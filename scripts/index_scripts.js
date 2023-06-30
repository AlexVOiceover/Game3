var rol;
const playAudio = (src, callback) => {
    const audio = new Audio(src);
    audio.play();
    audio.addEventListener("ended", callback);
  }; 
  
  const backgroundMusic = document.getElementById("indexBackgroundMusic");
  backgroundMusic.volume = 0.8; // Adjust the volume as needed 

  const proceedButton = document.getElementById("proceed");

  const selectRolTag = document.getElementById("selectRolTag");
  const instructions = document.getElementById("instructions");
 
  proceedButton.addEventListener("click", () => {

    if (rol === "left"){fadeOutAndRedirect("../spy.html");
  console.log("Interceptor");}
    else if (rol === "right"){fadeOutAndRedirect("../decoder.html");
    console.log("Decoder");}

  });
  


var imgDiv = document.getElementById("rolSelection");


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

    if (touchX < imgWidth / 2) {
      imgDiv.classList.remove("right");
      imgDiv.classList.add("left");
      selectRolTag.innerText = "Interceptor";
      instructions.innerText = "Your task is to use your device's gyro to capture enemy signals. Each capture triggers a Morse code. Have your assistant decode this on their device. Once the global scan finishes, input the decoded characters and hit \"Verify Code\".";
      rol = "left";

    } else {
      imgDiv.classList.remove("left");
      imgDiv.classList.add("right");
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



// Get the modal
var modal = document.getElementById("myModal");
// Get the button that opens the modal
var btn = document.getElementById("findHelper");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
  document.getElementById("img01").src = "./images/url.png";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
  modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  //I also use it to play the music 
  backgroundMusic.play()
}