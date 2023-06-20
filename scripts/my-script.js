
const playAudio = (src, callback) => {
  const audio = new Audio(src);
  audio.play();
  audio.addEventListener("ended", callback);
};


document.getElementById("spyButton").addEventListener("click", () =>  window.location.href = "./spy.html");
document.getElementById("decoderButton").addEventListener("click", () =>  window.location.href = "./decoder.html");


