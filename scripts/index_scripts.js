const playAudio = (src, callback) => {
    const audio = new Audio(src);
    audio.play();
    audio.addEventListener("ended", callback);
  };
  
  const backgroundMusic = document.getElementById("indexBackgroundMusic");
  backgroundMusic.volume = 0.8; // Adjust the volume as needed
  
  document.getElementById("startGame").addEventListener("click", () => {    
      backgroundMusic.play();
  });

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
  
  