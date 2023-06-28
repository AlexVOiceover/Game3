const playAudio = (src, callback) => {
    const audio = new Audio(src);
    audio.play();
    audio.addEventListener("ended", callback);
  };
  
  const backgroundMusic = document.getElementById("indexBackgroundMusic");
  backgroundMusic.volume = 0.8; // Adjust the volume as needed
  
 /* document.getElementById("startGame").addEventListener("click", () => {    
      backgroundMusic.play()
  }); */

  document.getElementById("spy").addEventListener("click", () => {
    fadeOutAndRedirect("spy.html");
  });
  
  document.getElementById("decode").addEventListener("click", () => {
    fadeOutAndRedirect("decoder.html");
  });
  

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
  document.getElementById("img01").src = ".Game3/images/url.png";
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
}
