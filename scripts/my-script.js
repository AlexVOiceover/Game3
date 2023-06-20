
/*const playAudio = (src, callback) => {
  const audio = new Audio(src);
  audio.play();
  audio.addEventListener("ended", callback);
};
*/

/*
// Buttons for the landing page
document.getElementById("spyButton").addEventListener("click", () =>  window.location.href = "./spy.html");
document.getElementById("decoderButton").addEventListener("click", () =>  window.location.href = "./decoder.html");
*/

/*
window.addEventListener("devicemotion", handleMotion, true);

function handleMotion(event) {
  const accelerationX = event.acceleration.x;
  const accelerationY = event.acceleration.y;
  const accelerationZ = event.acceleration.z;

  const motionData = document.getElementById("motion-data");
  if (motionData){
    motionData.innerHTML = `Acceleration X: ${accelerationX?.toFixed(2) || 'N/A'}, Acceleration Y: ${accelerationY?.toFixed(2) || 'N/A'}, Acceleration Z: ${accelerationZ?.toFixed(2) || 'N/A'}`;
  }
} */
const playAudio = (src, callback) => {
  const audio = new Audio(src);
  audio.play();
  audio.addEventListener("ended", callback);
};

const backgroundMusic = document.getElementById("backgroundMusic");
backgroundMusic.volume = 0.5; // Adjust the volume as needed

document.getElementById("toggleBackgroundMusic").addEventListener("click", () => {backgroundMusic.play();})
 

window.addEventListener("deviceorientation", handleOrientation, true);

function handleOrientation(event) {
  const roll = event.gamma; // Roll angle in degrees
  const motionData = document.getElementById("motion-data");

  if (motionData) {
    motionData.innerHTML = `Roll: ${roll?.toFixed(2) || 'N/A'}`;
  }
}
