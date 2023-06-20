
/*const playAudio = (src, callback) => {
  const audio = new Audio(src);
  audio.play();
  audio.addEventListener("ended", callback);
};
*/

// Buttons for the landing page
document.getElementById("spyButton").addEventListener("click", () =>  window.location.href = "./spy.html");
document.getElementById("decoderButton").addEventListener("click", () =>  window.location.href = "./decoder.html");


window.addEventListener("devicemotion", handleMotion, true);

function handleMotion(event) {
  const accelerationX = event.acceleration.x;
  const accelerationY = event.acceleration.y;
  const accelerationZ = event.acceleration.z;

  const motionData = document.getElementById("motion-data");
  motionData.innerHTML = `Acceleration X: ${accelerationX.toFixed(2)}, Acceleration Y: ${accelerationY.toFixed(2)}, Acceleration Z: ${accelerationZ.toFixed(2)}`;
}
