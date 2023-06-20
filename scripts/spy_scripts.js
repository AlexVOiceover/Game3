const playAudio = (src, callback) => {
  const audio = new Audio(src);
  audio.play();
  audio.addEventListener("ended", callback);
};

const backgroundMusic = document.getElementById("backgroundMusic");
backgroundMusic.volume = 0.5; // Adjust the volume as needed

document.getElementById("toggleBackgroundMusic").addEventListener("click", () => {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
  } else {
    backgroundMusic.pause();
  }
});
 
window.addEventListener("deviceorientation", handleOrientation, true);

function handleOrientation(event) {
  const roll = event.gamma; // Roll angle in degrees
  const motionData = document.getElementById("motion-data");

  if (motionData) {
    motionData.innerHTML = `Roll: ${roll?.toFixed(2) || 'N/A'}`;
  }
}
