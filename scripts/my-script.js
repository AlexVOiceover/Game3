
const playAudio = (src, callback) => {
  const audio = new Audio(src);
  audio.play();
  audio.addEventListener("ended", callback);
};


document.getElementById("spyButton").addEventListener("click", () =>  window.location.href = "./spy.html");
document.getElementById("decoderButton").addEventListener("click", () =>  window.location.href = "./decoder.html");


window.addEventListener("deviceorientation", handleOrientation, true);

function handleOrientation(event) {
  const alpha = event.alpha;
  const beta = event.beta;
  const gamma = event.gamma;

  const orientationData = document.getElementById("orientation-data");
  orientationData.innerHTML = `Alpha: ${alpha.toFixed(2)}, Beta: ${beta.toFixed(2)}, Gamma: ${gamma.toFixed(2)}`;
}