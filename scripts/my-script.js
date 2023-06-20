
/*const playAudio = (src, callback) => {
  const audio = new Audio(src);
  audio.play();
  audio.addEventListener("ended", callback);
};
*/

document.getElementById("spyButton").addEventListener("click", () =>  window.location.href = "./spy.html");
document.getElementById("decoderButton").addEventListener("click", () =>  window.location.href = "./decoder.html");


window.addEventListener("devicemotion", handleMotion, true);

function handleMotion(event) {
  const accelerationX = event.accelerationIncludingGravity.x;
  const accelerationY = event.accelerationIncludingGravity.y;
  const accelerationZ = event.accelerationIncludingGravity.z;

  const motionData = document.getElementById("motion-data");
  motionData.innerHTML = `Acceleration X: ${accelerationX.toFixed(2)}, Acceleration Y: ${accelerationY.toFixed(2)}, Acceleration Z: ${accelerationZ.toFixed(2)}`;
}